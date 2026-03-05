'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { publications } from './data/publications';
import { authorDirectory } from './data/authors';
import { news } from './data/news';
import { experienceService } from './data/experience';
import { personalIntro } from './data/personalIntro';
import { siteConfig } from './data/siteConfig';

const heroTypeLines = [
  'build Human-Centered Robotic Intelligence.',
  'develop SAGE - SAfe AGile and GEneralizable Robotics.',
];

const itemAnim = {
  hidden: { opacity: 0, y: 18 },
  show: (i = 1) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.55, ease: [0.22, 1, 0.36, 1], delay: i * 0.06 },
  }),
};

function ThemeToggle() {
  const [theme, setTheme] = useState('dark');
  useEffect(() => {
    const saved = localStorage.getItem('theme') || 'dark';
    setTheme(saved);
    document.documentElement.setAttribute('data-theme', saved);
  }, []);

  const toggle = () => {
    const next = theme === 'dark' ? 'light' : 'dark';
    setTheme(next);
    document.documentElement.setAttribute('data-theme', next);
    localStorage.setItem('theme', next);
  };

  const isDark = theme === 'dark';

  return (
    <motion.button
      type="button"
      onClick={toggle}
      whileTap={{ scale: 0.94 }}
      className="relative flex h-8 w-8 items-center justify-center rounded-full border border-line/45 bg-panel/70 text-ink/90 transition hover:bg-panelSoft"
      title={`Switch to ${isDark ? 'light' : 'dark'} mode`}
      aria-label={`Switch to ${isDark ? 'light' : 'dark'} mode`}
    >
      <motion.svg
        width="18"
        height="18"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.9"
        strokeLinecap="round"
        strokeLinejoin="round"
        animate={{ rotate: isDark ? 0 : 180, scale: isDark ? 1 : 0.96 }}
        transition={{ type: 'spring', stiffness: 260, damping: 18 }}
      >
        {isDark ? (
          <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
        ) : (
          <>
            <circle cx="12" cy="12" r="4.2" />
            <path d="M12 2v2.2M12 19.8V22M4.2 4.2l1.6 1.6M18.2 18.2l1.6 1.6M2 12h2.2M19.8 12H22M4.2 19.8l1.6-1.6M18.2 5.8l1.6-1.6" />
          </>
        )}
      </motion.svg>
    </motion.button>
  );
}

function DotCard({ children, className = '', ...props }) {
  return (
    <div className="relative">
      <motion.div
        className="card-dot-bg absolute -bottom-3 -right-3 h-full w-full rounded-2xl"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true, amount: 0.15 }}
        transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1], delay: 0.2 }}
      />
      <div className={`relative ${className}`} {...props}>
        {children}
      </div>
    </div>
  );
}

function SectionTitle({ title }) {
  return (
    <motion.div initial="hidden" whileInView="show" viewport={{ once: true, amount: 0.3 }} variants={itemAnim}>
      <h2 className="font-serif text-3xl text-ink md:text-4xl">{title}</h2>
    </motion.div>
  );
}

