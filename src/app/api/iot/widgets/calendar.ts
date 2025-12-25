import { User } from "@/src/types/User";
import { getOAuth } from "@/src/utils/auth";
import { calendar_v3, google } from "googleapis";

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
      maxResults: 4,
      singleEvents: true,
      orderBy: "startTime",
    });

    const items = response.data.items || [];
    if (items.length === 0) {
      return "No events.";
    }

    const first = items[0];
    const highlight = {
      time: formatTimeRange(first),
      title: (first.summary || "No Title").substring(0, 25),
    };

    const upcoming = items.slice(1).map((event) => ({
      time: formatUpcomingTime(event),
      title: (event.summary || "No Title").substring(0, 25),
    }));

    return {
      highlight,
      upcoming,
    };
  } catch (error) {
    console.error("Error fetching calendar data:", error);
    throw error;
  }
}

// --- Formatting Helpers ---
function formatTimeRange(event: calendar_v3.Schema$Event) {
  const start = new Date(event.start?.dateTime || event.start?.date || "");
  const end = new Date(event.end?.dateTime || event.end?.date || "");

  return `${start.getHours()}:${start
    .getMinutes()
    .toString()
    .padStart(2, "0")} - ${end.getHours()}:${end
    .getMinutes()
    .toString()
    .padStart(2, "0")}`;
}

function formatUpcomingTime(event: calendar_v3.Schema$Event) {
  const start = new Date(event.start?.dateTime || event.start?.date || "");
  const month = start.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
  });
  const time = `${start.getHours()}:${start
    .getMinutes()
    .toString()
    .padStart(2, "0")}`;
  return `${month} ${time}`;
}
