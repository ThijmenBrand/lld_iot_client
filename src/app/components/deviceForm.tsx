"use client";

import { db } from "@/src/utils/firebase.browser";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { useEffect, useState } from "react";

interface DeviceFormProps {
  userId: string;
}

export default function DeviceForm({ userId }: DeviceFormProps) {
  const [deviceId, setDeviceId] = useState("");
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState<string>("");

  useEffect(() => {
    async function loadData() {
      if (!userId) return;
      const userRef = doc(db, "users", userId);
      const snap = await getDoc(userRef);
      if (snap.exists() && snap.data().deviceId) {
        setDeviceId(snap.data().deviceId);
      }
    }

    loadData();
  }, [userId]);

  const handleSave = async (deviceId: string) => {
    setLoading(true);
    setStatus("Saving...");

    try {
      const userRef = doc(db, "users", userId);
      await updateDoc(userRef, { deviceId: deviceId.trim() });
      setStatus("Device ID saved successfully!");
    } catch (error) {
      console.error("Error saving device ID: ", error);
      setStatus("Failed to save Device ID.");
    } finally {
      setLoading(false);
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
            className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Enter your Device ID"
            required
          />
          <p className="text-xs text-gray-500 mt-1">
            You can find this ID on the first device boot.
          </p>
        </div>
        <div>
          <button
            onClick={() => handleSave(deviceId)}
            disabled={loading}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:bg-gray-400"
          >
            {loading ? "Saving..." : "Link Device"}
          </button>
        </div>

        {status && (
          <p className="text-sm text-center font-medium mt-2">{status}</p>
        )}
      </div>
    </div>
  );
}
