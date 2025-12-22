import { User } from "@/src/types/User";
import { getCalendarData } from "./calendar";
import { getCountdownData } from "./countDown";

export function selectWidget(configuredWidget: string, user: User) {
  switch (configuredWidget) {
    case "calendar":
      return getCalendarData(user);
    case "countdown":
      return getCountdownData(user);
    default:
      throw new Error("Unknown widget type");
  }
}
