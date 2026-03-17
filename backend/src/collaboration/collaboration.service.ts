import {
  Injectable,
  NotFoundException,
  ForbiddenException,
  BadRequestException,
  ConflictException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Or } from 'typeorm';
import { CollaborationInvite, InviteStatusEnum } from './invite.entity';
import { UsersService } from '../users/users.service';
import { User } from '../users/user.entity';
import { InviteDto } from './dto/invite.dto';

@Injectable()
export class CollaborationService {
  constructor(
    @InjectRepository(CollaborationInvite)
    private readonly inviteRepo: Repository<CollaborationInvite>,
    private readonly usersService: UsersService,
  ) {}

  async sendInvite(senderId: string, dto: InviteDto): Promise<CollaborationInvite> {
    const receiver = await this.usersService.findByEmail(dto.email);
    if (!receiver) {
      throw new NotFoundException(`User with email ${dto.email} not found`);
    }

    if (receiver.id === senderId) {
      throw new BadRequestException('Cannot invite yourself');
    }

    // Check for existing pending invite between the same pair (either direction)
    const existing = await this.inviteRepo.findOne({
      where: [
        { senderId, receiverId: receiver.id, status: InviteStatusEnum.PENDING },
        { senderId: receiver.id, receiverId: senderId, status: InviteStatusEnum.PENDING },
      ],
    });

    if (existing) {
      throw new ConflictException('A pending invite already exists between these users');
    }

    const invite = this.inviteRepo.create({
      senderId,
      receiverId: receiver.id,
      status: InviteStatusEnum.PENDING,
    });

    return this.inviteRepo.save(invite);
  }

  async respondInvite(
    receiverId: string,
    inviteId: string,
    accept: boolean,
  ): Promise<CollaborationInvite> {
    const invite = await this.findOrFail(inviteId);

    if (invite.receiverId !== receiverId) {
      throw new ForbiddenException('Only the invite receiver can accept or reject');
    }

    if (invite.status !== InviteStatusEnum.PENDING) {
      throw new BadRequestException(`Invite is already ${invite.status}`);
    }

    invite.status = accept ? InviteStatusEnum.ACCEPTED : InviteStatusEnum.REJECTED;
    return this.inviteRepo.save(invite);
  }

  async revokeInvite(senderId: string, inviteId: string): Promise<CollaborationInvite> {
    const invite = await this.findOrFail(inviteId);

    if (invite.senderId !== senderId) {
      throw new ForbiddenException('Only the invite sender can revoke');
    }

    if (invite.status !== InviteStatusEnum.PENDING) {
      throw new BadRequestException(`Invite is already ${invite.status}`);
    }

    invite.status = InviteStatusEnum.REVOKED;
    return this.inviteRepo.save(invite);
  }

  async getInvites(userId: string): Promise<{ sent: CollaborationInvite[]; received: CollaborationInvite[] }> {
    const all = await this.inviteRepo.find({
      where: [{ senderId: userId }, { receiverId: userId }],
      relations: ['sender', 'receiver'],
      order: { createdAt: 'DESC' },
    });
    return {
      sent: all.filter(i => i.senderId === userId),
      received: all.filter(i => i.receiverId === userId),
    };
  }

  async getActiveCollaborators(userId: string): Promise<User[]> {
    const accepted = await this.inviteRepo.find({
      where: [
        { senderId: userId, status: InviteStatusEnum.ACCEPTED },
        { receiverId: userId, status: InviteStatusEnum.ACCEPTED },
      ],
      relations: ['sender', 'receiver'],
    });

    const collaborators: User[] = [];
    for (const invite of accepted) {
      const other = invite.senderId === userId ? invite.receiver : invite.sender;
      if (other && !collaborators.find((c) => c.id === other.id)) {
        collaborators.push(other);
      }
    }

    return collaborators;
  }

  private async findOrFail(inviteId: string): Promise<CollaborationInvite> {
    const invite = await this.inviteRepo.findOne({ where: { id: inviteId } });
    if (!invite) throw new NotFoundException(`Invite ${inviteId} not found`);
    return invite;
  }
}
