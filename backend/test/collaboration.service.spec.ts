import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import {
  BadRequestException,
  ConflictException,
  ForbiddenException,
  NotFoundException,
} from '@nestjs/common';
import { CollaborationService } from '../src/collaboration/collaboration.service';
import { CollaborationInvite, InviteStatusEnum } from '../src/collaboration/invite.entity';
import { UsersService } from '../src/users/users.service';
import { User } from '../src/users/user.entity';

function makeUser(id: string, email: string): User {
  const u = new User();
  u.id = id;
  u.email = email;
  u.passwordHash = 'hash';
  u.createdAt = new Date();
  return u;
}

function makeInvite(
  id: string,
  senderId: string,
  receiverId: string,
  status: InviteStatusEnum = InviteStatusEnum.PENDING,
): CollaborationInvite {
  const inv = new CollaborationInvite();
  inv.id = id;
  inv.senderId = senderId;
  inv.receiverId = receiverId;
  inv.status = status;
  inv.createdAt = new Date();
  inv.updatedAt = new Date();
  return inv;
}

describe('CollaborationService', () => {
  let service: CollaborationService;
  let inviteRepo: jest.Mocked<Repository<CollaborationInvite>>;
  let usersService: jest.Mocked<UsersService>;

  const alice = makeUser('alice-id', 'alice@example.com');
  const bob = makeUser('bob-id', 'bob@example.com');

  beforeEach(async () => {
    inviteRepo = {
      findOne: jest.fn(),
      find: jest.fn(),
      create: jest.fn(),
      save: jest.fn(),
      remove: jest.fn(),
    } as any;

    usersService = {
      findByEmail: jest.fn(),
      findById: jest.fn(),
    } as any;

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CollaborationService,
        { provide: getRepositoryToken(CollaborationInvite), useValue: inviteRepo },
        { provide: UsersService, useValue: usersService },
      ],
    }).compile();

    service = module.get<CollaborationService>(CollaborationService);
  });

  describe('sendInvite', () => {
    it('should throw BadRequestException when user invites themselves', async () => {
      usersService.findByEmail.mockResolvedValue(alice);

      await expect(
        service.sendInvite(alice.id, { email: alice.email }),
      ).rejects.toThrow(BadRequestException);
    });

    it('should throw NotFoundException when receiver email does not exist', async () => {
      usersService.findByEmail.mockResolvedValue(null);

      await expect(
        service.sendInvite(alice.id, { email: 'nobody@example.com' }),
      ).rejects.toThrow(NotFoundException);
    });

    it('should throw ConflictException when a pending invite already exists from sender to receiver', async () => {
      usersService.findByEmail.mockResolvedValue(bob);
      inviteRepo.findOne.mockResolvedValue(makeInvite('inv-1', alice.id, bob.id));

      await expect(
        service.sendInvite(alice.id, { email: bob.email }),
      ).rejects.toThrow(ConflictException);
    });

    it('should throw ConflictException when a pending invite already exists from receiver to sender', async () => {
      usersService.findByEmail.mockResolvedValue(bob);
      // Bob already sent a pending invite to Alice
      inviteRepo.findOne.mockResolvedValue(makeInvite('inv-1', bob.id, alice.id));

      await expect(
        service.sendInvite(alice.id, { email: bob.email }),
      ).rejects.toThrow(ConflictException);
    });

    it('should create and return a new invite when all validations pass', async () => {
      usersService.findByEmail.mockResolvedValue(bob);
      inviteRepo.findOne.mockResolvedValue(null);

      const newInvite = makeInvite('inv-new', alice.id, bob.id);
      inviteRepo.create.mockReturnValue(newInvite);
      inviteRepo.save.mockResolvedValue(newInvite);

      const result = await service.sendInvite(alice.id, { email: bob.email });

      expect(result).toBe(newInvite);
      expect(inviteRepo.create).toHaveBeenCalledWith({
        senderId: alice.id,
        receiverId: bob.id,
        status: InviteStatusEnum.PENDING,
      });
    });
  });

  describe('respondInvite', () => {
    it('should throw ForbiddenException when someone other than the receiver tries to accept', async () => {
      const invite = makeInvite('inv-1', alice.id, bob.id);
      inviteRepo.findOne.mockResolvedValue(invite);

      // Alice (the sender) tries to accept — only Bob (receiver) should be allowed
      await expect(
        service.respondInvite(alice.id, 'inv-1', true),
      ).rejects.toThrow(ForbiddenException);
    });

    it('should allow the receiver to accept a pending invite', async () => {
      const invite = makeInvite('inv-1', alice.id, bob.id);
      inviteRepo.findOne.mockResolvedValue(invite);
      const accepted = { ...invite, status: InviteStatusEnum.ACCEPTED };
      inviteRepo.save.mockResolvedValue(accepted as CollaborationInvite);

      const result = await service.respondInvite(bob.id, 'inv-1', true);
      expect(result.status).toBe(InviteStatusEnum.ACCEPTED);
    });

    it('should allow the receiver to reject a pending invite', async () => {
      const invite = makeInvite('inv-1', alice.id, bob.id);
      inviteRepo.findOne.mockResolvedValue(invite);
      const rejected = { ...invite, status: InviteStatusEnum.REJECTED };
      inviteRepo.save.mockResolvedValue(rejected as CollaborationInvite);

      const result = await service.respondInvite(bob.id, 'inv-1', false);
      expect(result.status).toBe(InviteStatusEnum.REJECTED);
    });

    it('should throw BadRequestException when invite is not pending', async () => {
      const invite = makeInvite('inv-1', alice.id, bob.id, InviteStatusEnum.ACCEPTED);
      inviteRepo.findOne.mockResolvedValue(invite);

      await expect(
        service.respondInvite(bob.id, 'inv-1', true),
      ).rejects.toThrow(BadRequestException);
    });
  });

  describe('revokeInvite', () => {
    it('should throw ForbiddenException when someone other than the sender tries to revoke', async () => {
      const invite = makeInvite('inv-1', alice.id, bob.id);
      inviteRepo.findOne.mockResolvedValue(invite);

      // Bob (receiver) tries to revoke — only Alice (sender) can revoke
      await expect(
        service.revokeInvite(bob.id, 'inv-1'),
      ).rejects.toThrow(ForbiddenException);
    });

    it('should allow the sender to revoke a pending invite', async () => {
      const invite = makeInvite('inv-1', alice.id, bob.id);
      inviteRepo.findOne.mockResolvedValue(invite);
      const revoked = { ...invite, status: InviteStatusEnum.REVOKED };
      inviteRepo.save.mockResolvedValue(revoked as CollaborationInvite);

      const result = await service.revokeInvite(alice.id, 'inv-1');
      expect(result.status).toBe(InviteStatusEnum.REVOKED);
    });

    it('should throw BadRequestException when trying to revoke a non-pending invite', async () => {
      const invite = makeInvite('inv-1', alice.id, bob.id, InviteStatusEnum.ACCEPTED);
      inviteRepo.findOne.mockResolvedValue(invite);

      await expect(
        service.revokeInvite(alice.id, 'inv-1'),
      ).rejects.toThrow(BadRequestException);
    });
  });

  describe('getActiveCollaborators', () => {
    it('should return users with whom an accepted invite exists (both directions)', async () => {
      const inviteSent = makeInvite('inv-1', alice.id, bob.id, InviteStatusEnum.ACCEPTED);
      inviteSent.sender = alice;
      inviteSent.receiver = bob;

      inviteRepo.find.mockResolvedValue([inviteSent]);

      const result = await service.getActiveCollaborators(alice.id);
      expect(result).toHaveLength(1);
      expect(result[0].id).toBe(bob.id);
    });

    it('should return empty array when no accepted invites exist', async () => {
      inviteRepo.find.mockResolvedValue([]);
      const result = await service.getActiveCollaborators(alice.id);
      expect(result).toHaveLength(0);
    });

    it('should not duplicate collaborators', async () => {
      // Even if somehow two accepted invites with the same pair exist
      const inv1 = makeInvite('inv-1', alice.id, bob.id, InviteStatusEnum.ACCEPTED);
      inv1.sender = alice;
      inv1.receiver = bob;

      inviteRepo.find.mockResolvedValue([inv1, inv1]);

      const result = await service.getActiveCollaborators(alice.id);
      expect(result).toHaveLength(1);
    });
  });
});
