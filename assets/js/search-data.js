// get the ninja-keys element
const ninja = document.querySelector('ninja-keys');

// add the home and posts menu items
ninja.data = [{
    id: "nav-about",
    title: "About",
    section: "Navigation",
    handler: () => {
      window.location.href = "/";
    },
  },{id: "nav-publications",
          title: "Publications",
          description: "Publications in reversed chronological order.",
          section: "Navigation",
          handler: () => {
            window.location.href = "/publications/";
          },
        },{id: "nav-cv",
          title: "CV",
          description: "",
          section: "Navigation",
          handler: () => {
            window.location.href = "/cv/";
          },
        },{id: "post-google-gemini-updates-flash-1-5-gemma-2-and-project-astra",
      
        title: 'Google Gemini updates: Flash 1.5, Gemma 2 and Project Astra <svg width="1.2rem" height="1.2rem" top=".5rem" viewBox="0 0 40 40" xmlns="http://www.w3.org/2000/svg"><path d="M17 13.5v6H5v-12h6m3-3h6v6m0-6-9 9" class="icon_svg-stroke" stroke="#999" stroke-width="1.5" fill="none" fill-rule="evenodd" stroke-linecap="round" stroke-linejoin="round"></path></svg>',
      
      description: "We’re sharing updates across our Gemini family of models and a glimpse of Project Astra, our vision for the future of AI assistants.",
      section: "Posts",
      handler: () => {
        
          window.open("https://blog.google/technology/ai/google-gemini-update-flash-ai-assistant-io-2024/", "_blank");
        
      },
    },{id: "post-displaying-external-posts-on-your-al-folio-blog",
      
        title: 'Displaying External Posts on Your al-folio Blog <svg width="1.2rem" height="1.2rem" top=".5rem" viewBox="0 0 40 40" xmlns="http://www.w3.org/2000/svg"><path d="M17 13.5v6H5v-12h6m3-3h6v6m0-6-9 9" class="icon_svg-stroke" stroke="#999" stroke-width="1.5" fill="none" fill-rule="evenodd" stroke-linecap="round" stroke-linejoin="round"></path></svg>',
      
      description: "",
      section: "Posts",
      handler: () => {
        
          window.open("https://medium.com/@al-folio/displaying-external-posts-on-your-al-folio-blog-b60a1d241a0a?source=rss-17feae71c3c4------2", "_blank");
        
      },
    },{id: "news-joined-figueroa-robotics-lab-penn-under-the-supervision-of-prof-nadia-figueroa",
          title: 'Joined Figueroa Robotics Lab@Penn, under the supervision of Prof. Nadia Figueroa.',
          description: "",
          section: "News",},{id: "news-my-first-journal-paper-has-been-accepted-to-ieee-ra-l-today",
          title: 'My first journal paper has been accepted to IEEE RA-L today!',
          description: "",
          section: "News",},{id: "news-joined-the-dexlab-at-duke-university-as-a-visiting-scholar-till-august-under-the-supervision-of-prof-xianyi-cheng",
          title: 'Joined the DexLab at Duke University as a Visiting Scholar till August, under...',
          description: "",
          section: "News",},{id: "news-i-will-serve-as-a-volunteer-in-rss-2025-los-angeles",
          title: 'I will serve as a volunteer in RSS 2025, Los Angeles.',
          description: "",
          section: "News",},{id: "news-i-am-excited-to-share-that-our-work-vpp-tc-received-the-best-student-paper-award-at-iros-workshop-on-building-safe-robots-2025",
          title: 'I am excited to share that our work VPP-TC received the 🏆Best Student...',
          description: "",
          section: "News",},{id: "news-i-am-excited-to-share-that-our-work-vpp-tc-received-the-best-contribution-award-first-prize-at-iros-workshop-on-exploring-the-role-of-energy-in-robot-learning-and-control-2025",
          title: 'I am excited to share that our work VPP-TC received the 🏆Best Contribution...',
          description: "",
          section: "News",},{id: "news-i-am-excited-to-share-that-our-work-vpp-tc-and-flow-with-the-force-filed-are-accepted-to-icra-2026-and-vlmgineer-is-accepted-to-iclr-2026",
          title: 'I am excited to share that our work VPP-TC and Flow with the...',
          description: "",
          section: "News",},{
      id: 'light-theme',
      title: 'Change theme to light',
      description: 'Change the theme of the site to Light',
      section: 'Theme',
      handler: () => {
        setThemeSetting("light");
      },
    },
    {
      id: 'dark-theme',
      title: 'Change theme to dark',
      description: 'Change the theme of the site to Dark',
      section: 'Theme',
      handler: () => {
        setThemeSetting("dark");
      },
    },
    {
      id: 'system-theme',
      title: 'Use system default theme',
      description: 'Change the theme of the site to System Default',
      section: 'Theme',
      handler: () => {
        setThemeSetting("system");
      },
    },];
