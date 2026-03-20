import type { Metadata } from 'next';
import { DM_Serif_Display, DM_Sans } from 'next/font/google';
import { draftMode } from 'next/headers';
import Link from 'next/link';
import Navbar from '@/components/Navbar/Navbar';
import '@/styles/globals.scss';

const dmSerifDisplay = DM_Serif_Display({
  variable: '--font-dm-serif-display',
  subsets: ['latin'],
  weight: '400',
});

const dmSans = DM_Sans({
  variable: '--font-dm-sans',
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
});

export const metadata: Metadata = {
  title: {
    template: '%s | Pulse',
    default: 'Pulse',
  },
  description: 'Pulse — the place for modern ideas.',
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const { isEnabled: isDraft } = await draftMode();

  return (
    <html
      lang="en"
      className={`${dmSerifDisplay.variable} ${dmSans.variable}`}
    >
      <body>
        {isDraft && (
          <div
            style={{
              background: '#fef08a',
              color: '#713f12',
              padding: '0.5rem 1rem',
              textAlign: 'center',
              fontSize: '0.875rem',
              fontWeight: 500,
            }}
          >
            Draft mode active —{' '}
            <Link
              href="/api/disable-draft"
              prefetch={false}
              style={{ color: '#713f12', textDecoration: 'underline' }}
            >
              exit preview
            </Link>
          </div>
        )}
        <Navbar />
        <main>{children}</main>
      </body>
    </html>
  );
}
