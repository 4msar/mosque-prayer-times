import { ArrowLeft, Building2 } from 'lucide-react';
import { useNavigate, Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useEffect } from 'react';

const APP_VERSION = '1.0.0';

export default function AboutPage() {
  const navigate = useNavigate();

  useEffect(() => {
    document.title = 'About - Prayer Times';
  }, []);

  return (
    <div className="flex min-h-dvh flex-col bg-slate-50 dark:bg-gray-950">
      <header className="flex items-center sticky top-0 z-10 gap-3 border-b border-gray-200 bg-white px-4 py-3 shadow-sm dark:border-gray-800 dark:bg-gray-900">
        <Button variant="ghost" size="icon" onClick={() => navigate(-1)} className="shrink-0">
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <h1 className="truncate text-base font-semibold text-gray-900 dark:text-gray-100">
          About
        </h1>
      </header>

      <div className="flex-1 overflow-y-auto mx-auto w-full max-w-2xl p-6 space-y-8">
        {/* App identity */}
        <div className="flex flex-col items-center gap-4 pt-4 text-center">
          <div className="flex h-20 w-20 items-center justify-center rounded-2xl bg-green-600 shadow-md">
            <Building2 className="h-10 w-10 text-white" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
              Mosque Prayer Times
            </h2>
            <p className="mt-1 text-sm text-muted-foreground">Version {APP_VERSION}</p>
          </div>
          <p className="max-w-sm text-sm text-muted-foreground leading-relaxed">
            Find nearby mosques and get accurate prayer times based on your location.
            Built for Muslims who want a fast, simple, and reliable way to stay on schedule
            with their daily prayers.
          </p>
        </div>

        <div className="border-t" />

        {/* Features */}
        <section className="space-y-3">
          <h3 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">
            Features
          </h3>
          <ul className="space-y-2 text-sm text-gray-700 dark:text-gray-300">
            {[
              'Find mosques near your current location',
              'View accurate prayer times for each mosque',
              'Bookmark your favourite mosques',
              'Sort by distance or popularity',
              'Adjustable search radius',
              'Dark mode support',
              'Works as an installable PWA',
            ].map((feature) => (
              <li key={feature} className="flex items-start gap-2">
                <span className="mt-1.75 h-1.5 w-1.5 shrink-0 rounded-full bg-green-600" />
                {feature}
              </li>
            ))}
          </ul>
        </section>

        <div className="border-t" />

        {/* Data sources */}
        <section className="space-y-3">
          <h3 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">
            Data Sources
          </h3>
          <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed">
            Mosque locations and details are powered by the{' '}
            <span className="font-medium text-green-700 dark:text-green-400">
              Google Places API
            </span>
            . Prayer times are calculated using established Islamic astronomical methods
            via the{' '}
            <span className="font-medium text-green-700 dark:text-green-400">
              Aladhan Prayer Times API
            </span>
            .
          </p>
        </section>

        <div className="border-t" />

        {/* Legal */}
        <section className="space-y-3">
          <h3 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">
            Legal &amp; Support
          </h3>
          <div className="flex flex-col gap-2">
            <Link
              to="/privacy"
              className="flex items-center justify-between rounded-lg border border-gray-200 bg-white px-4 py-3 text-sm font-medium text-gray-800 hover:bg-gray-50 dark:border-gray-800 dark:bg-gray-900 dark:text-gray-200 dark:hover:bg-gray-800 transition-colors"
            >
              Privacy Policy
              <ArrowLeft className="h-4 w-4 rotate-180 text-muted-foreground" />
            </Link>
            <Link
              to="/terms"
              className="flex items-center justify-between rounded-lg border border-gray-200 bg-white px-4 py-3 text-sm font-medium text-gray-800 hover:bg-gray-50 dark:border-gray-800 dark:bg-gray-900 dark:text-gray-200 dark:hover:bg-gray-800 transition-colors"
            >
              Terms of Service
              <ArrowLeft className="h-4 w-4 rotate-180 text-muted-foreground" />
            </Link>
            <Link
              to="mailto:contact@mpt.life"
              className="flex items-center justify-between rounded-lg border border-gray-200 bg-white px-4 py-3 text-sm font-medium text-gray-800 hover:bg-gray-50 dark:border-gray-800 dark:bg-gray-900 dark:text-gray-200 dark:hover:bg-gray-800 transition-colors"
            >
              Email Support
              <ArrowLeft className="h-4 w-4 rotate-180 text-muted-foreground" />
            </Link>
            <a
              href="https://github.com/4msar/mosque-prayer-times"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-between rounded-lg border border-gray-200 bg-white px-4 py-3 text-sm font-medium text-gray-800 hover:bg-gray-50 dark:border-gray-800 dark:bg-gray-900 dark:text-gray-200 dark:hover:bg-gray-800 transition-colors"
            >
              GitHub Repository
              <ArrowLeft className="h-4 w-4 rotate-180 text-muted-foreground" />
            </a>
          </div>
        </section>

        <div className="border-t" />

        <p className="pb-4 text-center text-xs text-muted-foreground">
          &copy; {new Date().getFullYear()} Mosque Prayer Times. All rights reserved.
        </p>
      </div>
    </div>
  );
}
