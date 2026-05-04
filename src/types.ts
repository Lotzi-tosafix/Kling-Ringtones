import { Timestamp } from 'firebase/firestore';

export type RingtoneStatus = 'pending' | 'published' | 'rejected';

export interface Ringtone {
  id: string;
  title: string;
  artist: string;
  year?: string;
  month?: string;
  category?: string;
  driveId?: string; // from admin
  storageUrl?: string; // from user upload
  originalFileName?: string;
  status: RingtoneStatus;
  downloadCount: number;
  playCount?: number;
  uploadedBy?: string;
  uploaderId?: string;
  uploaderName?: string;
  createdAt: Timestamp;
  updatedAt?: Timestamp;
}

export interface UserProfile {
  uid: string;
  displayName: string | null;
  email: string | null;
  role: 'user' | 'admin';
}
