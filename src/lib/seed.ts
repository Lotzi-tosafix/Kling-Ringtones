import { db } from './firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';

export const seedRingtones = async () => {
  const ringtones = [
    {
      title: 'כתר מלוכה',
      artist: 'ישי ריבו',
      year: 'תשפ\"ה',
      month: 'תשרי',
      driveId: '13Qw7udHrsnKR_8JwrNRy3bYR15r6dCLt', // Placeholder ID
      status: 'published',
      downloadCount: 154,
      uploadedBy: 'system',
      createdAt: serverTimestamp()
    },
    {
      title: 'סיבת הסיבות',
      artist: 'ישי ריבו',
      year: 'תשפ\"ה',
      month: 'חשוון',
      driveId: '13Qw7udHrsnKR_8JwrNRy3bYR15r6dCLt',
      status: 'published',
      downloadCount: 89,
      uploadedBy: 'system',
      createdAt: serverTimestamp()
    },
    {
      title: 'לחי עולמים',
      artist: 'מרדכי בן דוד',
      year: 'תשפ\"ה',
      month: 'תשרי',
      driveId: '13Qw7udHrsnKR_8JwrNRy3bYR15r6dCLt',
      status: 'published',
      downloadCount: 231,
      uploadedBy: 'system',
      createdAt: serverTimestamp()
    },
    {
      title: 'אמן על הילדים',
      artist: 'חנן בן ארי',
      year: 'תשפ\"ד',
      month: 'אלול',
      driveId: '13Qw7udHrsnKR_8JwrNRy3bYR15r6dCLt',
      status: 'published',
      downloadCount: 412,
      uploadedBy: 'system',
      createdAt: serverTimestamp()
    }
  ];

  for (const rt of ringtones) {
    await addDoc(collection(db, 'ringtones'), rt);
  }
  
  console.log('Seeding complete!');
};
