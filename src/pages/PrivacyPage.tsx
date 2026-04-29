import { ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useEffect } from 'react';

const LAST_UPDATED = 'April 29, 2026';

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="space-y-2">
      <h3 className="text-base font-semibold text-gray-900 dark:text-gray-100">{title}</h3>
      <div className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed space-y-2">
        {children}
      </div>
    </section>
  );
}

export default function PrivacyPage() {
  const navigate = useNavigate();

  useEffect(() => {
    document.title = 'Privacy Policy - Prayer Times';
  }, []);

  return (
    <div className="flex min-h-dvh flex-col bg-slate-50 dark:bg-gray-950">
      <header className="flex items-center sticky top-0 z-10 gap-3 border-b border-gray-200 bg-white px-4 py-3 shadow-sm dark:border-gray-800 dark:bg-gray-900">
        <Button variant="ghost" size="icon" onClick={() => navigate(-1)} className="shrink-0">
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <h1 className="truncate text-base font-semibold text-gray-900 dark:text-gray-100">
          Privacy Policy
        </h1>
      </header>

      <div className="flex-1 overflow-y-auto mx-auto w-full max-w-2xl p-6 space-y-6">
        <p className="text-xs text-muted-foreground">Last updated: {LAST_UPDATED}</p>

        <Section title="Overview">
          <p>
            Mosque Prayer Times (&ldquo;the App&rdquo;) is committed to protecting your privacy.
            This policy explains what information we collect, how we use it, and your rights
            regarding your data.
          </p>
        </Section>

        <div className="border-t" />

        <Section title="Information We Collect">
          <p>
            <strong>Location data.</strong> When you use the App, we request access to your
            device&rsquo;s geolocation to find mosques near you. Location data is used solely
            to query the Google Places API and is never stored on our servers.
          </p>
          <p>
            <strong>Bookmarks and preferences.</strong> Your saved bookmarks, dark mode setting,
            search radius, and sort preference are stored locally in your browser&rsquo;s
            localStorage. This data never leaves your device.
          </p>
          <p>
            <strong>No account required.</strong> The App does not require you to create an
            account or provide any personally identifiable information.
          </p>
        </Section>

        <div className="border-t" />

        <Section title="Third-Party Services">
          <p>
            The App integrates with the following third-party services, each governed by their
            own privacy policies:
          </p>
          <ul className="list-disc list-inside space-y-1 pl-1">
            <li>
              <strong>Google Maps Platform</strong> — used for displaying maps, finding nearby
              mosques, and retrieving place details. See{' '}
              <a
                href="https://policies.google.com/privacy"
                target="_blank"
                rel="noopener noreferrer"
                className="text-green-700 underline dark:text-green-400"
              >
                Google&rsquo;s Privacy Policy
              </a>
              .
            </li>
            <li>
              <strong>Aladhan API</strong> — used to calculate prayer times. No personal data is
              sent to this service.
            </li>
            <li>
              <strong>Firebase / Firestore</strong> — used to store general mosque data. No
              personal information is stored.
            </li>
          </ul>
        </Section>

        <div className="border-t" />

        <Section title="Cookies and Local Storage">
          <p>
            The App uses browser localStorage to persist your settings and bookmarks between
            sessions. We do not use cookies for tracking or advertising purposes.
          </p>
        </Section>

        <div className="border-t" />

        <Section title="Children's Privacy">
          <p>
            The App is not directed at children under the age of 13. We do not knowingly collect
            personal information from children.
          </p>
        </Section>

        <div className="border-t" />

        <Section title="Changes to This Policy">
          <p>
            We may update this Privacy Policy from time to time. Changes will be reflected by an
            updated &ldquo;Last updated&rdquo; date above. We encourage you to review this page
            periodically.
          </p>
        </Section>

        <div className="border-t" />

        <Section title="Contact">
          <p>
            If you have any questions about this Privacy Policy, please open an issue on the
            project repository or contact the maintainer directly.
          </p>
        </Section>

        <p className="pb-4 text-center text-xs text-muted-foreground">
          &copy; {new Date().getFullYear()} Mosque Prayer Times. All rights reserved.
        </p>
      </div>
    </div>
  );
}
