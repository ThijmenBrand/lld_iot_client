import { db } from "@/src/utils/firebase.admin";
import { NextRequest } from "next/server";
import { User } from "@/src/types/User";
import { selectWidget } from "./widgets";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const deviceId = searchParams.get("deviceId");

  if (!deviceId) {
    return new Response("Missing deviceId parameter", { status: 400 });
  }

  console.log(`Checking device: ${deviceId}`);

  // Find user by deviceId
  const userSnap = await db
    .collection("users")
    .where("deviceId", "==", deviceId)
    .limit(1)
    .get();

  if (userSnap.empty) {
    console.log(`Device ID ${deviceId} not found.`);
    return new Response("Device not found", { status: 404 });
  }

  const userData = userSnap.docs[0].data() as User;
  const userId = userSnap.docs[0].id;
  console.log(`Device ID ${deviceId} is registered to user ID: ${userId}`);

  console.log(`Selecting widget: ${userData.widgetType}`);

  const data = await selectWidget(userData.widgetType || "calendar", {
    ...userData,
    id: userId,
  });

  const payload = {
    widget: userData.widgetType || "calendar",
    data: data,
  };

  return new Response(JSON.stringify(payload), { status: 200 });
}