function HeroTypewriter() {
  const FIXED_PREFIX = 'I seek to ';
  const START_DELAY = 450;
  const TYPE_DELAY = 82;
  const PREFIX_TYPE_DELAY = 90;
  const DELETE_DELAY = 56;
  const HOLD_DELAY = 1500;

  const [suffixIndex, setSuffixIndex] = useState(0);
  const [typedPrefixLength, setTypedPrefixLength] = useState(0);
  const [typedText, setTypedText] = useState('');
  const [phase, setPhase] = useState('waiting');

  useEffect(() => {
    if (phase === 'waiting') {
      const startTimer = setTimeout(() => {
        setPhase('typing-prefix');
      }, START_DELAY);

      return () => clearTimeout(startTimer);
    }

    if (phase === 'typing-prefix') {
      if (typedPrefixLength < FIXED_PREFIX.length) {
        const prefixTimer = setTimeout(() => {
          setTypedPrefixLength((prev) => prev + 1);
        }, PREFIX_TYPE_DELAY);

        return () => clearTimeout(prefixTimer);
      }

      setPhase('typing');
      return;
    }

    const targetText = heroTypeLines[suffixIndex];
    const isAtTarget = typedText === targetText;
    const isAtStart = typedText.length === 0;
    const delay = phase === 'holding' ? HOLD_DELAY : phase === 'deleting' ? DELETE_DELAY : TYPE_DELAY;

    const timer = setTimeout(() => {
      if (phase === 'holding') {
        setPhase('deleting');
        return;
      }

      if (phase === 'deleting') {
        if (!isAtStart) {
          setTypedText((prev) => prev.slice(0, -1));
          return;
        }

        setSuffixIndex((prev) => (prev + 1) % heroTypeLines.length);
        setPhase('typing');
        return;
      }

      if (!isAtTarget) {
        const nextLength = typedText.length + 1;
        setTypedText(targetText.slice(0, nextLength));
        return;
      }

      setPhase('holding');
    }, delay);

    return () => clearTimeout(timer);
  }, [typedPrefixLength, typedText, phase, suffixIndex, FIXED_PREFIX, START_DELAY, TYPE_DELAY, PREFIX_TYPE_DELAY, DELETE_DELAY, HOLD_DELAY]);

  const hasStarted = phase !== 'waiting';
  const visiblePrefix = FIXED_PREFIX.slice(0, typedPrefixLength);

  return (
    <div className="hero-typewriter">
      <span className="hero-typewriter-glow" aria-hidden="true" />
      <p className="hero-typewriter-text">
        {hasStarted ? <span className="hero-typewriter-prefix">&gt; </span> : null}
        <span className="hero-typewriter-main">{visiblePrefix}</span>
        <span className="hero-typewriter-suffix">{typedText}</span>
        {hasStarted ? (
          <span className="hero-typewriter-caret" aria-hidden="true">
            |
          </span>
        ) : null}
      </p>
    </div>
  );
}

function AuthorList({ authors }) {
  return (
    <p className="mt-3 font-mono text-sm leading-7 text-muted/78">
      {authors.map((author, idx) => {
        const profile = authorDirectory[author.id] || { name: author.id };
        const displayName = `${profile.name}${author.mark || ''}`;
        const isLast = idx === authors.length - 1;
        const isSecondLast = idx === authors.length - 2;
        const separator = isLast ? '' : isSecondLast ? ', and ' : ', ';
        const nameClass = profile.isSelf
          ? 'text-ink underline decoration-accent/60 underline-offset-2'
          : 'text-muted/78 transition hover:text-ink';

        return (
          <span key={`${author.id}-${idx}`}>
            {profile.homepage ? (
              <a href={profile.homepage} className={nameClass} rel="external nofollow noopener" target="_blank">
                {displayName}
              </a>
            ) : (
              <span className={profile.isSelf ? nameClass : ''}>{displayName}</span>
            )}
            {separator}
          </span>
        );
      })}
    </p>
  );
}

