import express from "express";
import { createServer as createViteServer } from "vite";
import path from "path";
import admin from "firebase-admin";

// Create server
async function startServer() {
  const app = express();
  const PORT = 3000;

  // Initialize Firebase Admin SDK
  try {
    const serviceAccountJson = process.env.FIREBASE_SERVICE_ACCOUNT_KEY;
    
    if (serviceAccountJson && !admin.apps.length) {
      const serviceAccount = JSON.parse(serviceAccountJson);
      
      admin.initializeApp({
        credential: admin.credential.cert(serviceAccount)
      });
      console.log("Firebase Admin initialized successfully.");
    } else if (!serviceAccountJson) {
      console.warn("⚠️ FIREBASE_SERVICE_ACCOUNT_KEY is not set. Firebase Admin features will not work.");
    }
  } catch (error) {
    console.error("Error parsing FIREBASE_SERVICE_ACCOUNT_KEY:", error);
  }

  // Parse JSON bodies
  app.use(express.json());

  // API testing route
  app.get("/api/health", (req, res) => {
    // Determine admin status
    const adminReady = admin.apps.length > 0;
    res.json({ status: "ok", adminReady });
  });

  // Example API route using Firebase Admin
  app.get("/api/admin-example", async (req, res) => {
    if (!admin.apps.length) {
      res.status(500).json({ error: "Firebase Admin is not configured" });
      return;
    }
    
    try {
      // Example usage of Admin DB
      // const db = admin.firestore();
      // const snapshot = await db.collection("ringtones").limit(1).get();
      res.json({ message: "Admin SDK is working!" });
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  // Vite middleware setup (for development vs production)
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    // In production, serve the built files directly
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
