import { db } from "@/src/utils/firebase.admin";
import { NextRequest, NextResponse } from "next/server";
import { google } from "googleapis";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const deviceId = searchParams.get("deviceId");

  if (!deviceId) {
    return new Response("Missing deviceId parameter", { status: 400 });
  }

  console.log(`Checking device: ${deviceId}`);

  const userSnap = await db
    .collection("users")
    .where("deviceId", "==", deviceId)
    .limit(1)
    .get();

  if (userSnap.empty) {
    console.log(`Device ID ${deviceId} not found.`);
    return new Response("Device not found", { status: 404 });
  }

  const userId = userSnap.docs[0].id;
  console.log(`Device ID ${deviceId} is registered to user ID: ${userId}`);

  const accountSnap = await db
    .collection("accounts")
    .where("userId", "==", userId)
    .where("provider", "==", "google")
    .limit(1)
    .get();

  if (accountSnap.empty) {
    console.log(`No Google account linked for user ID: ${userId}`);
    return new Response("No linked Google account", { status: 404 });
  }

  const accountData = accountSnap.docs[0].data();
  const refreshToken = accountData.refresh_token;

  if (!refreshToken) {
    console.log(`No refresh token found for user ID: ${userId}`);
    return new Response("No refresh token found", { status: 404 });
  }

  const oauth2Client = new google.auth.OAuth2(
    process.env.GOOGLE_CLIENT_ID,
    process.env.GOOGLE_CLIENT_SECRET
  );

  oauth2Client.setCredentials({ refresh_token: refreshToken });

  try {
    const calendar = google.calendar({ version: "v3", auth: oauth2Client });

    const response = await calendar.events.list({
      calendarId: "primary",
      timeMin: new Date().toISOString(),
      maxResults: 3,
      singleEvents: true,
      orderBy: "startTime",
    });

    const events = response.data.items || [];
    console.log(`Fetched ${events.length} events for device ID: ${deviceId}`);

    const lines = events.map((event) => {
      const start = event.start?.dateTime || event.start?.date;
      const summary = event.summary || "No Title";

      let timeStr = "All day";
      if (start && start.includes("T")) {
        const dateObj = new Date(start);

        timeStr = dateObj.toLocaleTimeString("nl-NL", {
          day: "numeric",
          month: "short",
          hour: "2-digit",
          minute: "2-digit",
          timeZone: "Europe/Amsterdam", // Hardcoded for now, or fetch from user settings later
        });
      }

      return `${timeStr} ${summary}`;
    });

    if (lines.length === 0) {
      lines.push("No upcoming events.");
    }

    const payload = lines.join("|");

    return new NextResponse(payload, {
      status: 200,
      headers: { "Content-Type": "text/plain" },
    });
  } catch (error) {
    console.error("Error fetching calendar events:", error);
    return new NextResponse("Error fetching calendar events", { status: 500 });
  }
}
