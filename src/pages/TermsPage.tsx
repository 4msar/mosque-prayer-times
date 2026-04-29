import { ArrowLeft } from 'lucide-react';
import { useNavigate, Link } from 'react-router-dom';
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

export default function TermsPage() {
  const navigate = useNavigate();

  useEffect(() => {
    document.title = 'Terms of Service - Prayer Times';
  }, []);

  return (
    <div className="flex min-h-dvh flex-col bg-slate-50 dark:bg-gray-950">
      <header className="flex items-center sticky top-0 z-10 gap-3 border-b border-gray-200 bg-white px-4 py-3 shadow-sm dark:border-gray-800 dark:bg-gray-900">
        <Button variant="ghost" size="icon" onClick={() => navigate(-1)} className="shrink-0">
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <h1 className="truncate text-base font-semibold text-gray-900 dark:text-gray-100">
          Terms of Service
        </h1>
      </header>

      <div className="flex-1 overflow-y-auto mx-auto w-full max-w-2xl p-6 space-y-6">
        <p className="text-xs text-muted-foreground">Last updated: {LAST_UPDATED}</p>

        <Section title="Acceptance of Terms">
          <p>
            By accessing or using Mosque Prayer Times (&ldquo;the App&rdquo;), you agree to be
            bound by these Terms of Service. If you do not agree to these terms, please do not
            use the App.
          </p>
        </Section>

        <div className="border-t" />

        <Section title="Use of the App">
          <p>
            The App is provided free of charge for personal, non-commercial use. You agree to
            use the App only for lawful purposes and in a manner that does not infringe the
            rights of others.
          </p>
          <p>You agree not to:</p>
          <ul className="list-disc list-inside space-y-1 pl-1">
            <li>Reverse-engineer, decompile, or disassemble any part of the App.</li>
            <li>Use the App in a way that could damage, disable, or impair its operation.</li>
            <li>Attempt to gain unauthorised access to any systems connected to the App.</li>
            <li>Scrape, crawl, or extract data in bulk from the App or its data sources.</li>
          </ul>
        </Section>

        <div className="border-t" />

        <Section title="Accuracy of Information">
          <p>
            Prayer times are calculated using established Islamic astronomical methods. While we
            strive for accuracy, prayer times may vary slightly depending on calculation method
            and local conditions. Always verify prayer times with your local mosque or authority.
          </p>
          <p>
            Mosque location and details are provided by Google Places. We do not guarantee the
            accuracy, completeness, or currency of this information.
          </p>
        </Section>

        <div className="border-t" />

        <Section title="Intellectual Property">
          <p>
            The App and its original content, features, and functionality are owned by the
            developers and are protected by applicable intellectual property laws. Third-party
            data (Google Maps, Aladhan) remains the property of their respective owners.
          </p>
        </Section>

        <div className="border-t" />

        <Section title="Disclaimer of Warranties">
          <p>
            The App is provided &ldquo;as is&rdquo; and &ldquo;as available&rdquo; without
            warranties of any kind, express or implied. We do not warrant that the App will be
            uninterrupted, error-free, or free of viruses or other harmful components.
          </p>
        </Section>

        <div className="border-t" />

        <Section title="Limitation of Liability">
          <p>
            To the fullest extent permitted by law, the developers of this App shall not be
            liable for any indirect, incidental, special, or consequential damages arising from
            your use of, or inability to use, the App.
          </p>
        </Section>

        <div className="border-t" />

        <Section title="Third-Party Links and Services">
          <p>
            The App relies on third-party services (Google Maps, Aladhan, Firebase). We are
            not responsible for the content, policies, or practices of these services. Please
            review their respective terms and policies.
          </p>
        </Section>

        <div className="border-t" />

        <Section title="Changes to Terms">
          <p>
            We reserve the right to modify these Terms at any time. Continued use of the App
            after changes constitutes your acceptance of the revised Terms. The &ldquo;Last
            updated&rdquo; date above reflects the most recent revision.
          </p>
        </Section>

        <div className="border-t" />

        <Section title="Privacy">
          <p>
            Your use of the App is also governed by our{' '}
            <Link to="/privacy" className="text-green-700 underline dark:text-green-400">
              Privacy Policy
            </Link>
            , which is incorporated into these Terms by reference.
          </p>
        </Section>

        <p className="pb-4 text-center text-xs text-muted-foreground">
          &copy; {new Date().getFullYear()} Mosque Prayer Times. All rights reserved.
        </p>
      </div>
    </div>
  );
}
