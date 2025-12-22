import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/route";
import { NextResponse } from "next/server";
import { getDbAuth, getGoogleOauth2 } from "@/src/utils/auth";
import { google } from "googleapis";
import { Calendar } from "@/src/types/Calendar";

export async function GET() {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  const accountData = await getDbAuth(session.user.id, "google");
  if (!accountData) {
    return new NextResponse("No linked Google account", { status: 404 });
  }

  if (!accountData.refresh_token) {
    return new NextResponse("No refresh token found", { status: 404 });
  }

  const oauth2Client = await getGoogleOauth2(
    accountData.access_token,
    accountData.refresh_token
  );

  const calendar = google.calendar({ version: "v3", auth: oauth2Client });

  try {
    const response = await calendar.calendarList.list();
    const calendars: Calendar[] =
      response.data.items?.map((calendar) => ({
        id: calendar.id!,
        summary: calendar.summary || "No Title",
        timezone: calendar.timeZone || "UTC",
      })) || [];

    console.log("Fetched calendars:", calendars);

    return NextResponse.json(calendars);
  } catch (error) {
    console.error("Error fetching calendars:", error);
    return new NextResponse("Error fetching calendars", { status: 500 });
  }
}
