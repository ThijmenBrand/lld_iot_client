import { db } from "@/src/utils/firebase.admin";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import { authOptions } from "../auth/[...nextauth]/route";
import { User, UserResponse } from "@/src/types/User";

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
        widgetType: "calendar",
      });
    }

    return NextResponse.json<UserResponse>({
      deviceId: userDoc.data()?.deviceId || "",
      calendarId: userDoc.data()?.calendarId || defaultCalendarId,
      widgetType: userDoc.data()?.widgetType || "calendar",
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

  const body = (await request.json()) as User;
  const { deviceId, calendarId, widgetType } = body;

  if (!deviceIdUnique(deviceId, session.user.id)) {
    return new NextResponse("Device ID already in use", { status: 400 });
  }

  try {
    await db
      .collection("users")
      .doc(session.user.id)
      .set(
        {
          deviceId: deviceId || "",
          calendarId: calendarId || "primary",
          widgetType: widgetType || "calendar",
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

async function deviceIdUnique(
  deviceId: string,
  userId: string
): Promise<boolean> {
  // check if deviceId is not configured by someone else
  const userWithDeviceId = await db
    .collection("users")
    .where("deviceId", "==", deviceId)
    .get();

  if (!userWithDeviceId.empty) {
    const doc = userWithDeviceId.docs[0];
    if (doc.id !== userId) {
      return false;
    }
  }

  return true;
}
