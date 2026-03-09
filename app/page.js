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
    <motion.div
      className="relative"
      initial={{ opacity: 0, y: 18 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.15 }}
      transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
    >
      <div className="card-dot-bg absolute -bottom-3 -right-3 h-full w-full rounded-2xl" />
      <div className={`relative ${className}`} {...props}>
        {children}
      </div>
    </motion.div>
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
      <div className="hero-typewriter-inner">
        <RobotIcon />
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
    </div>
  );
}

const SHAPE_VIEWBOX = {
  chip: '0 0 24 24',
  gear: '0 0 1280 1280',
  arm: '0 0 72 72',
  robot: '0 0 400 400',
  robotDanger: '0 0 400 400',
  robotLove: '0 0 400 400',
  robotNeutral: '0 0 400 400',
};

const floatingParts = [
  // Row 1 (top ~3-12%)
  { shape: 'gear',  top: '3%',  left: '8%',  size: 18, opacity: 0.22, opacityLight: 0.14, duration: '22s', delay: '0s',    rotate: 15 },
  { shape: 'chip',  top: '7%',  left: '32%', size: 24, opacity: 0.18, opacityLight: 0.11, duration: '26s', delay: '-4s',   rotate: -25 },
  { shape: 'robot',        top: '5%',  left: '58%', size: 44, opacity: 0.20, opacityLight: 0.12, duration: '19s', delay: '-8s',   rotate: 10 },
  { shape: 'arm',   top: '10%', left: '85%', size: 46, opacity: 0.18, opacityLight: 0.11, duration: '24s', delay: '-2s',   rotate: -15 },
  // Row 2 (~20-28%)
  { shape: 'arm',   top: '22%', left: '12%', size: 40, opacity: 0.16, opacityLight: 0.10, duration: '28s', delay: '-12s',  rotate: 45 },
  { shape: 'gear',  top: '25%', left: '42%', size: 14, opacity: 0.20, opacityLight: 0.12, duration: '21s', delay: '-6s',   rotate: -40 },
  { shape: 'chip',  top: '20%', left: '68%', size: 34, opacity: 0.22, opacityLight: 0.14, duration: '17s', delay: '-3s',   rotate: 20 },
  { shape: 'robotDanger',  top: '28%', left: '90%', size: 38, opacity: 0.15, opacityLight: 0.09, duration: '25s', delay: '-14s',  rotate: -10 },
  // Row 3 (~35-45%)
  { shape: 'robotLove',    top: '38%', left: '5%',  size: 42, opacity: 0.18, opacityLight: 0.11, duration: '23s', delay: '-7s',   rotate: -35 },
  { shape: 'arm',   top: '42%', left: '30%', size: 36, opacity: 0.22, opacityLight: 0.14, duration: '20s', delay: '-1s',   rotate: 30 },
  { shape: 'gear',  top: '36%', left: '55%', size: 20, opacity: 0.16, opacityLight: 0.10, duration: '27s', delay: '-9s',   rotate: 55 },
  { shape: 'chip',  top: '44%', left: '80%', size: 26, opacity: 0.20, opacityLight: 0.12, duration: '18s', delay: '-5s',   rotate: -50 },
  // Row 4 (~52-65%)
  { shape: 'chip',  top: '55%', left: '10%', size: 24, opacity: 0.18, opacityLight: 0.11, duration: '29s', delay: '-11s',  rotate: 5 },
  { shape: 'robotNeutral', top: '60%', left: '38%', size: 48, opacity: 0.22, opacityLight: 0.14, duration: '22s', delay: '-3s',   rotate: -20 },
  { shape: 'arm',   top: '52%', left: '65%', size: 38, opacity: 0.16, opacityLight: 0.10, duration: '26s', delay: '-8s',   rotate: 40 },
  { shape: 'gear',  top: '63%', left: '88%', size: 16, opacity: 0.20, opacityLight: 0.12, duration: '19s', delay: '-13s',  rotate: -55 },
  // Row 5 (bottom ~72-92%)
  { shape: 'gear',  top: '75%', left: '6%',  size: 16, opacity: 0.22, opacityLight: 0.14, duration: '24s', delay: '-6s',   rotate: 35 },
  { shape: 'chip',  top: '80%', left: '28%', size: 20, opacity: 0.16, opacityLight: 0.10, duration: '30s', delay: '-10s',  rotate: -45 },
  { shape: 'robotDanger',  top: '72%', left: '52%', size: 50, opacity: 0.18, opacityLight: 0.11, duration: '18s', delay: '-2s',   rotate: 15 },
  { shape: 'arm',   top: '88%', left: '78%', size: 44, opacity: 0.20, opacityLight: 0.12, duration: '21s', delay: '-9s',   rotate: -30 },
  // Extra robots
  { shape: 'robotNeutral', top: '15%', left: '50%', size: 40, opacity: 0.17, opacityLight: 0.10, duration: '23s', delay: '-5s',   rotate: 25 },
  { shape: 'robotLove',    top: '30%', left: '22%', size: 46, opacity: 0.19, opacityLight: 0.12, duration: '20s', delay: '-11s',  rotate: -18 },
  { shape: 'robot',        top: '48%', left: '75%', size: 42, opacity: 0.16, opacityLight: 0.10, duration: '27s', delay: '-7s',   rotate: 35 },
  { shape: 'robotDanger',  top: '68%', left: '18%', size: 44, opacity: 0.20, opacityLight: 0.13, duration: '19s', delay: '-3s',   rotate: -42 },
  { shape: 'robotNeutral', top: '82%', left: '65%', size: 38, opacity: 0.18, opacityLight: 0.11, duration: '25s', delay: '-10s',  rotate: 8 },
  { shape: 'robotLove',    top: '92%', left: '40%', size: 46, opacity: 0.15, opacityLight: 0.09, duration: '22s', delay: '-13s',  rotate: -28 },
];

