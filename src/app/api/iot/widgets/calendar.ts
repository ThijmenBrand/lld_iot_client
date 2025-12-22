import { User } from "@/src/types/User";
import { getOAuth } from "@/src/utils/auth";
import { google } from "googleapis";

export async function getCalendarData(user: User) {
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
      maxResults: 3,
      singleEvents: true,
      orderBy: "startTime",
    });

    const events = response.data.items || [];
    const lines = events.map((event) => {
      const start = event.start?.dateTime || event.start?.date || "";
      const summary = event.summary || "No Title";

      const dateObj = new Date(start);

      const timeStr = dateObj.toLocaleDateString("nl-NL", {
        day: "numeric",
        month: "short",
        timeZone: "Europe/Amsterdam",
      });

      return `${timeStr} ${summary}`;
    });

    if (lines.length === 0) {
      lines.push("No upcoming events.");
    }

    return lines.join("|");
  } catch (error) {
    console.error("Error fetching calendar data:", error);
    throw error;
  }
}
