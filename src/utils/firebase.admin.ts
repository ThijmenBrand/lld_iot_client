import admin, { ServiceAccount } from "firebase-admin";

const serviceAccount: ServiceAccount = {
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
  privateKey: process.env.FIREBASE_PRIVATE_KEY,
};

const databaseUrl = "https://lddiot-thijmen.firebasestorage.app";

function getFirebaseAdminApp() {
  if (!admin.apps.length) {
    return admin.initializeApp({
      credential: admin.credential.cert(serviceAccount),
      databaseURL: databaseUrl,
    });
  }
  return admin;
}

const firebaseAdminApp = getFirebaseAdminApp();
const db = firebaseAdminApp.firestore();

export { firebaseAdminApp, db };
