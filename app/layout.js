import { Space_Mono, Source_Serif_4 } from 'next/font/google';
import Script from 'next/script';
import './globals.css';
import { siteConfig } from './data/siteConfig';

const sourceSerif = Source_Serif_4({ subsets: ['latin'], variable: '--font-serif' });
const spaceMono = Space_Mono({ subsets: ['latin'], variable: '--font-mono', weight: ['400', '700'], style: ['normal', 'italic'] });
const siteIcon = siteConfig.branding.siteIcon;
const siteUrl = siteConfig.branding.siteUrl;
const canonicalUrl = `${siteUrl.replace(/\/+$/, '')}/`;
const enableGoogleVerification = siteConfig.integrations.enableGoogleVerification;
const enableBingVerification = siteConfig.integrations.enableBingVerification;
const googleVerification = siteConfig.integrations.googleSiteVerification;
const bingVerification = siteConfig.integrations.bingSiteVerification;
const enableGoogleAnalytics = siteConfig.integrations.enableGoogleAnalytics;
const googleAnalyticsId = siteConfig.integrations.googleAnalyticsId;
const googleTagManagerId = siteConfig.integrations.googleTagManagerId;

export const metadata = {
  title: siteConfig.profile.name,
  description: siteConfig.profile.description,
  metadataBase: new URL(siteUrl),
  alternates: {
    canonical: '/',
  },
  icons: {
    icon: siteIcon,
    shortcut: siteIcon,
    apple: siteIcon,
  },
  ...((enableGoogleVerification && googleVerification) || (enableBingVerification && bingVerification)
    ? {
        verification: {
          ...(enableGoogleVerification && googleVerification ? { google: googleVerification } : {}),
          ...(enableBingVerification && bingVerification ? { bing: bingVerification } : {}),
        },
      }
    : {}),
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <link
          rel="stylesheet"
          href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.7.2/css/all.min.css"
          integrity="sha512-Evv84Mr4kqVGRNSgIGL/F/aIDqQb7xQ2vcrdIwxfjThSH8CSR7PBEakCr51Ck+w+/U6swU2Im1vVX0SVk9ABhg=="
          crossOrigin="anonymous"
          referrerPolicy="no-referrer"
        />
        <link rel="canonical" href={canonicalUrl} />
        <link rel="stylesheet" href="/vendor/icons/academicons-local.css" />
      </head>
      <body className={`${sourceSerif.variable} ${spaceMono.variable} antialiased`}>
        {googleTagManagerId ? (
          <>
            <Script id="google-tag-manager" strategy="afterInteractive">
              {`
                (function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
                new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
                j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
                'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
                })(window,document,'script','dataLayer','${googleTagManagerId}');
              `}
            </Script>
            <noscript>
              <iframe
                src={`https://www.googletagmanager.com/ns.html?id=${googleTagManagerId}`}
                height="0"
                width="0"
                style={{ display: 'none', visibility: 'hidden' }}
              />
            </noscript>
          </>
        ) : null}
        {enableGoogleAnalytics && googleAnalyticsId ? (
          <>
            <Script src={`https://www.googletagmanager.com/gtag/js?id=${googleAnalyticsId}`} strategy="afterInteractive" />
            <Script id="google-analytics" strategy="afterInteractive">
              {`
                window.dataLayer = window.dataLayer || [];
                function gtag(){dataLayer.push(arguments);}
                gtag('js', new Date());
                gtag('config', '${googleAnalyticsId}');
              `}
            </Script>
          </>
        ) : null}
        {children}
      </body>
    </html>
  );
}
