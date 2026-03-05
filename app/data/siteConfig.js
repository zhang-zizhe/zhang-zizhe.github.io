export const siteConfig = {
  profile: {
    name: 'Zizhe Zhang',
    nameZh: '张子哲',
    description: 'Personal homepage of Zizhe Zhang',
  },
  branding: {
    siteIcon: '/favicon.ico',
    siteUrl: 'https://zizhe.io',
  },
  links: {
    email: 'zizhe@seas.upenn.edu',
    github: 'https://github.com/zhang-zizhe',
    linkedin: 'https://www.linkedin.com/in/zizhe-zhang',
    scholar: 'https://scholar.google.com/citations?user=0OY7JKAAAAAJ',
    cv: '/files/CV_ZZ.pdf',
    profileImage: '/images/profile.jpg',
  },
  integrations: {
    enableGoogleAnalytics: (process.env.NEXT_PUBLIC_ENABLE_GOOGLE_ANALYTICS || 'true') === 'true',
    enableGoogleVerification: (process.env.NEXT_PUBLIC_ENABLE_GOOGLE_VERIFICATION || 'true') === 'true',
    enableBingVerification: (process.env.NEXT_PUBLIC_ENABLE_BING_VERIFICATION || 'false') === 'true',
    googleSiteVerification:
      process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION || 'llTkIcQyZbmFG-pCH6ISDs5oDsKiXb7IQbatOsYqtqw',
    bingSiteVerification: process.env.NEXT_PUBLIC_BING_SITE_VERIFICATION || '',
    googleAnalyticsId: process.env.NEXT_PUBLIC_GOOGLE_ANALYTICS_ID || 'G-BRH99LF2NL',
    googleTagManagerId: process.env.NEXT_PUBLIC_GOOGLE_TAG_MANAGER_ID || '',
  },
};
