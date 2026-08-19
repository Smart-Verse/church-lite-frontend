export interface SocialProfile {
  id: string;
  ownerId: string;
  displayName: string;
  username: string | null;
  bio: string | null;
  profileImage: string | null;
  coverImage: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface SocialProfileUpdate {
  displayName: string;
  username: string | null;
  bio: string | null;
  profileImage: string | null;
  coverImage: string | null;
}
