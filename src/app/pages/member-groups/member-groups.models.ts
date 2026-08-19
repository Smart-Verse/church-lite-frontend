export interface CommunityGroup {
  id: string;
  name: string;
  description?: string | null;
  image?: string | null;
  visibility: 'PUBLIC' | 'PRIVATE';
  createdByProfileId: string;
  active: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CommunityGroupMember {
  id: string;
  memberId?: string;
  groupId: string;
  profileId: string;
  role: 'MEMBER' | 'MODERATOR' | 'ADMIN';
  active: boolean;
  joinedAt: string;
  displayName?: string;
  username?: string | null;
  image?: string | null;
}
