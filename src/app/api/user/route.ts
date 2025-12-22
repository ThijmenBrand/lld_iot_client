import { db } from "@/src/utils/firebase.admin";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import { authOptions } from "../auth/[...nextauth]/route";
import { UserResponse } from "@/src/types/User";

export async function GET() {
  const session = await getServerSession(authOptions);
  const defaultCalendarId = "primary";

  if (!session?.user.id) {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  try {
    const userDoc = await db.collection("users").doc(session.user.id).get();

    if (!userDoc.exists) {
      return NextResponse.json<UserResponse>({
        deviceId: "",
        calendarId: defaultCalendarId,
      });
    }

    return NextResponse.json<UserResponse>({
      deviceId: userDoc.data()?.deviceId || "",
      calendarId: userDoc.data()?.calendarId || defaultCalendarId,
    });
  } catch (error) {
    console.error("Error fetching user data:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}

export async function POST(request: Request) {
  const session = await getServerSession(authOptions);

  if (!session?.user.id) {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  const body = await request.json();
  const { deviceId, calendarId } = body;

  try {
    await db
      .collection("users")
      .doc(session.user.id)
      .set(
        {
          deviceId: deviceId || "",
          calendarId: calendarId || "primary",
          updatedAt: new Date().toISOString(),
        },
        { merge: true }
      );

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error updating user data:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