export default function HomePage() {
  const { profile, links } = siteConfig;

  return (
    <div className="relative min-h-screen bg-[var(--bg-main)] text-ink">
      <div className="fixed inset-0 -z-10">
        <div className="absolute -top-48 left-1/2 h-[34rem] w-[34rem] -translate-x-1/2 rounded-full" style={{ background: 'var(--hero-radial)' }} />
        <div className="absolute inset-0" style={{ background: 'var(--hero-linear)' }} />
        <div className="noise-overlay absolute inset-0" />
      </div>

      <header className="sticky top-0 z-50 border-b border-line/55 bg-panel/95 backdrop-blur-md">
        <div className="mx-auto flex h-12 w-full max-w-4xl items-center justify-between px-6 md:px-10">
          <div className="top-social flex items-center gap-3 text-[1.75rem] text-ink md:text-[1.8rem]">
            <a href={`mailto:${links.email}`} title="email" aria-label="email">
              <i className="fa-solid fa-envelope" />
            </a>
            <a href={links.github} title="GitHub" aria-label="GitHub" rel="external nofollow noopener" target="_blank">
              <i className="fa-brands fa-github" />
            </a>
            <a
              href={links.linkedin}
              title="LinkedIn"
              aria-label="LinkedIn"
              rel="external nofollow noopener"
              target="_blank"
            >
              <i className="fa-brands fa-linkedin" />
            </a>
            <a
              href={links.scholar}
              title="Google Scholar"
              aria-label="Google Scholar"
              rel="external nofollow noopener"
              target="_blank"
            >
              <i className="ai ai-google-scholar" />
            </a>
          </div>
          <ThemeToggle />
        </div>
      </header>

      <main id="top" className="mx-auto w-full max-w-4xl px-6 pb-20 pt-6 md:px-10 md:pt-8">
        <section className="mb-10 grid min-h-[calc(100vh-8rem)] items-start gap-10 md:mb-12 md:gap-14 md:grid-cols-[1.2fr_0.8fr]">
          <motion.div className="order-2 mt-6 space-y-7 md:order-1 md:mt-10" initial="hidden" animate="show" variants={{ show: { transition: { staggerChildren: 0.12 } } }}>
            <motion.div variants={itemAnim}>
              <h1 className="font-serif text-4xl leading-[1.08] text-ink md:text-6xl">{profile.name}</h1>
              <p className="mt-2 font-sans text-xl text-muted/80 md:text-2xl">{profile.nameZh}</p>
            </motion.div>
            <motion.p variants={itemAnim} className="max-w-xl text-[16.5px] leading-8 text-muted/85">
              {personalIntro.bio.beforeAdvisor}
              <a href={personalIntro.bio.advisorUrl} className="theme-link" rel="external nofollow noopener" target="_blank">
                {personalIntro.bio.advisorName}
              </a>
              {personalIntro.bio.afterAdvisor}
            </motion.p>
            <motion.p variants={itemAnim} className="text-base text-muted/80">
              {personalIntro.cv.lead}
              <a href={links.cv} className="font-semibold text-accent/95 hover:text-ink">
                {personalIntro.cv.label}
              </a>
              {personalIntro.cv.tail}
            </motion.p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.96, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1], delay: 0.15 }}
            className="order-1 mt-6 justify-self-center md:order-2 md:mt-10 md:justify-self-end"
          >
            <div className="relative w-[80vw] max-w-[360px] md:w-[280px]">
              <div className="dot-shadow absolute -bottom-5 -right-5 h-full w-full rounded-2xl" />
              <div className="relative aspect-[4/5] overflow-hidden rounded-2xl border border-line/45 bg-panel">
                <img src={links.profileImage} alt={profile.name} className="h-full w-full object-cover" />
              </div>
            </div>
          </motion.div>

          <motion.div
            className="order-3 md:col-span-2"
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1], delay: 0.28 }}
          >
            <HeroTypewriter />
          </motion.div>
        </section>

        <section className="mb-24 space-y-8">
          <SectionTitle title="News" />
          <DotCard>
            <motion.div
              initial="hidden"
              whileInView="show"
              viewport={{ once: true, amount: 0.2 }}
              variants={{ show: { transition: { staggerChildren: 0.06 } } }}
              className="max-h-[280px] space-y-1 overflow-y-auto rounded-2xl border border-line/45 bg-panel p-5"
            >
              {news.map((item, idx) => (
                <motion.div
                  key={`${item.date}-${idx}`}
                  variants={itemAnim}
                  custom={idx + 1}
                  className="grid items-center gap-2 border-b border-line/35 py-3 first:pt-0 last:border-0 last:pb-0 md:grid-cols-[112px_1fr]"
                >
                  <span className="self-center font-mono text-sm text-muted/55">{item.date}</span>
                  <span className="self-center text-sm leading-6 text-muted/82">{item.text}</span>
                </motion.div>
              ))}
            </motion.div>
          </DotCard>
        </section>

        <section id="research" className="mb-24 space-y-8">
          <SectionTitle title="Selected Publications" />
          <div className="space-y-7">
            {publications.map((pub, idx) => (
              <DotCard key={pub.title}>
                <motion.article
                  initial="hidden"
                  whileInView="show"
                  viewport={{ once: true, amount: 0.15 }}
                  variants={itemAnim}
                  custom={idx + 1}
                  className="group rounded-2xl border border-line/45 bg-panelSoft p-6 transition hover:border-accent/45 hover:bg-panelSoft"
                >
                  <h3 className="font-serif text-lg leading-snug text-ink md:text-xl">{pub.title}</h3>
                  <AuthorList authors={pub.authors} />
                  <div className="mt-4 flex flex-wrap items-center gap-3">
                    <span
                      className="rounded-md border px-2 py-0.5 font-mono text-xs tracking-[0.08em]"
                      style={{ background: 'var(--venue-bg)', borderColor: 'var(--venue-border)', color: 'var(--venue-text)' }}
                    >
                      {pub.venue}
                    </span>
                    {pub.awards.map((award) => (
                      <span
                        key={award}
                        className="rounded-md border px-2 py-0.5 font-mono text-xs tracking-[0.04em]"
                        style={{ background: 'var(--award-bg)', borderColor: 'var(--award-border)', color: 'var(--award-text)' }}
                      >
                        {award}
                      </span>
                    ))}
                  </div>
                  <div className="mt-4 flex flex-wrap gap-3">
                    {pub.links.map((link) => (
                      <a
                        key={link.label}
                        href={link.url}
                        className={`theme-link font-mono text-sm transition ${link.label === 'Awards' ? 'font-bold' : ''}`}
                        rel="external nofollow noopener"
                        target="_blank"
                      >
                        [{link.label}]
                      </a>
                    ))}
                  </div>
                </motion.article>
              </DotCard>
            ))}
          </div>
        </section>

        <section id="about" className="mb-24 space-y-8">
          <SectionTitle title="Experience & Service" />
          <div className="grid gap-10 md:grid-cols-2 md:gap-16">
          <div className="space-y-6">
            <p className="font-mono text-[11px] uppercase tracking-[0.12em] text-muted/42">// EDUCATION & EXPERIENCE</p>
            <div className="space-y-6">
              {experienceService.educationExperience.map((item) => (
                <DotCard key={item.place}>
                  <div className="rounded-xl border border-line/45 bg-panel px-4 py-4">
                    <p className="font-medium text-ink">{item.place}</p>
                    <p className="mt-1 text-sm text-muted/75">{item.role}</p>
                    <p className="mt-1 font-mono text-[11px] tracking-[0.08em] text-muted/55">{item.time}</p>
                  </div>
                </DotCard>
              ))}
            </div>
          </div>

          <div className="space-y-6">
            <p className="font-mono text-[11px] uppercase tracking-[0.12em] text-muted/42">// SERVICE</p>
            <div className="space-y-6">
              <DotCard>
                <div className="rounded-2xl border border-line/45 bg-panel p-5">
                  <p className="font-mono text-[11px] uppercase tracking-[0.12em] text-muted/48">Reviewer</p>
                  <p className="mt-3 text-sm leading-8 text-muted/82">
                    {experienceService.service.reviewerVenues.map((venue, idx) => (
                      <span key={venue.label}>
                        <a href={venue.url} className="theme-link" rel="external nofollow noopener" target="_blank">
                          {venue.label}
                        </a>
                        {idx < experienceService.service.reviewerVenues.length - 1 ? ', ' : ''}
                      </span>
                    ))}
                  </p>
                </div>
              </DotCard>
              <DotCard>
                <div className="rounded-2xl border border-line/45 bg-panel p-5">
                  <p className="font-mono text-[11px] uppercase tracking-[0.12em] text-muted/48">Teaching</p>
                  <p className="mt-3 text-sm leading-8 text-muted/82">{experienceService.service.teaching}</p>
                </div>
              </DotCard>
              <DotCard>
                <div className="rounded-2xl border border-line/45 bg-panel p-5">
                  <p className="font-mono text-[11px] uppercase tracking-[0.12em] text-muted/48">Volunteer</p>
                  <p className="mt-3 text-sm leading-8 text-muted/82">
                    <a
                      href={experienceService.service.volunteer.url}
                      className="theme-link"
                      rel="external nofollow noopener"
                      target="_blank"
                    >
                      {experienceService.service.volunteer.label}
                    </a>
                  </p>
                </div>
              </DotCard>
            </div>
          </div>
          </div>
        </section>

        <section className="mb-24 space-y-8">
          <SectionTitle title="Miscellaneous" />
          <p className="text-sm leading-8 text-muted/82">
            CS2 and Football Manager enthusiast. Former varsity soccer player. Huge fan of{' '}
            <a href="https://www.lcfc.com/" className="theme-link" rel="external nofollow noopener" target="_blank">
              Leicester City
            </a>{' '}
            and{' '}
            <a href="https://www.inter.it/en" className="theme-link" rel="external nofollow noopener" target="_blank">
              Inter Milan
            </a>
            .
          </p>
        </section>
      </main>

      <footer>
        <div className="mx-auto flex w-full max-w-4xl items-center justify-center px-6 py-8 md:px-10">
          <span className="font-serif text-sm tracking-[0.04em] text-muted/45">© 2023-2026 Zizhe Zhang</span>
        </div>
      </footer>
    </div>
  );
}
