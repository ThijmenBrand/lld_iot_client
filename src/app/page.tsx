import { getServerSession } from "next-auth";
import LoginBtn from "./components/loginBtn";
import DeviceForm from "./components/deviceForm";
import { authOptions } from "./api/auth/[...nextauth]/route";

export default async function HomePage() {
  const session = await getServerSession(authOptions);
  const user = session?.user;

  return (
    <main className="min-h-screen flex flex-col items-center justify-center bg-gray-50 p-4">
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold text-slate-900 mb-2">Ink Calendar</h1>
        <p className="text-gray-600">
          Connect your E-Ink display to Google Calendar
        </p>
      </div>

      {/* Show different UI based on login state */}
      {/* Show different UI based on login state */}
      {!user ? (
        <div className="bg-white p-8 rounded-xl shadow-sm border text-center">
          <p className="mb-6 text-gray-600">
            Please sign in to configure your device.
          </p>
          <LoginBtn isLoggedIn={false} />
        </div>
      ) : (
        <div className="flex flex-col items-center w-full">
          <div className="flex items-center gap-4 mb-8">
            <div className="text-left">
              <p className="font-medium">{user.name}</p>
              <p className="text-sm text-gray-500">{user.email}</p>
            </div>
            <div className="ml-4">
              <LoginBtn isLoggedIn={true} />
            </div>
          </div>

          {/* Pass the User ID to the form so it knows which doc to update */}
          <DeviceForm userId={user.id} />
        </div>
      )}
    </main>
  );
}