function PartSvg({ shape }) {
  const accent = 'rgb(var(--c-accent))';

  switch (shape) {
    case 'chip':
      return (
        <>
          <rect x="6" y="6" width="12" height="12" rx="1" fill="none" stroke={accent} strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" />
          {[9, 12, 15].map((y) => (
            <g key={y}>
              <line x1="2" y1={y} x2="6" y2={y} stroke={accent} strokeWidth={1.5} strokeLinecap="round" />
              <line x1="18" y1={y} x2="22" y2={y} stroke={accent} strokeWidth={1.5} strokeLinecap="round" />
            </g>
          ))}
          {[9, 12, 15].map((x) => (
            <g key={`v${x}`}>
              <line x1={x} y1="2" x2={x} y2="6" stroke={accent} strokeWidth={1.5} strokeLinecap="round" />
              <line x1={x} y1="18" x2={x} y2="22" stroke={accent} strokeWidth={1.5} strokeLinecap="round" />
            </g>
          ))}
        </>
      );
    case 'gear':
      return (
        <g transform="translate(0,1280) scale(0.1,-0.1)">
          <path fill={accent} stroke="none" d="M6100 12794 c-399 -23 -950 -102 -1062 -152 -69 -31 -143 -105 -180 -180 l-33 -67 -5 -368 -5 -369 -170 -58 c-287 -98 -506 -189 -728 -303 l-118 -60 -252 250 c-300 298 -314 307 -467 308 -86 0 -101 -3 -160 -31 -110 -52 -431 -291 -670 -498 -211 -184 -532 -505 -716 -716 -206 -239 -445 -559 -498 -670 -28 -59 -31 -74 -30 -160 1 -156 8 -167 306 -467 l251 -252 -60 -118 c-114 -222 -205 -441 -303 -728 l-58 -170 -369 -5 -368 -5 -67 -33 c-75 -37 -149 -111 -180 -180 -37 -83 -102 -474 -135 -817 -24 -252 -24 -838 0 -1090 33 -343 98 -734 135 -817 31 -69 105 -143 180 -180 l67 -33 368 -5 369 -5 58 -170 c98 -287 189 -506 303 -728 l60 -118 -251 -252 c-298 -300 -305 -311 -306 -467 -1 -86 2 -101 30 -160 53 -111 292 -431 498 -670 184 -211 505 -532 716 -716 239 -207 560 -446 670 -498 59 -28 74 -31 160 -30 156 1 167 8 467 306 l252 251 118 -60 c222 -114 441 -205 728 -303 l170 -58 5 -369 5 -368 33 -67 c37 -75 111 -149 180 -180 83 -37 474 -102 817 -135 252 -24 838 -24 1090 0 343 33 734 98 817 135 69 31 143 105 180 180 l33 67 5 368 5 369 170 58 c287 98 506 189 728 303 l118 60 252 -250 c300 -298 314 -307 467 -308 86 0 101 3 160 31 110 52 431 291 670 498 211 184 532 505 716 716 206 239 445 559 498 670 28 59 31 74 30 160 -1 156 -8 167 -306 467 l-251 252 60 118 c114 222 205 441 303 728 l58 170 369 5 368 5 67 33 c75 37 149 111 180 180 37 83 102 474 135 817 24 252 24 838 0 1090 -33 343 -98 734 -135 817 -31 69 -105 143 -180 180 l-67 33 -368 5 -369 5 -58 170 c-98 287 -189 506 -303 728 l-60 118 251 252 c298 300 305 311 306 467 1 86 -2 101 -30 160 -53 111 -292 431 -498 670 -184 211 -505 532 -716 716 -239 207 -560 446 -670 498 -59 28 -74 31 -160 30 -156 -1 -167 -8 -467 -306 l-252 -251 -118 60 c-222 114 -441 205 -728 303 l-170 58 -5 369 -5 368 -33 67 c-37 75 -111 149 -180 180 -83 37 -480 103 -807 133 -161 15 -710 27 -855 19z m620 -3779 c474 -59 903 -235 1293 -532 131 -100 370 -339 470 -470 296 -389 473 -820 532 -1293 20 -162 20 -478 0 -640 -59 -473 -236 -904 -532 -1293 -100 -131 -339 -370 -470 -470 -390 -297 -819 -473 -1293 -532 -162 -20 -478 -20 -640 0 -474 59 -903 235 -1293 532 -131 100 -370 339 -470 470 -296 389 -473 820 -532 1293 -20 162 -20 478 0 640 59 473 236 904 532 1293 100 131 339 370 470 470 385 292 816 471 1281 531 150 19 498 20 652 1z" />
        </g>
      );
    case 'arm':
      return (
        <>
          <path fill="none" stroke={accent} strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m44.04 46.24 0.6839-0.4559a2.55 2.55 0 0 1 3.218 0.3187l1.65 1.65a2.55 2.55 0 0 1 0.1854 3.399l-0.8328 1.038a2.55 2.55 0 0 1-2.126 0.95l-1.501-0.08121a2.55 2.55 0 0 1-2.412-2.546v-2.151a2.55 2.55 0 0 1 1.135-2.122z" />
          <path fill="none" stroke={accent} strokeMiterlimit="10" strokeWidth="2" d="m23.59 46.21 0.7924-0.7046a2.55 2.55 0 0 1 1.694-0.6445h13.48a2.55 2.55 0 0 1 1.695 0.6445l0.7923 0.7046a2.55 2.55 0 0 1 0.8555 1.905v2.985a2.55 2.55 0 0 1-0.8555 1.905l-0.7923 0.7046a2.55 2.55 0 0 1-1.695 0.6445h-13.48a2.55 2.55 0 0 1-1.694-0.6445l-0.7924-0.7046a2.55 2.55 0 0 1-0.8554-1.905v-2.985a2.55 2.55 0 0 1 0.8551-1.905z" />
          <path fill="none" stroke={accent} strokeMiterlimit="10" strokeWidth="2" d="m49.86 48.06-2.37-2.37a2.55 2.55 0 0 1-0.7364-2.034l0.9638-10.6q0.01032-0.1132 0.03073-0.2253l1.951-10.73a2.55 2.55 0 0 1 1.094-1.665l4.443-2.962a2.55 2.55 0 0 1 2.419-0.2221l4.76 2.04a2.55 2.55 0 0 1 1.546 2.344v4.265a2.55 2.55 0 0 1-0.2246 1.046l-9.057 20.13a2.55 2.55 0 0 1-1.519 1.373l-0.6913 0.2304a2.55 2.55 0 0 1-2.609-0.6159z" />
          <path transform="translate(-8.565 -9.172) scale(1.275)" fill="none" stroke={accent} strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.569" d="m15.86 47.11h-1.54" />
          <path transform="translate(-8.565 -9.172) scale(1.275)" fill="none" stroke={accent} strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.569" d="m15.65 44.32-1.25 0.1" />
          <path transform="translate(-8.565 -9.172) scale(1.275)" fill="none" stroke={accent} strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.569" d="m20.65 50.15c0.3858-3.8e-5 0.7633-0.1117 1.087-0.3215l2.447-1.586v-3.53l-1.629-3.167c-0.1011-0.1966-0.1689-0.4086-0.2007-0.6273l-0.7261-4.998c-0.268-0.8935-1.974-0.9759-2.502-0.092-0.2689 1.154-0.3842 2.339-0.3429 3.523 0.03806 1.08-0.7724 2.001-1.848 2.102l-2.45 0.1825c-1.7 0.1012-1.778 2.576-0.0882 2.785-1.721 0.6565-1.495 2.417-0.0775 2.694-1.519 0.3195-1.474 2.498 0.05605 2.763l1.741 0.2732z" />
        </>
      );
    case 'robot':
      return (
        <>
          <path fill="none" stroke={accent} strokeWidth="16" strokeLinecap="round" strokeLinejoin="round" d="M113.897 247.861C112.001 139.239 95.2819 158.71 212.654 158.71C222.58 158.71 265.382 153.667 272.765 159.065C274.426 160.278 279.499 246.377 280.951 255.946" />
          <path fill="none" stroke={accent} strokeWidth="16" strokeLinecap="round" strokeLinejoin="round" d="M155.977 166.868C155.259 175.694 156.335 184.422 156.881 193.153C157.262 199.304 152.676 232.598 155.977 237.57C160.477 244.343 202.175 241.57 209.569 241.071C217.399 240.548 233.532 245.222 235.371 237.57C238.121 226.13 238.121 182.414 238.121 158.709" />
          <path fill="none" stroke={accent} strokeWidth="16" strokeLinecap="round" strokeLinejoin="round" d="M169.572 242.055C168.125 243.469 176.603 334.97 168.77 340.738C167.267 341.845 157.173 341.287 154.775 341.606" />
          <path fill="none" stroke={accent} strokeWidth="16" strokeLinecap="round" strokeLinejoin="round" d="M218.398 247.842C221.932 261.835 214.627 332.597 218.401 340.406C219.809 343.32 226.622 342.711 230.018 342.711" />
          <path fill="none" stroke={accent} strokeWidth="16" strokeLinecap="round" strokeLinejoin="round" d="M180.242 293.128C174.85 294.462 169.531 295.161 164.036 295.161" />
          <path fill="none" stroke={accent} strokeWidth="16" strokeLinecap="round" strokeLinejoin="round" d="M224.231 291.669C220.475 289.761 217.122 292.363 213.812 292.687" />
          <path fill="none" stroke={accent} strokeWidth="16" strokeLinecap="round" strokeLinejoin="round" d="M296 260.454C286.175 255.099 280.536 255.538 276.321 266.364" />
          <path fill="none" stroke={accent} strokeWidth="16" strokeLinecap="round" strokeLinejoin="round" d="M105 257.103C110.434 250.184 119.679 248.938 124.679 256.277" />
          <path fill="none" stroke={accent} strokeWidth="16" strokeLinecap="round" strokeLinejoin="round" d="M117.734 210.94C114.341 212.098 110.803 212.524 107.315 212.978" />
          <path fill="none" stroke={accent} strokeWidth="16" strokeLinecap="round" strokeLinejoin="round" d="M282.109 201.171C278.331 202.222 275.425 202.472 271.69 204.222" />
          <path fill="none" stroke={accent} strokeWidth="16" strokeLinecap="round" strokeLinejoin="round" d="M126.994 92.7273C122.75 92.7273 118.505 92.7273 114.261 92.7273" />
          <path fill="none" stroke={accent} strokeWidth="16" strokeLinecap="round" strokeLinejoin="round" d="M268.218 92.1292C271.569 90.5411 275.13 91.1106 278.636 91.1106" />
          <path fill="none" stroke={accent} strokeWidth="16" strokeLinecap="round" strokeLinejoin="round" d="M286.906 86.9395C280.674 104.342 287.768 82.5447 284.874 97.3576" />
          <path fill="none" stroke={accent} strokeWidth="16" strokeLinecap="round" strokeLinejoin="round" d="M113.104 86.9395C113.104 90.0263 113.104 93.1132 113.104 96.2001" />
          <path fill="none" stroke={accent} strokeWidth="16" strokeLinecap="round" strokeLinejoin="round" d="M188.346 84.6243C188.346 86.9381 188.346 89.2519 188.346 91.5697" />
          <path fill="none" stroke={accent} strokeWidth="12" strokeLinecap="round" strokeLinejoin="round" d="M189.705 187.994C228.381 167.563 215.772 236.849 185.233 214.352C178.105 209.101 182.617 199.687 185.233 193.265" />
          <path fill="none" stroke={accent} strokeWidth="16" strokeLinecap="round" strokeLinejoin="round" d="M137.146 71.7062C137.146 84.5561 127.962 115.098 136.241 128.978C137.097 130.408 227.652 131.702 237.478 131.702C240.475 131.702 255.542 134.443 257.364 132.612C260.513 129.445 257.803 111.344 258.268 107.16C264.92 46.9529 256.332 58.9802 186.858 58.9802C169.858 58.9802 152.887 59.3151 136.241 61.709" />
          <path fill="none" stroke={accent} strokeWidth="16" strokeLinecap="round" strokeLinejoin="round" d="M211.008 84.6243C210.193 86.4114 209.716 91.0525 209.67 91.5697" />
        </>
      );
    case 'robotDanger':
      return (
        <>
          <path fill="none" stroke={accent} strokeWidth="16" strokeLinecap="round" strokeLinejoin="round" d="M274.182 54.6046C273.578 54.3126 272.897 54.246 272.237 54.1153C271.794 54.0288 271.329 54 270.857 54C270.057 54 269.24 54.0847 268.482 54.1225C265.701 54.2541 262.926 54.4424 260.145 54.601C256.23 54.7136 252.313 54.6325 248.397 54.7172C243.844 54.8154 239.309 55.0686 234.766 55.3506C232.199 55.4263 229.631 55.4172 227.061 55.4497C224.084 55.4911 221.107 55.6605 218.13 55.8236C215.85 55.9047 213.581 55.9173 211.299 55.865C209.134 55.8155 206.968 55.7065 204.803 55.6749C200.098 55.6073 195.397 55.583 190.691 55.5055C185.853 55.4281 181.026 55.4776 176.184 55.5974C171.612 55.7137 167.035 55.8326 162.459 55.8119C160.342 55.8011 158.224 55.6569 156.107 55.5866C154.936 55.5479 153.769 55.5623 152.602 55.5794C151.78 55.5902 150.959 55.601 150.142 55.5902C149.008 55.5758 147.992 55.8011 147.098 56.5119C146.225 57.2021 145.669 58.2229 145.58 59.3032" />
          <path fill="none" stroke={accent} strokeWidth="16" strokeLinecap="round" strokeLinejoin="round" d="M277.556 148.131C277.89 147.423 278.138 146.728 278.157 145.994C278.178 145.398 278.083 144.707 277.957 144.098C277.796 143.286 275.909 66.3936 275.742 64.0228C275.629 62.4876 275.555 60.9556 275.253 59.4288C274.979 58.0506 274.578 56.6914 274.183 55.3258" />
          <path fill="none" stroke={accent} strokeWidth="16" strokeLinecap="round" strokeLinejoin="round" d="M148.232 56.6516C147.401 56.8254 146.65 57.3752 146.163 58.1649C145.634 59.0245 145.509 59.9795 145.614 61.0015C145.743 62.2295 145.82 63.4556 145.88 64.6884C145.994 71.0399 146.87 131.121 147.025 133.881C147.104 136.033 147.163 138.187 147.257 140.342C147.369 142.954 147.462 145.567 147.953 148.131" />
          <path fill="none" stroke={accent} strokeWidth="16" strokeLinecap="round" strokeLinejoin="round" d="M148.234 150.783C149.796 151.036 151.31 151.171 152.882 151.154C154.447 151.137 266.938 153.632 269.682 153.422C270.773 153.339 271.86 153.226 272.947 153.112C273.425 153.06 273.903 153.016 274.377 152.938C275.114 152.816 276.274 152.197 276.836 151.607" />
          <path fill="none" stroke={accent} strokeWidth="16" strokeLinecap="round" strokeLinejoin="round" d="M202.32 98.0262C201.964 94.527 202.509 90.3005 202.657 87.1448" />
          <path fill="none" stroke={accent} strokeWidth="16" strokeLinecap="round" strokeLinejoin="round" d="M225.787 98.0262C225.821 94.6313 225.851 91.2581 225.956 87.8701" />
          <path fill="none" stroke={accent} strokeWidth="16" strokeLinecap="round" strokeLinejoin="round" d="M214.789 129.026C214.822 125.631 214.853 122.258 214.958 118.87" />
          <path fill="none" stroke={accent} strokeWidth="16" strokeLinecap="round" strokeLinejoin="round" d="M318.449 133.488C318.619 131.409 301.372 189.823 300.2 189.215C299.817 189.016 269.561 175.227 250.997 175.787C226.624 176.523 193.135 177.66 167.741 178.531C147.102 179.239 119.768 189.215 119.062 189.215" />
          <path fill="none" stroke={accent} strokeWidth="16" strokeLinecap="round" strokeLinejoin="round" fillRule="evenodd" clipRule="evenodd" d="M115.082 188.988C115.736 191.587 80.8937 136.812 81.1666 139.275C81.2705 140.226 114.955 188.614 115.082 188.988Z" />
          <path fill="none" stroke={accent} strokeWidth="16" strokeLinecap="round" strokeLinejoin="round" d="M177.401 267.452C177.288 269.854 177.103 278.005 176.962 280.401C176.821 282.786 176.757 285.176 176.662 287.565C176.463 292.518 175.838 328.674 175.637 331.335C175.449 333.782 175.25 336.233 175.175 338.684C175.127 340.12 175.145 341.566 175.319 342.995C175.379 343.501 163.565 345.326 162.817 345.674" />
          <path fill="none" stroke={accent} strokeWidth="16" strokeLinecap="round" strokeLinejoin="round" d="M247.665 346.847C247.382 346.821 240.897 346.799 238.446 347C237.94 347.04 240.729 305.826 240.661 296.185C240.593 286.569 240.552 278.395 240.699 268.778" />
          <path fill="none" stroke={accent} strokeWidth="16" strokeLinecap="round" strokeLinejoin="round" d="M317.228 112.104C316.167 111.941 315.072 112.196 314.201 112.814C313.239 113.491 312.798 114.414 312.53 115.52C312.238 116.726 311.942 117.93 311.657 119.138C311.542 119.616 311.442 120.099 311.34 120.581C310.926 122.579 311.384 124.792 313.085 126.109C314.5 127.201 316.181 127.807 317.793 128.545C318.866 129.04 319.939 129.535 321.012 130.026C322.21 130.577 323.444 131.062 324.697 131.494C325.781 131.867 326.879 132.2 327.977 132.5C328.456 132.631 328.932 132.757 329.41 132.879C330.419 133.131 331.536 133.501 332.579 133.353C334.056 133.146 335.292 132.642 336.409 131.656C337.52 130.676 338.426 129.564 339.276 128.361C339.928 127.435 340.3 126.467 340.174 125.315C340.057 124.224 339.498 123.209 338.636 122.516" />
          <path fill="none" stroke={accent} strokeWidth="16" strokeLinecap="round" strokeLinejoin="round" d="M59.8524 129.382C59.0583 130.103 58.567 131.115 58.4989 132.18C58.4205 133.354 58.86 134.277 59.5509 135.182C60.3042 136.167 61.0543 137.154 61.814 138.136C62.1128 138.526 62.4251 138.908 62.7367 139.29C64.029 140.869 66.0373 141.906 68.1317 141.413C69.8707 141.002 71.3998 140.077 72.9876 139.288C74.0478 138.766 75.1079 138.244 76.1654 137.719C77.3472 137.135 78.5011 136.482 79.6254 135.779C80.598 135.172 81.5475 134.529 82.4723 133.864C82.8748 133.575 83.2729 133.283 83.6683 132.99C84.4999 132.364 85.4897 131.729 86.0321 130.825C86.8003 129.548 87.1861 128.27 87.1227 126.782C87.0601 125.302 86.766 123.898 86.3655 122.481C86.057 121.391 85.5383 120.493 84.5633 119.866C83.6417 119.271 82.501 119.066 81.4201 119.3" />
          <path fill="none" stroke={accent} strokeWidth="16" strokeLinecap="round" strokeLinejoin="round" d="M172.861 183.088C172.212 184.012 172.149 184.93 172.216 186.014C172.23 186.227 172.243 186.44 172.255 186.652C172.654 195.868 172.265 248.366 172.166 251.173C172.068 253.904 172.054 256.71 172.279 259.439C172.37 260.562 172.65 261.799 173.401 262.667C174.426 263.85 175.724 264.389 177.271 264.449C178.3 264.491 179.362 264.29 180.383 264.148C181.565 263.985 182.737 263.765 183.899 263.482C185.175 263.169 236.022 264.229 237.991 264.346C239.536 264.436 241.121 264.412 242.642 264.715L242.937 264.779C243.892 264.867 244.386 264.679 245.267 264.385C246.347 264.028 247.249 262.883 247.628 261.827C248.055 260.642 247.858 259.338 247.754 258.094C247.605 253.698 251.455 183.138 251.485 182.34C251.509 181.581 251.54 180.823 251.573 180.068C251.625 178.694 251.829 177.252 251.204 175.973" />
          <path fill="none" stroke={accent} strokeWidth="16" strokeLinecap="round" strokeLinejoin="round" d="M295.184 176.709C297.516 179.838 304.061 193.974 303.839 194.534" />
          <path fill="none" stroke={accent} strokeWidth="16" strokeLinecap="round" strokeLinejoin="round" d="M112.745 197.148C112.34 197.148 120.476 176.435 120.391 175.973" />
          <path fill="none" stroke={accent} strokeWidth="16" strokeLinecap="round" strokeLinejoin="round" d="M182.704 303.283C180.95 303.277 179.193 303.249 177.438 303.249C176.868 303.249 176.298 303.253 175.728 303.26C173.12 303.303 170.675 303.866 168.12 304.575" />
          <path fill="none" stroke={accent} strokeWidth="16" strokeLinecap="round" strokeLinejoin="round" d="M248.994 303.283C247.24 303.277 245.483 303.249 243.728 303.249C243.158 303.249 242.588 303.253 242.018 303.26C239.41 303.303 236.965 303.866 234.41 304.575" />
          <path fill="none" stroke={accent} strokeWidth="16" strokeLinecap="round" strokeLinejoin="round" d="M276.832 96.4253L290.381 97.7511L299.37 96.4253" />
          <path fill="none" stroke={accent} strokeWidth="16" strokeLinecap="round" strokeLinejoin="round" d="M138.953 95.7625H120.392" />
          <path fill="none" stroke={accent} strokeWidth="16" strokeLinecap="round" strokeLinejoin="round" d="M299.703 87.4895V103.782" />
          <path fill="none" stroke={accent} strokeWidth="16" strokeLinecap="round" strokeLinejoin="round" d="M119.572 87.4895V103.782" />
        </>
      );
    case 'robotLove':
      return (
        <>
          <path fill="none" stroke={accent} strokeWidth="16" strokeLinecap="round" strokeLinejoin="round" d="M268.515 54.6046C267.911 54.3126 267.23 54.246 266.57 54.1153C266.127 54.0288 265.662 54 265.19 54C264.39 54 263.573 54.0847 262.815 54.1225C260.034 54.2541 257.259 54.4424 254.478 54.601C250.563 54.7136 246.646 54.6325 242.73 54.7172C238.177 54.8154 233.642 55.0686 229.099 55.3506C226.532 55.4263 223.965 55.4172 221.394 55.4497C218.417 55.4911 215.44 55.6605 212.463 55.8236C210.183 55.9047 207.914 55.9173 205.632 55.865C203.467 55.8155 201.301 55.7065 199.136 55.6749C194.431 55.6073 189.73 55.583 185.024 55.5055C180.186 55.4281 175.359 55.4776 170.517 55.5974C165.945 55.7137 161.368 55.8326 156.792 55.8119C154.675 55.8011 152.557 55.6569 150.44 55.5866C149.269 55.5479 148.102 55.5623 146.935 55.5794C146.113 55.5902 145.292 55.601 144.475 55.5902C143.341 55.5758 142.325 55.8011 141.431 56.5119C140.558 57.2021 140.002 58.2229 139.913 59.3032" />
          <path fill="none" stroke={accent} strokeWidth="16" strokeLinecap="round" strokeLinejoin="round" d="M271.889 148.131C272.223 147.423 272.471 146.728 272.49 145.994C272.511 145.398 272.417 144.707 272.29 144.098C272.129 143.286 270.242 66.3936 270.075 64.0228C269.962 62.4876 269.888 60.9556 269.586 59.4288C269.312 58.0506 268.911 56.6914 268.516 55.3258" />
          <path fill="none" stroke={accent} strokeWidth="16" strokeLinecap="round" strokeLinejoin="round" d="M142.565 56.6516C141.734 56.8254 140.983 57.3752 140.496 58.1649C139.967 59.0245 139.842 59.9795 139.947 61.0015C140.076 62.2295 140.153 63.4556 140.213 64.6884C140.327 71.0399 141.203 131.121 141.358 133.881C141.437 136.033 141.496 138.187 141.59 140.342C141.702 142.954 141.795 145.567 142.286 148.131" />
          <path fill="none" stroke={accent} strokeWidth="16" strokeLinecap="round" strokeLinejoin="round" d="M142.562 150.783C144.124 151.036 145.638 151.171 147.21 151.154C148.775 151.137 261.266 153.632 264.01 153.422C265.101 153.339 266.188 153.226 267.275 153.112C267.753 153.06 268.231 153.016 268.705 152.938C269.442 152.816 270.602 152.197 271.164 151.607" />
          <path fill="none" stroke={accent} strokeWidth="16" strokeLinecap="round" strokeLinejoin="round" d="M196.653 98.0262C196.297 94.527 196.842 90.3005 196.99 87.1448" />
          <path fill="none" stroke={accent} strokeWidth="16" strokeLinecap="round" strokeLinejoin="round" d="M220.116 98.0262C220.15 94.6313 220.18 91.2581 220.285 87.8701" />
          <path fill="none" stroke={accent} strokeWidth="16" strokeLinecap="round" strokeLinejoin="round" d="M191.62 121.827C204.464 131.012 218.049 130.621 228.742 118.814" />
          <path fill="none" stroke={accent} strokeWidth="16" strokeLinecap="round" strokeLinejoin="round" d="M346.735 174.823C346.906 172.743 295.705 189.823 294.533 189.215C294.15 189.016 263.894 175.227 245.33 175.787C220.957 176.523 187.468 177.66 162.074 178.531C141.435 179.239 114.101 189.215 113.396 189.215" />
          <path fill="none" stroke={accent} strokeWidth="16" strokeLinecap="round" strokeLinejoin="round" fillRule="evenodd" clipRule="evenodd" d="M109.413 188.988C110.068 191.587 54.7896 172.403 55.0625 174.866C55.1664 175.817 109.286 188.614 109.413 188.988Z" />
          <path fill="none" stroke={accent} strokeWidth="16" strokeLinecap="round" strokeLinejoin="round" d="M171.734 267.452C171.621 269.854 171.436 278.005 171.295 280.401C171.154 282.786 171.09 285.176 170.995 287.565C170.796 292.518 170.171 328.674 169.97 331.335C169.782 333.782 169.583 336.233 169.508 338.684C169.46 340.12 169.478 341.566 169.652 342.995C169.712 343.501 157.898 345.326 157.15 345.674" />
          <path fill="none" stroke={accent} strokeWidth="16" strokeLinecap="round" strokeLinejoin="round" d="M241.998 346.847C241.715 346.821 235.23 346.799 232.779 347C232.273 347.04 235.062 305.826 234.994 296.185C234.926 286.569 234.885 278.395 235.032 268.778" />
          <path fill="none" stroke={accent} strokeWidth="16" strokeLinecap="round" strokeLinejoin="round" d="M362.021 164.677C361.757 163.638 361.094 162.729 360.185 162.168C359.186 161.548 358.164 161.503 357.041 161.688C355.817 161.89 354.593 162.088 353.37 162.298C352.885 162.379 352.401 162.475 351.917 162.57C349.916 162.97 348.058 164.256 347.511 166.337C347.058 168.065 347.157 169.849 347.108 171.621C347.072 172.803 347.035 173.984 347.002 175.164C346.963 176.481 346.999 177.807 347.091 179.129C347.171 180.273 347.294 181.413 347.447 182.542C347.513 183.033 347.583 183.521 347.657 184.008C347.82 185.036 347.916 186.208 348.459 187.112C349.227 188.39 350.174 189.33 351.518 189.973C352.854 190.613 354.232 191.012 355.672 191.325C356.779 191.564 357.815 191.528 358.826 190.961C359.785 190.427 360.501 189.516 360.801 188.452" />
          <path fill="none" stroke={accent} strokeWidth="16" strokeLinecap="round" strokeLinejoin="round" d="M36.6414 182.134C36.6271 183.206 37.0322 184.256 37.7647 185.032C38.5695 185.89 39.5442 186.198 40.6772 186.309C41.9117 186.431 43.1455 186.555 44.3814 186.669C44.8706 186.717 45.3629 186.749 45.855 186.782C47.8911 186.914 50.0192 186.152 51.0868 184.284C51.9718 182.731 52.3383 180.982 52.8444 179.283C53.1855 178.152 53.5267 177.02 53.8641 175.889C54.2431 174.626 54.5521 173.337 54.8052 172.036C55.024 170.91 55.2014 169.777 55.346 168.647C55.4088 168.156 55.4675 167.666 55.5223 167.176C55.6316 166.141 55.8426 164.985 55.5514 163.971C55.1411 162.538 54.4698 161.385 53.3382 160.416C52.2131 159.453 50.9859 158.71 49.6759 158.037C48.6687 157.519 47.6579 157.286 46.5348 157.572C45.4707 157.839 44.5432 158.534 43.9772 159.484" />
          <path fill="none" stroke={accent} strokeWidth="16" strokeLinecap="round" strokeLinejoin="round" d="M167.19 183.088C166.54 184.012 166.477 184.93 166.544 186.014C166.558 186.227 166.571 186.44 166.583 186.652C166.982 195.868 166.528 205.092 166.86 214.307C167.035 219.247 167.21 224.183 167.291 229.122C167.365 233.668 167.431 238.236 167.056 242.771C166.825 245.57 166.593 248.366 166.494 251.173C166.396 253.904 166.382 256.71 166.607 259.439C166.698 260.562 166.978 261.799 167.729 262.667C168.754 263.85 170.052 264.389 171.599 264.449C172.628 264.491 173.69 264.29 174.711 264.148C175.893 263.985 177.065 263.765 178.227 263.482C179.503 263.169 207.234 262.274 209.139 262.337C211.311 262.408 213.454 262.55 215.615 262.724C219.225 263.014 222.814 263.588 226.421 263.904C228.386 264.073 230.35 264.229 232.319 264.346C233.864 264.436 235.449 264.412 236.97 264.715L237.265 264.779C238.22 264.867 238.715 264.679 239.595 264.385C240.675 264.028 241.577 262.883 241.956 261.827C242.383 260.642 242.186 259.338 242.082 258.094C241.933 253.698 242.016 249.324 242.278 244.933C242.347 243.788 243.999 230.918 244.84 216.072C245.717 200.601 245.783 183.138 245.813 182.34C245.837 181.581 245.869 180.823 245.901 180.068C245.953 178.694 246.157 177.252 245.532 175.973" />
          <path fill="none" stroke={accent} strokeWidth="16" strokeLinecap="round" strokeLinejoin="round" d="M201.994 238.437C192.449 230.705 176.125 210.992 188.117 199.493C190.679 197.036 193.997 195.462 197.708 195.971C201.454 196.484 204.074 200.765 204.851 203.995C204.965 204.467 205.801 211.04 206.076 211.04C206.483 211.04 206.076 210.257 206.076 209.865C206.076 208.493 206.327 207.302 206.483 205.951C206.886 202.479 209.401 199.097 212.606 197.341C220.532 192.998 226.613 198.852 227.504 206.538C229.414 223.023 209.866 231.222 208.116 239.611" />
          <path fill="none" stroke={accent} strokeWidth="16" strokeLinecap="round" strokeLinejoin="round" d="M291.748 183.081C291.6 183.413 291.472 183.757 291.367 184.113C290.411 187.331 289.429 190.542 288.258 193.693L288.174 193.898C287.954 194.454 287.738 195.012 287.515 195.572" />
          <path fill="none" stroke={accent} strokeWidth="16" strokeLinecap="round" strokeLinejoin="round" d="M109.42 194.534C109.015 194.534 107.1 180.642 107.015 180.18C106.958 179.872 106.876 179.874 106.769 180.185" />
          <path fill="none" stroke={accent} strokeWidth="16" strokeLinecap="round" strokeLinejoin="round" d="M177.037 303.283C175.283 303.277 173.526 303.249 171.771 303.249C171.201 303.249 170.631 303.253 170.061 303.26C167.453 303.303 165.008 303.866 162.453 304.575" />
          <path fill="none" stroke={accent} strokeWidth="16" strokeLinecap="round" strokeLinejoin="round" d="M243.323 303.283C241.569 303.277 239.812 303.249 238.057 303.249C237.487 303.249 236.917 303.253 236.347 303.26C233.739 303.303 231.294 303.866 228.739 304.575" />
          <path fill="none" stroke={accent} strokeWidth="16" strokeLinecap="round" strokeLinejoin="round" d="M271.165 96.4253L284.714 97.7511L293.703 96.4253" />
          <path fill="none" stroke={accent} strokeWidth="16" strokeLinecap="round" strokeLinejoin="round" d="M133.286 95.7625H114.725" />
          <path fill="none" stroke={accent} strokeWidth="16" strokeLinecap="round" strokeLinejoin="round" d="M294.036 87.4895V103.782" />
          <path fill="none" stroke={accent} strokeWidth="16" strokeLinecap="round" strokeLinejoin="round" d="M113.905 87.4895V103.782" />
        </>
      );
    case 'robotNeutral':
      return (
        <>
          <path fill="none" stroke={accent} strokeWidth="16" strokeLinecap="round" strokeLinejoin="round" d="M266.43 53.6046C265.826 53.3126 265.145 53.246 264.485 53.1153C264.042 53.0288 263.577 53 263.105 53C262.305 53 261.488 53.0847 260.73 53.1225C257.949 53.2541 255.174 53.4424 252.393 53.601C248.478 53.7136 244.561 53.6325 240.645 53.7172C236.092 53.8154 231.557 54.0686 227.014 54.3506C224.447 54.4263 221.88 54.4172 219.309 54.4497C216.332 54.4911 213.355 54.6605 210.378 54.8236C208.098 54.9047 205.829 54.9173 203.547 54.865C201.382 54.8155 199.216 54.7065 197.051 54.6749C192.346 54.6073 187.645 54.583 182.939 54.5055C178.101 54.4281 173.274 54.4776 168.432 54.5974C163.86 54.7137 159.283 54.8326 154.707 54.8119C152.59 54.8011 150.472 54.6569 148.355 54.5866C147.184 54.5479 146.017 54.5623 144.85 54.5794C144.028 54.5902 143.207 54.601 142.39 54.5902C141.256 54.5758 140.24 54.8011 139.346 55.5119C138.473 56.2021 137.917 57.2229 137.828 58.3032" />
          <path fill="none" stroke={accent} strokeWidth="16" strokeLinecap="round" strokeLinejoin="round" d="M269.804 147.131C270.138 146.423 270.386 145.728 270.405 144.994C270.426 144.398 270.332 143.707 270.205 143.098C270.044 142.286 268.158 65.3936 267.99 63.0228C267.877 61.4876 267.803 59.9556 267.501 58.4288C267.227 57.0506 266.826 55.6914 266.431 54.3258" />
          <path fill="none" stroke={accent} strokeWidth="16" strokeLinecap="round" strokeLinejoin="round" d="M140.48 55.6516C139.649 55.8254 138.898 56.3752 138.411 57.1649C137.882 58.0245 137.757 58.9795 137.862 60.0015C137.991 61.2295 138.068 62.4556 138.128 63.6884C138.242 70.0399 139.118 130.121 139.273 132.881C139.352 135.033 139.411 137.187 139.505 139.342C139.617 141.954 139.71 144.567 140.201 147.131" />
          <path fill="none" stroke={accent} strokeWidth="16" strokeLinecap="round" strokeLinejoin="round" d="M140.478 149.783C142.039 150.036 143.553 150.171 145.125 150.154C146.69 150.137 259.181 152.632 261.925 152.422C263.016 152.339 264.103 152.226 265.19 152.112C265.668 152.06 266.146 152.016 266.62 151.938C267.357 151.816 268.517 151.197 269.079 150.607" />
          <path fill="none" stroke={accent} strokeWidth="16" strokeLinecap="round" strokeLinejoin="round" d="M194.567 97.0262C194.211 93.527 194.756 89.3005 194.904 86.1448" />
          <path fill="none" stroke={accent} strokeWidth="16" strokeLinecap="round" strokeLinejoin="round" d="M218.03 97.0262C218.064 93.6313 218.094 90.2581 218.199 86.8701" />
          <path fill="none" stroke={accent} strokeWidth="16" strokeLinecap="round" strokeLinejoin="round" d="M278.045 263.801C278.217 261.721 293.122 200.108 291.95 199.5C291.567 199.301 261.809 174.227 243.245 174.787C218.872 175.523 185.383 176.66 159.989 177.531C139.35 178.239 108.037 213.019 107.332 213.019" />
          <path fill="none" stroke={accent} strokeWidth="16" strokeLinecap="round" strokeLinejoin="round" fillRule="evenodd" clipRule="evenodd" d="M107.333 213.021C107.988 215.621 116.719 257.102 116.992 259.566C117.096 260.517 107.206 212.647 107.333 213.021Z" />
          <path fill="none" stroke={accent} strokeWidth="16" strokeLinecap="round" strokeLinejoin="round" d="M169.644 266.452C169.531 268.854 169.347 277.005 169.205 279.401C169.064 281.786 169 284.176 168.905 286.565C168.707 291.518 168.082 327.674 167.88 330.335C167.692 332.782 167.494 335.233 167.418 337.684C167.371 339.12 167.388 340.566 167.562 341.995C167.622 342.501 155.809 344.326 155.061 344.674" />
          <path fill="none" stroke={accent} strokeWidth="16" strokeLinecap="round" strokeLinejoin="round" d="M239.912 345.847C239.629 345.821 233.144 345.799 230.693 346C230.187 346.04 232.976 304.826 232.908 295.185C232.841 285.569 232.799 277.395 232.946 267.778" />
          <path fill="none" stroke={accent} strokeWidth="16" strokeLinecap="round" strokeLinejoin="round" d="M282.835 281.842C283.902 281.949 284.983 281.637 285.821 280.975C286.745 280.248 287.137 279.304 287.348 278.185C287.576 276.966 287.808 275.747 288.03 274.526C288.12 274.043 288.195 273.555 288.27 273.068C288.579 271.051 288.007 268.865 286.239 267.639C284.769 266.623 283.059 266.105 281.41 265.453C280.313 265.015 279.215 264.577 278.118 264.142C276.893 263.655 275.635 263.235 274.361 262.87C273.259 262.554 272.145 262.279 271.033 262.036C270.548 261.931 270.065 261.83 269.583 261.733C268.561 261.534 267.427 261.223 266.392 261.425C264.929 261.709 263.721 262.277 262.657 263.32C261.599 264.357 260.752 265.515 259.966 266.762C259.363 267.72 259.042 268.707 259.229 269.85C259.403 270.933 260.014 271.918 260.911 272.564" />
          <path fill="none" stroke={accent} strokeWidth="16" strokeLinecap="round" strokeLinejoin="round" d="M130.999 275.361C131.944 274.854 132.665 273.991 132.989 272.974C133.349 271.854 133.146 270.852 132.694 269.807C132.202 268.669 131.713 267.529 131.213 266.393C131.018 265.942 130.807 265.496 130.597 265.049C129.725 263.205 128.028 261.713 125.876 261.685C124.089 261.663 122.382 262.191 120.65 262.572C119.495 262.822 118.34 263.072 117.187 263.325C115.899 263.606 114.622 263.961 113.361 264.371C112.27 264.725 111.193 265.119 110.135 265.54C109.675 265.724 109.218 265.91 108.763 266.099C107.805 266.505 106.691 266.882 105.946 267.628C104.892 268.681 104.208 269.827 103.91 271.287C103.612 272.738 103.558 274.171 103.604 275.644C103.64 276.775 103.925 277.773 104.72 278.616C105.47 279.417 106.527 279.892 107.633 279.926" />
          <path fill="none" stroke={accent} strokeWidth="16" strokeLinecap="round" strokeLinejoin="round" d="M165.105 182.088C164.455 183.012 164.392 183.93 164.459 185.014C164.473 185.227 164.486 185.44 164.498 185.652C164.897 194.868 164.443 204.092 164.775 213.307C164.95 218.247 165.125 223.183 165.206 228.122C165.28 232.668 165.346 237.236 164.971 241.771C164.74 244.57 164.508 247.366 164.409 250.173C164.312 252.904 164.297 255.71 164.522 258.439C164.613 259.562 164.894 260.799 165.644 261.667C166.669 262.85 167.967 263.389 169.514 263.449C170.543 263.491 171.605 263.29 172.626 263.148C173.808 262.985 174.981 262.765 176.142 262.482C177.418 262.169 205.149 261.274 207.054 261.337C209.226 261.408 211.369 261.55 213.53 261.724C217.14 262.014 220.729 262.588 224.336 262.904C226.301 263.073 228.265 263.229 230.234 263.346C231.779 263.436 233.364 263.412 234.885 263.715L235.18 263.779C236.135 263.867 236.63 263.679 237.51 263.385C238.59 263.028 239.492 261.883 239.871 260.827C240.298 259.642 240.101 258.338 239.997 257.094C239.849 252.698 239.931 248.324 240.193 243.933C240.262 242.788 241.914 229.918 242.755 215.072C243.632 199.601 243.699 182.138 243.728 181.34C243.752 180.581 243.784 179.823 243.816 179.068C243.868 177.694 244.072 176.252 243.447 174.973" />
          <path fill="none" stroke={accent} strokeWidth="16" strokeLinecap="round" strokeLinejoin="round" d="M283.949 205.391C286.282 208.52 299.662 197.539 299.439 198.099" />
          <path fill="none" stroke={accent} strokeWidth="16" strokeLinecap="round" strokeLinejoin="round" d="M116.995 215.722C116.725 215.722 111.393 213.844 101 210.089" />
          <path fill="none" stroke={accent} strokeWidth="16" strokeLinecap="round" strokeLinejoin="round" d="M174.947 302.283C173.193 302.277 171.436 302.249 169.681 302.249C169.111 302.249 168.541 302.253 167.971 302.26C165.363 302.303 162.918 302.866 160.363 303.575" />
          <path fill="none" stroke={accent} strokeWidth="16" strokeLinecap="round" strokeLinejoin="round" d="M241.237 302.283C239.483 302.277 237.726 302.249 235.971 302.249C235.401 302.249 234.831 302.253 234.261 302.26C231.653 302.303 229.208 302.866 226.653 303.575" />
          <path fill="none" stroke={accent} strokeWidth="16" strokeLinecap="round" strokeLinejoin="round" d="M269.08 95.4253L282.629 96.7511L291.619 95.4253" />
          <path fill="none" stroke={accent} strokeWidth="16" strokeLinecap="round" strokeLinejoin="round" d="M131.2 94.7625H112.639" />
          <path fill="none" stroke={accent} strokeWidth="16" strokeLinecap="round" strokeLinejoin="round" d="M291.95 86.4895V102.782" />
          <path fill="none" stroke={accent} strokeWidth="16" strokeLinecap="round" strokeLinejoin="round" d="M111.824 86.4895V102.782" />
        </>
      );
    default:
      return null;
  }
}

