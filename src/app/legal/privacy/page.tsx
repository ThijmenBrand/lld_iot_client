export default function PrivacyPolicy() {
  return (
    <div className="max-w-3xl mx-auto p-8 font-sans text-gray-800">
      <h1 className="text-3xl font-bold mb-4">Privacy Policy</h1>
      <p className="mb-4 text-sm text-gray-500">
        Last Updated: December 22, 2025
      </p>

      <p className="mb-4">
        Ink Calendar operates the Ink Calendar IoT dashboard. This Privacy
        Policy explains how we collect, use, and disclose information when you
        use our service.
      </p>

      <h2 className="text-xl font-semibold mt-6 mb-2">
        1. Information We Collect
      </h2>
      <ul className="list-disc pl-5 mb-4 space-y-2">
        <li>
          <strong>Google Account Information:</strong> When you log in with
          Google, we collect your email address and basic profile information
          (name, avatar) to authenticate your account.
        </li>
        <li>
          <strong>Calendar Data:</strong> We access your Google Calendar events
          (summary, time, date) solely for the purpose of displaying them on
          your configured E-Ink device. We do not store your calendar events
          permanently on our servers; they are fetched in real-time or cached
          briefly for device synchronization.
        </li>
        <li>
          <strong>Device Information:</strong> We store the unique Device ID of
          your Arduino controller to link it to your account.
        </li>
      </ul>

      <h2 className="text-xl font-semibold mt-6 mb-2">
        2. How We Use Your Information
      </h2>
      <p className="mb-4">
        We use the collected information for the sole purpose of:
      </p>
      <ul className="list-disc pl-5 mb-4">
        <li>Authenticating your identity.</li>
        <li>Allowing you to select which calendar to display.</li>
        <li>
          Formatting calendar data into an image to be downloaded by your
          specific E-Ink device.
        </li>
      </ul>

      <h2 className="text-xl font-semibold mt-6 mb-2">
        3. Data Storage and Security
      </h2>
      <p className="mb-4">
        Your data is stored securely using Google Firebase. We do not share,
        sell, or transfer your personal data to third parties for advertising or
        marketing purposes. Access tokens are stored securely and are only used
        to fetch data when requested by your device.
      </p>

      <h2 className="text-xl font-semibold mt-6 mb-2">
        4. Google API Services User Data Policy
      </h2>
      <p className="mb-4 bg-gray-100 p-4 rounded border">
        Ink Calendar&apos;s use and transfer to any other app of information
        received from Google APIs will adhere to the
        <a
          href="https://developers.google.com/terms/api-services-user-data-policy"
          className="text-blue-600 hover:underline"
          target="_blank"
        >
          {" "}
          Google API Services User Data Policy
        </a>
        , including the Limited Use requirements.
      </p>

      <h2 className="text-xl font-semibold mt-6 mb-2">5. Your Rights</h2>
      <p className="mb-4">
        You may revoke Ink Calendar&apos;s access to your Google Account at any
        time via the
        <a
          href="https://myaccount.google.com/permissions"
          className="text-blue-600 hover:underline"
        >
          {" "}
          Google Security Settings
        </a>{" "}
        page. Upon revocation, our app will no longer be able to access your
        data.
      </p>

      <h2 className="text-xl font-semibold mt-6 mb-2">6. Contact Us</h2>
      <p className="mb-4">
        If you have questions about this Privacy Policy, please contact us at:{" "}
        <br />
        <strong>Email:</strong> thijmen.alexander.brand@gmail.com
      </p>
    </div>
  );
}
