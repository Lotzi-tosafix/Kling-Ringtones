import { Timestamp } from 'firebase/firestore';

export type RingtoneStatus = 'pending' | 'published' | 'rejected';

export interface Ringtone {
  id: string;
  title: string;
  artist: string;
  year: string;
  month: string;
  driveId: string;
  status: RingtoneStatus;
  downloadCount: number;
  uploadedBy: string;
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

export interface UserProfile {
  uid: string;
  displayName: string | null;
  email: string | null;
  role: 'user' | 'admin';
}
