import admin from "firebase-admin";

// Initialize Firebase Admin SDK for Vercel Serverless
if (!admin.apps.length) {
  try {
    const serviceAccountJson = process.env.FIREBASE_SERVICE_ACCOUNT_KEY;
    if (serviceAccountJson) {
      const serviceAccount = JSON.parse(serviceAccountJson);
      admin.initializeApp({
        credential: admin.credential.cert(serviceAccount),
      });
      console.log("Firebase Admin initialized in Vercel function.");
    }
  } catch (error) {
    console.error("Error parsing FIREBASE_SERVICE_ACCOUNT_KEY:", error);
  }
}

export default async function handler(req, res) {
  const adminReady = admin.apps.length > 0;
  
  res.status(200).json({ 
    message: "Firebase Admin is working on Vercel!",
    adminReady 
  });
}
