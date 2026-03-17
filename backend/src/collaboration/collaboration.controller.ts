import {
  Controller,
  Post,
  Get,
  Patch,
  Body,
  Param,
  UseGuards,
  Request,
} from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { CollaborationService } from './collaboration.service';
import { InviteDto } from './dto/invite.dto';

@UseGuards(JwtAuthGuard)
@Controller('collaboration')
export class CollaborationController {
  constructor(private readonly collaborationService: CollaborationService) {}

  @Post('invite')
  sendInvite(@Request() req, @Body() dto: InviteDto) {
    return this.collaborationService.sendInvite(req.user.id, dto);
  }

  @Get('invites')
  getInvites(@Request() req) {
    return this.collaborationService.getInvites(req.user.id);
  }

  @Patch('invites/:id/accept')
  acceptInvite(@Request() req, @Param('id') id: string) {
    return this.collaborationService.respondInvite(req.user.id, id, true);
  }

  @Patch('invites/:id/reject')
  rejectInvite(@Request() req, @Param('id') id: string) {
    return this.collaborationService.respondInvite(req.user.id, id, false);
  }

  @Patch('invites/:id/revoke')
  revokeInvite(@Request() req, @Param('id') id: string) {
    return this.collaborationService.revokeInvite(req.user.id, id);
  }

  @Get('collaborators')
  getCollaborators(@Request() req) {
    return this.collaborationService.getActiveCollaborators(req.user.id);
  }
}
