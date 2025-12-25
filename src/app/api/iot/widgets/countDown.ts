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
    const target = event.start?.dateTime || event.start?.date || "";
    const start = event.created || "";
    const summary = event.summary || "No Title";

    const now = new Date();
    const eventTarget = new Date(target);
    const eventCreated = new Date(start);

    const diffTime = eventTarget.getTime() - now.getTime();
    const daysLeft = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    const totalDuration = eventTarget.getTime() - eventCreated.getTime();
    const elapsedDuration = now.getTime() - eventCreated.getTime();
    let progress = Math.round((elapsedDuration / totalDuration) * 100);

    if (progress < 0) progress = 0;
    if (progress > 100) progress = 100;

    const daysLeftString = daysLeft > 1 ? "days" : "day";

    return {
      daysLeft: daysLeft > 0 ? `${daysLeft} ${daysLeftString}` : "ARRIVED",
      dateString: eventTarget.toLocaleDateString("nl-NL", {
        month: "short",
        day: "numeric",
        year: "numeric",
      }),
      label: summary || "Countdown",
      progress: progress,
    };
  } catch (error) {
    console.error("Error fetching calendar data:", error);
    throw error;
  }
}
