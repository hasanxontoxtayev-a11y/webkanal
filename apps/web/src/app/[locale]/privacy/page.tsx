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
            <h2 className="text-lg font-bold text-white mb-2">4. How We Use and Protect Google User Data</h2>
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
              , including the <strong>Limited Use</strong> requirements.
            </p>
            <div className="mt-3 space-y-2">
              <p>
                <strong>Specific Data Usage:</strong> Google user data (channel statistics, video metadata, and comment threads) is accessed solely to calculate growth metrics (CTR, VPH, estimated earnings) and draft creator-approved replies in the TubePilot AI dashboard.
              </p>
              <p>
                <strong>No Data Transfers or Sales:</strong> We strictly do NOT sell, lease, or trade your personal or YouTube channel data to third parties, advertising networks, or data brokers.
              </p>
              <p>
                <strong>No AI Model Training on User Data:</strong> TubePilot AI does NOT use Google user data to train, fine-tune, or improve generalized artificial intelligence or machine learning models. User data processed via Google Gemini API is ephemeral and adheres to strict enterprise privacy standards.
              </p>
            </div>
          </section>

          <section>
            <h2 className="text-lg font-bold text-white mb-2">5. Data Protection and Security Mechanisms</h2>
            <p>
              We implement comprehensive technical and organizational measures to safeguard confidential user data:
            </p>
            <ul className="list-disc pl-5 space-y-2 mt-2">
              <li>
                <strong>AES-256 Encryption at Rest:</strong> All OAuth tokens (access tokens and refresh tokens) are encrypted at rest using industry-standard AES-256-CBC encryption with unique cryptographic initialization vectors before storage.
              </li>
              <li>
                <strong>TLS/HTTPS Encryption in Transit:</strong> All communications between users, TubePilot AI, Google APIs, and Telegram bots are strictly encrypted in transit using TLS 1.3 / HTTPS.
              </li>
              <li>
                <strong>Strict Access Controls:</strong> Database and server infrastructure access is restricted via multi-factor authentication (MFA) and least-privilege role-based access controls (RBAC).
              </li>
              <li>
                <strong>Vulnerability Management:</strong> Continuous automated security patch auditing and dependency vulnerability scanning.
              </li>
            </ul>
          </section>

          <section>
            <h2 className="text-lg font-bold text-white mb-2">6. Data Retention, Deletion, and Revoking Access</h2>
            <p>
              You have complete control over your data and authorization:
            </p>
            <ul className="list-disc pl-5 space-y-2 mt-2">
              <li>
                <strong>Google Account Permissions:</strong> You can revoke TubePilot AI&apos;s access at any moment via Google Security Settings:{' '}
                <a
                  href="https://myaccount.google.com/permissions"
                  target="_blank"
                  rel="noreferrer"
                  className="text-rose-400 underline"
                >
                  https://myaccount.google.com/permissions
                </a>.
              </li>
              <li>
                <strong>Instant Channel Disconnect &amp; Purge:</strong> Clicking &quot;Disconnect Channel&quot; in the TubePilot AI workspace instantly purges all stored tokens, credentials, and cached channel records from our database.
              </li>
              <li>
                <strong>Right to Erasure:</strong> Users can request full permanent deletion of their account and associated data by emailing our support team.
              </li>
            </ul>
          </section>

          <section>
            <h2 className="text-lg font-bold text-white mb-2">7. Contact Information</h2>
            <p>
              For privacy inquiries, data deletion requests, or security verification questions:
            </p>
            <p className="mt-1 font-semibold text-white">
              Primary Developer &amp; Data Protection Contact:{' '}
              <a href="mailto:hasanxontoxtayev@gmail.com" className="text-rose-400 underline">
                hasanxontoxtayev@gmail.com
              </a>
            </p>
            <p className="text-xs text-gray-400 mt-1">TubePilot AI (Project ID: tubepilot-512119 / 427558992320) — https://www.tubepilotpro.com</p>
          </section>
        </div>
      </div>
    </div>
  );
}
