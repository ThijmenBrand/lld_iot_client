import { db } from "@/src/utils/firebase.admin";
import { NextRequest } from "next/server";
import { User } from "@/src/types/User";
import { selectWidget } from "./widgets";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const deviceId = searchParams.get("deviceId");

  const providedSecret = request.headers.get("X-NYUSZI-SECRET");

  if (!deviceId) return new Response("Missing deviceId", { status: 400 });
  if (!providedSecret) return new Response("Unauthorized", { status: 401 });

  const user = await validateDevice(deviceId, providedSecret);
  if (!user) {
    console.log(`Unauthorized access attempt for device ID: ${deviceId}`);
    return new Response("Unauthorized", { status: 401 });
  }

  const widgetType = user.widgetType || "calendar";

  const data = await selectWidget(widgetType, user);

  const payload = {
    widget: widgetType,
    data: data,
  };

  return new Response(JSON.stringify(payload), { status: 200 });
}

async function validateDevice(
  deviceId: string,
  secret: string
): Promise<User | null> {
  const userSnap = await db
    .collection("users")
    .where("deviceId", "==", deviceId)
    .limit(1)
    .get();

  if (userSnap.empty) {
    return null;
  }

  const userDoc = userSnap.docs[0];
  const userData = userDoc.data() as User;
  const userId = userDoc.id;

  if (userData.deviceSecret !== secret) {
    return null;
  }

  return { ...userData, id: userId };
}
