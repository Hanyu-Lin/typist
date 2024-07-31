import type { User } from '@/stores/userStore';

export interface RoomJoinedData {
  ownerId: User;
  roomId: string;
  members: User[];
}

export interface Notification {
  title: string;
  message: string;
}