function FloatingParts() {
  return (
    <div className="absolute inset-0 overflow-hidden" aria-hidden="true">
      {floatingParts.map((part, i) => (
        <svg
          key={i}
          className="floating-part"
          width={part.size}
          height={part.size}
          viewBox={SHAPE_VIEWBOX[part.shape]}
          style={{
            top: part.top,
            left: part.left,
            '--float-duration': part.duration,
            '--float-delay': part.delay,
            '--float-opacity': part.opacity,
            '--float-opacity-light': part.opacityLight,
            '--float-rotate': `${part.rotate}deg`,
          }}
        >
          <PartSvg shape={part.shape} />
        </svg>
      ))}
    </div>
  );
}

function RobotIcon() {
  return (
    <svg
      className="hero-robot"
      width="32"
      height="32"
      viewBox="0 0 32 32"
      fill="none"
      overflow="visible"
      aria-hidden="true"
    >
      {/* Antenna stem — y2 animates to follow the circle */}
      <line
        x1="16" y1="8" x2="16" y2="5"
        stroke="rgb(var(--c-accent))"
        strokeWidth="1.5"
        strokeLinecap="round"
      >
        <animate
          attributeName="y2"
          values="5;3;5"
          dur="2s"
          repeatCount="indefinite"
          calcMode="spline"
          keyTimes="0;0.5;1"
          keySplines="0.42 0 0.58 1;0.42 0 0.58 1"
        />
      </line>
      {/* Antenna tip */}
      <circle
        cx="16" cy="3"
        r="2"
        stroke="rgb(var(--c-accent))"
        strokeWidth="1.5"
        fill="none"
      >
        <animate
          attributeName="cy"
          values="3;1;3"
          dur="2s"
          repeatCount="indefinite"
          calcMode="spline"
          keyTimes="0;0.5;1"
          keySplines="0.42 0 0.58 1;0.42 0 0.58 1"
        />
      </circle>
      {/* Head */}
      <rect
        x="7" y="8" width="18" height="14" rx="2"
        stroke="rgb(var(--c-accent))"
        strokeWidth="1.5"
        fill="none"
      />
      {/* Left eye */}
      <rect
        x="11" y="13" width="3" height="3" rx="0.5"
        fill="rgb(var(--c-accent))"
      >
        <animate attributeName="height" values="3;3;0.5;3;3" keyTimes="0;0.42;0.45;0.48;1" dur="3s" repeatCount="indefinite" />
        <animate attributeName="y" values="13;13;14.25;13;13" keyTimes="0;0.42;0.45;0.48;1" dur="3s" repeatCount="indefinite" />
      </rect>
      {/* Right eye */}
      <rect
        x="18" y="13" width="3" height="3" rx="0.5"
        fill="rgb(var(--c-accent))"
      >
        <animate attributeName="height" values="3;3;0.5;3;3" keyTimes="0;0.42;0.45;0.48;1" dur="3s" repeatCount="indefinite" />
        <animate attributeName="y" values="13;13;14.25;13;13" keyTimes="0;0.42;0.45;0.48;1" dur="3s" repeatCount="indefinite" />
      </rect>
      {/* Mouth */}
      <line
        x1="12" y1="19" x2="20" y2="19"
        stroke="rgb(var(--c-accent))"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
      {/* Left ear */}
      <line
        x1="7" y1="12" x2="4" y2="12"
        stroke="rgb(var(--c-accent))"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
      {/* Right ear */}
      <line
        x1="25" y1="12" x2="28" y2="12"
        stroke="rgb(var(--c-accent))"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
      {/* Body */}
      <rect
        x="10" y="23" width="12" height="6" rx="1.5"
        stroke="rgb(var(--c-accent))"
        strokeWidth="1.5"
        fill="none"
      />
    </svg>
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

      <div className="fixed inset-0 z-0 pointer-events-none">
        <FloatingParts />
      </div>

      <header className="sticky top-0 z-50 border-b border-line/55 bg-panel/95 backdrop-blur-md">
        <div className="mx-auto flex h-12 w-full max-w-6xl items-center justify-between px-6 md:px-10">
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

      <main id="top" className="mx-auto w-full max-w-6xl px-6 pb-20 pt-6 md:px-10 md:pt-8">
        <section className="mb-10 grid min-h-[calc(100vh-8rem)] content-center items-end gap-10 md:mb-12 md:gap-x-14 md:gap-y-6 md:grid-cols-[1.2fr_0.8fr]">
          <motion.div className="order-2 mt-6 space-y-7 md:order-1 md:mt-10" initial="hidden" animate="show" variants={{ show: { transition: { staggerChildren: 0.12 } } }}>
            <motion.div variants={itemAnim}>
              <h1 className="font-serif text-4xl leading-[1.08] text-ink md:text-6xl">{profile.name}</h1>
              <p className="mt-2 font-sans text-xl text-muted/80 md:text-2xl">{profile.nameZh}</p>
            </motion.div>
            <motion.p variants={itemAnim} className="md:max-w-xl text-[16.5px] leading-8 text-muted/85">
              {personalIntro.bio.beforeLab}
              <a href={personalIntro.bio.labUrl} className="theme-link" rel="external nofollow noopener" target="_blank">
                {personalIntro.bio.labName}
              </a>
              {personalIntro.bio.afterLab}
              <a href={personalIntro.bio.advisorUrl} className="theme-link" rel="external nofollow noopener" target="_blank">
                {personalIntro.bio.advisorName}
              </a>
              {personalIntro.bio.afterAdvisor}
              <a href={personalIntro.bio.undergradUrl} className="theme-link" rel="external nofollow noopener" target="_blank">
                {personalIntro.bio.undergradName}
              </a>
              {personalIntro.bio.afterUndergrad}
              <a href={personalIntro.bio.exchangeUrl} className="theme-link" rel="external nofollow noopener" target="_blank">
                {personalIntro.bio.exchangeName}
              </a>
              {personalIntro.bio.afterExchange}
            </motion.p>
            <motion.p variants={itemAnim} className="md:max-w-xl text-[16.5px] leading-8 text-muted/85">
              {personalIntro.research.text}
            </motion.p>
          </motion.div>

          <motion.div
            className="order-3 space-y-5 md:col-span-2"
            initial="hidden"
            animate="show"
            variants={{ show: { transition: { staggerChildren: 0.12, delayChildren: 0.24 } } }}
          >
            <motion.p variants={itemAnim} className="text-base text-muted/80">
              {personalIntro.cv.lead}
              <a href={links.cv} className="font-semibold text-accent/95 hover:text-ink">
                {personalIntro.cv.label}
              </a>
              {personalIntro.cv.tail}
            </motion.p>
            <motion.p variants={itemAnim} className="text-base text-muted/80">
              {personalIntro.contact.lead}
              <a href={`mailto:${links.email}`} className="font-semibold text-accent/95 hover:text-ink">
                {personalIntro.contact.linkLabel}
              </a>
              {personalIntro.contact.tail}
            </motion.p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.96, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1], delay: 0.15 }}
            className="order-1 mt-6 justify-self-center self-start md:order-2 md:mt-10 md:justify-self-end"
          >
            <div className="relative w-[80vw] max-w-[360px] md:w-[280px]">
              <div className="dot-shadow absolute -bottom-5 -right-5 h-full w-full rounded-2xl" />
              <div className="relative aspect-[4/5] overflow-hidden rounded-2xl border border-line/45 bg-panel">
                <img src={links.profileImage} alt={profile.name} className="h-full w-full object-cover" />
              </div>
            </div>
          </motion.div>

          <motion.div
            className="order-4 mt-10 md:col-span-2 md:mt-16"
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
                <article
                  className="group rounded-2xl border border-line/45 bg-panelSoft p-6 transition hover:border-accent/45 hover:bg-panelSoft"
                >
                  <div className="flex flex-col gap-5 md:flex-row">
                    {pub.preview && (
                      <div className="flex-shrink-0 self-center overflow-hidden rounded-lg md:w-[200px]">
                        {pub.preview.type === 'video' ? (
                          <video
                            src={pub.preview.src}
                            autoPlay
                            loop
                            muted
                            playsInline
                            className="w-full object-contain"
                          />
                        ) : (
                          <img
                            src={pub.preview.src}
                            alt={`${pub.title} preview`}
                            className="w-full object-contain"
                          />
                        )}
                      </div>
                    )}
                    <div className="min-w-0 flex-1">
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
                    </div>
                  </div>
                </article>
              </DotCard>
            ))}
          </div>
        </section>

        <section id="about" className="mb-24 space-y-8">
          <SectionTitle title="Experience & Service" />
          <div className="grid gap-10 md:grid-cols-2 md:gap-16">
          <div className="space-y-6">
            <p className="font-mono text-[11px] uppercase tracking-[0.12em] text-muted/42">// EXPERIENCE</p>
            <div className="space-y-6">
              {experienceService.educationExperience.map((item) => (
                <DotCard key={item.place}>
                  <div className="rounded-xl border border-line/45 bg-panel px-4 py-4">
                    <p className="font-medium text-ink">
                      {item.placeUrl ? (
                        <a href={item.placeUrl} className="theme-link" rel="external nofollow noopener" target="_blank">{item.place}</a>
                      ) : item.place}
                    </p>
                    <p className="mt-1 text-sm text-muted/75">
                      {item.role}{item.lab && <>, <a href={item.labUrl} className="theme-link" rel="external nofollow noopener" target="_blank">{item.lab}</a></>}
                    </p>
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
                    Journals: {experienceService.service.reviewerJournals.map((venue, idx) => (
                      <span key={venue.label}>
                        <a href={venue.url} className="theme-link" rel="external nofollow noopener" target="_blank">
                          {venue.label}
                        </a>
                        {idx < experienceService.service.reviewerJournals.length - 1 ? ', ' : ''}
                      </span>
                    ))}
                  </p>
                  <p className="mt-1 text-sm leading-8 text-muted/82">
                    Conferences: {experienceService.service.reviewerConferences.map((venue, idx) => (
                      <span key={venue.label}>
                        <a href={venue.url} className="theme-link" rel="external nofollow noopener" target="_blank">
                          {venue.label}
                        </a>
                        {idx < experienceService.service.reviewerConferences.length - 1 ? ', ' : ''}
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
        <div className="mx-auto flex w-full max-w-6xl items-center justify-center px-6 py-8 md:px-10">
          <span className="font-serif text-sm tracking-[0.04em] text-muted/45">© 2023-2026 Zizhe Zhang</span>
        </div>
      </footer>
    </div>
  );
}
