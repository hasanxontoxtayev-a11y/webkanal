import Link from 'next/link';

export const metadata = {
  title: 'Privacy Policy | TubePilot AI',
  description: 'Privacy Policy and Terms of Service for TubePilot AI and YouTube API Services compliance.',
};

export default function PrivacyPolicyPage() {
  return (
    <div className="min-h-screen bg-dark-950 text-gray-200 py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto bg-dark-900 border border-dark-700 rounded-3xl p-8 sm:p-12 shadow-2xl">
        <div className="mb-8 border-b border-dark-700 pb-6 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-extrabold text-white">Privacy Policy</h1>
            <p className="text-sm text-gray-400 mt-1">Last updated: October 20, 2026</p>
          </div>
          <Link
            href="/"
            className="px-4 py-2 rounded-xl bg-dark-800 hover:bg-dark-750 text-rose-400 text-xs font-semibold border border-dark-650 transition-colors"
          >
            ← Home
          </Link>
        </div>

        <div className="space-y-6 text-sm leading-relaxed text-gray-300">
          <section>
            <h2 className="text-lg font-bold text-white mb-2">1. Introduction</h2>
            <p>
              Welcome to <strong>TubePilot AI</strong> (&quot;we&quot;, &quot;our&quot;, or &quot;us&quot;), available at{' '}
              <a href="https://www.tubepilotpro.com" className="text-rose-400 underline">
                https://www.tubepilotpro.com
              </a>
              . We are committed to protecting your personal information and your right to privacy. This policy
              explains how we collect, process, and protect your information when you connect your YouTube channel.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-white mb-2">2. Google API Services &amp; YouTube Data</h2>
            <p>
              TubePilot AI uses <strong>YouTube API Services</strong> to provide YouTube channel analytics,
              subscriber growth metrics, video performance evaluation, and AI-powered comment moderation.
            </p>
            <p className="mt-2">
              By using our service to pair your YouTube channel, you agree to be bound by the{' '}
              <a
                href="https://www.youtube.com/t/terms"
                target="_blank"
                rel="noreferrer"
                className="text-rose-400 underline"
              >
                YouTube Terms of Service
              </a>{' '}
              and the{' '}
              <a
                href="https://policies.google.com/privacy"
                target="_blank"
                rel="noreferrer"
                className="text-rose-400 underline"
              >
                Google Privacy Policy
              </a>
              .
            </p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-white mb-2">3. What Information We Access and Collect</h2>
            <ul className="list-disc pl-5 space-y-1">
              <li>
                <strong>Google Account Information:</strong> Your public name, email address, and avatar picture.
              </li>
              <li>
                <strong>YouTube Channel Data:</strong> Channel ID, title, custom URL, subscriber count, total video
                views, and public video metadata.
              </li>
              <li>
                <strong>Token Credentials:</strong> Encrypted OAuth 2.0 access tokens required to perform read-only
                channel statistics updates on your behalf.
              </li>
            </ul>
          </section>

          <section>
            <h2 className="text-lg font-bold text-white mb-2">4. How We Use Your Data (Google Limited Use Policy)</h2>
            <p>
              TubePilot AI complies with the{' '}
              <a
                href="https://developers.google.com/terms/api-services-user-data-policy"
                target="_blank"
                rel="noreferrer"
                className="text-rose-400 underline"
              >
                Google API Services User Data Policy
              </a>
              , including the Limited Use requirements.
            </p>
            <p className="mt-2">
              We strictly <strong>do NOT</strong> sell your personal or channel data to third parties, advertising
              platforms, or data brokers. Data retrieved via YouTube API is exclusively used to present analytics and
              AI insights inside your TubePilot AI dashboard.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-white mb-2">5. Data Retention &amp; Revoking Access</h2>
            <p>
              You may revoke TubePilot AI&apos;s access to your YouTube channel at any time directly through the Google
              Security Settings page at:{' '}
              <a
                href="https://myaccount.google.com/permissions"
                target="_blank"
                rel="noreferrer"
                className="text-rose-400 underline"
              >
                https://myaccount.google.com/permissions
              </a>
              .
            </p>
            <p className="mt-2">
              Alternatively, you can disconnect your channel inside your TubePilot AI dashboard with a single click,
              which purges all stored tokens from our database immediately.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-white mb-2">6. Contact Us</h2>
            <p>
              If you have any questions about this Privacy Policy, your data, or compliance, please contact our Data
              Protection Officer at:
            </p>
            <p className="mt-1 font-semibold text-white">
              Email: <a href="mailto:hasanxontoxtayev@gmail.com" className="text-rose-400">hasanxontoxtayev@gmail.com</a>
            </p>
            <p className="text-xs text-gray-400 mt-1">TubePilot AI, tubepilotpro.com</p>
          </section>
        </div>
      </div>
    </div>
  );
}
