import { Injectable } from '@angular/core';
import { ApiService } from '../../core/services/api.service';

export interface Invite { id: string; senderEmail: string; receiverEmail: string; status: string; createdAt: string; }
export interface Collaborator { id: string; email: string; }

@Injectable({ providedIn: 'root' })
export class CollaborationService {
  constructor(private api: ApiService) {}
  sendInvite(email: string) { return this.api.post('/collaboration/invite', { email }); }
  getInvites() { return this.api.get<{ sent: Invite[]; received: Invite[] }>('/collaboration/invites'); }
  accept(id: string) { return this.api.patch(`/collaboration/invites/${id}/accept`, {}); }
  reject(id: string) { return this.api.patch(`/collaboration/invites/${id}/reject`, {}); }
  revoke(id: string) { return this.api.patch(`/collaboration/invites/${id}/revoke`, {}); }
  getCollaborators() { return this.api.get<Collaborator[]>('/collaboration/collaborators'); }
  disconnect(collaboratorId: string) { return this.api.delete(`/collaboration/collaborators/${collaboratorId}`); }
}
