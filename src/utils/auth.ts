import { google } from "googleapis";
import { db } from "./firebase.admin";

export async function getDbAuth(userId: string, provider: string) {
  const accountsSnap = await db
    .collection("accounts")
    .where("userId", "==", userId)
    .where("provider", "==", provider)
    .limit(1)
    .get();

  if (accountsSnap.empty) {
    return null;
  }

  return accountsSnap.docs[0].data();
}

export async function getGoogleOauth2(
  accessToken: string,
  refreshToken: string
) {
  const auth = new google.auth.OAuth2(
    process.env.GOOGLE_CLIENT_ID,
    process.env.GOOGLE_CLIENT_SECRET
  );

  auth.setCredentials({
    access_token: accessToken,
    refresh_token: refreshToken,
  });

  return auth;
}
