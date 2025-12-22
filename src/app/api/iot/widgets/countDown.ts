import { User } from "@/src/types/User";
import { getOAuth } from "@/src/utils/auth";
import { google } from "googleapis";

// method that fetches the first event in the calendar and returns the countdown to it
export async function getCountdownData(user: User) {
  const oAuth = await getOAuth(user.id);
  const calendarId = user.calendarId || "primary";

  if (!oAuth) {
    throw new Error("No OAuth2 client available");
  }

  try {
    const calendar = google.calendar({ version: "v3", auth: oAuth });

    const response = await calendar.events.list({
      calendarId: calendarId,
      timeMin: new Date().toISOString(),
      maxResults: 1,
      singleEvents: true,
      orderBy: "startTime",
    });

    const events = response.data.items || [];
    if (events.length === 0) {
      return "No upcoming events.";
    }

    const event = events[0];
    const start = event.start?.dateTime || event.start?.date || "";
    const summary = event.summary || "No Title";

    const eventDate = new Date(start);
    const now = new Date();
    const diffMs = eventDate.getTime() - now.getTime();

    if (diffMs <= 0) {
      return `Event "${summary}" is happening now or has already occurred.`;
    }

    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
    const diffHours = Math.floor((diffMs / (1000 * 60 * 60)) % 24);
    const diffMinutes = Math.floor((diffMs / (1000 * 60)) % 60);

    let countdownStr = `${summary} is in: `;
    if (diffDays > 0) {
      countdownStr += `${diffDays}d `;
    }
    if (diffHours > 0 || diffDays > 0) {
      countdownStr += `${diffHours}h `;
    }
    countdownStr += `${diffMinutes}m`;

    return countdownStr;
  } catch (error) {
    console.error("Error fetching calendar data:", error);
    throw error;
  }
}
