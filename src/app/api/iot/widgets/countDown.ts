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
    const summary = event.summary || "No Title";

    const now = new Date();
    const msPerDay = 1000 * 60 * 60 * 24;

    let eventDay: Date;
    if (event.start?.date) {
      const [year, month, day] = event.start.date.split("-").map(Number);
      eventDay = new Date(year, month - 1, day);
    } else {
      const et = new Date(target);
      eventDay = new Date(et.getFullYear(), et.getMonth(), et.getDate());
    }

    const created = event.created ? new Date(event.created) : new Date();
    const createdDay = new Date(
      created.getFullYear(),
      created.getMonth(),
      created.getDate()
    );
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());

    const daysLeft = Math.round(
      (eventDay.getTime() - today.getTime()) / msPerDay
    );

    const totalDays = Math.round(
      (eventDay.getTime() - createdDay.getTime()) / msPerDay
    );
    const elapsedDays = Math.round(
      (today.getTime() - createdDay.getTime()) / msPerDay
    );

    let progress: number;
    if (totalDays <= 0) {
      progress = today.getTime() >= eventDay.getTime() ? 100 : 0;
    } else {
      progress = Math.round((elapsedDays / totalDays) * 100);
    }

    if (progress < 0) progress = 0;
    if (progress > 100) progress = 100;

    const daysLeftString = daysLeft > 1 ? "days" : "day";

    return {
      daysLeft: daysLeft > 0 ? `${daysLeft} ${daysLeftString}` : "Today!!",
      dateString: eventDay.toLocaleDateString("nl-NL", {
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
