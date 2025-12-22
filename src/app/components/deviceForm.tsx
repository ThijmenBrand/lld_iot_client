"use client";

import { Calendar } from "@/src/types/Calendar";
import { User } from "@/src/types/User";
import { useEffect, useState } from "react";

interface DeviceFormProps {
  userId: string;
}

export default function DeviceForm({ userId }: DeviceFormProps) {
  const [deviceId, setDeviceId] = useState("");
  const [calendarId, setCalendarId] = useState("primary");
  const [calendars, setCalendars] = useState<Calendar[]>([]);
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState<string>("");
  const [activeWidget, setActiveWidget] = useState<string>("calendar");

  useEffect(() => {
    async function init() {
      if (!userId) return;

      const userRes = await fetch("/api/user");
      if (userRes.ok) {
        const data = (await userRes.json()) as User;
        console.log("Fetched user data:", data);
        if (data.deviceId) setDeviceId(data.deviceId);
        if (data.calendarId) setCalendarId(data.calendarId);
        if (data.widgetType) setActiveWidget(data.widgetType);
      }
    }

    init();
  }, [userId]);

  useEffect(() => {
    async function fetchCalendars() {
      if (!userId) return;

      const calRes = await fetch("/api/calendars/list");
      if (calRes.ok) {
        const list = await calRes.json();
        setCalendars(list);
      }
    }

    fetchCalendars();
  }, [userId]);

  const handleSave = async (deviceId: string) => {
    setLoading(true);
    setStatus("Saving...");

    try {
      const res = await fetch("/api/user", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          deviceId: deviceId.trim(),
          calendarId,
          widgetType: activeWidget,
        }),
      });

      if (res.ok) {
        setStatus("Saved successfully! ✅");
      } else {
        setStatus("Error saving. ❌");
      }
    } catch (error) {
      console.error("Error saving user data:", error);
      setStatus("Error saving. ❌");
    } finally {
      setLoading(false);
      setTimeout(() => setStatus(""), 3000);
    }
  };

  return (
    <div className="mt-8 p-6 border rounded-xl bg-white shadow-sm max-w-md w-full">
      <h2 className="text-xl font-semibold mb-4">Device Configuration</h2>
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1" htmlFor="deviceId">
            Device ID
          </label>
          <input
            type="text"
            id="deviceId"
            value={deviceId}
            onChange={(e) => setDeviceId(e.target.value)}
            className="w-full text-black border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Enter your Device ID"
            required
          />
          <p className="text-xs text-gray-500 mt-1">
            You can find this ID on the first device boot.
          </p>
        </div>

        {/* Calendar Selection Dropdown */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Select Calendar
          </label>
          <select
            value={calendarId}
            onChange={(e) => setCalendarId(e.target.value)}
            className="w-full p-2 text-black border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 outline-none bg-white"
          >
            <option value="primary">Primary (Default)</option>
            {calendars.map((cal) => (
              <option key={cal.id} value={cal.id}>
                {cal.summary}
              </option>
            ))}
          </select>
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Active Widget
          </label>
          <div className="flex gap-4">
            <button
              type="button"
              onClick={() => setActiveWidget("calendar")}
              className={`px-4 py-2 rounded border ${
                activeWidget === "calendar"
                  ? "bg-slate-900 text-white"
                  : "bg-white"
              }`}
            >
              📅 Calendar
            </button>
            <button
              type="button"
              onClick={() => setActiveWidget("countdown")}
              className={`px-4 py-2 rounded border ${
                activeWidget === "countdown"
                  ? "bg-slate-900 text-white"
                  : "bg-white"
              }`}
            >
              ⏰ Countdown
            </button>
          </div>
        </div>

        <div>
          <button
            onClick={() => handleSave(deviceId)}
            disabled={loading}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:bg-gray-400"
          >
            {loading ? "Saving..." : "Save settings"}
          </button>
        </div>

        {status && (
          <p className="text-sm text-center font-medium mt-2">{status}</p>
        )}
      </div>
    </div>
  );
}
