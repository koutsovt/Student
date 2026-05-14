import puppeteer from 'puppeteer-core';
import { mkdir } from 'node:fs/promises';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const HERE = dirname(fileURLToPath(import.meta.url));
const OUT_DIR = resolve(HERE, '..', 'docs', 'screenshots');
const URL = process.env.PROTOTYPE_URL ?? 'http://localhost:5173/';
const CHROME = process.env.CHROME_PATH ?? '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome';

const VIEWPORT = { width: 1280, height: 900 };
const SHORT_MS = 600;
const POLL_MS = 200;
const WAIT_TIMEOUT_MS = 12000;
const POST_CLICK_MS = 600;
const FINAL_SETTLE_MS = 1600;

const scenarios = [
  {
    file: '01-aisha-inform-and-act-ssaf',
    persona: 'Aisha',
    title: 'Ask "What is SSAF?"',
    path: ['Understand what it pays for'],
  },
  {
    file: '02-aisha-express-not-coping',
    persona: 'Aisha',
    title: '"I\'m not coping"',
    path: ["Just send me what's available", "No, that's enough for now"],
  },
  {
    file: '03-aisha-nudge-ssaf-deadline',
    persona: 'Aisha',
    title: 'SSAF deadline nudge',
    proactive: true,
    cta: 'Open in chat',
    path: ['Not right now'],
  },
  {
    file: '04-aisha-decide-ssaf-defer',
    persona: 'Aisha',
    title: 'Defer SSAF',
    path: ["Yes, let's do it"],
  },
  {
    file: '05-mark-check-in-lms-dropoff',
    persona: 'Mark',
    title: 'LMS engagement check-in',
    proactive: true,
    cta: 'Reply in chat',
    path: ['Just busy with work', 'Leave it for now'],
  },
  {
    file: '06-mark-inform-and-act-extension',
    persona: 'Mark',
    title: '"Can I get an extension?"',
    path: ['I just need a few more days'],
  },
  {
    file: '07-mark-status-check-results',
    persona: 'Mark',
    title: '"When do I get my results?"',
    path: ["No, that's all I needed"],
  },
  {
    file: '08-mark-express-failed-anatomy',
    persona: 'Mark',
    title: '"I just failed Anatomy"',
    path: ["I'm okay — just frustrated", 'Hold off for tonight'],
  },
  {
    file: '09-jess-nudge-census-date',
    persona: 'Jess',
    title: 'Census-date nudge',
    proactive: true,
    cta: 'Review enrolment',
    path: ["I've been thinking about dropping one"],
  },
  {
    file: '10-jess-status-check-transfer',
    persona: 'Jess',
    title: 'Course transfer status',
    path: ["No, that's all — thanks"],
  },
  {
    file: '11-jess-check-in-sanction-recovery',
    persona: 'Jess',
    title: 'Sanction-recovery check-in',
    proactive: true,
    cta: 'Sort it in chat',
    path: ['Pay it now'],
  },
];

const bonus = {
  file: '12-express-handoff-held-state',
  persona: 'Aisha',
  title: '"I\'m not coping"',
  path: ["I'd like to talk to someone now"],
};

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

async function findButton(page, text, scopeSelector = 'body') {
  return page.evaluate(({ text, scopeSelector }) => {
    const scope = document.querySelector(scopeSelector);
    if (!scope) return false;
    const buttons = Array.from(scope.querySelectorAll('button'));
    return buttons.some((b) => {
      const t = (b.textContent ?? '').replace(/\s+/g, ' ').trim();
      return t === text || t.includes(text);
    });
  }, { text, scopeSelector });
}

async function waitForButton(page, text, scopeSelector = 'body') {
  const deadline = Date.now() + WAIT_TIMEOUT_MS;
  while (Date.now() < deadline) {
    if (await findButton(page, text, scopeSelector)) return;
    await sleep(POLL_MS);
  }
  throw new Error(`timed out waiting for button: ${text} (in ${scopeSelector})`);
}

async function clickByText(page, text, scopeSelector = 'body') {
  await waitForButton(page, text, scopeSelector);
  await page.evaluate(({ text, scopeSelector }) => {
    const scope = document.querySelector(scopeSelector);
    const buttons = Array.from(scope.querySelectorAll('button'));
    const target = buttons.find((b) => {
      const t = (b.textContent ?? '').replace(/\s+/g, ' ').trim();
      return t === text || t.includes(text);
    });
    target.scrollIntoView({ block: 'center' });
    target.click();
  }, { text, scopeSelector });
  await sleep(POST_CLICK_MS);
}

async function setPersona(page, name) {
  await clickByText(page, name, 'aside');
  await sleep(SHORT_MS);
}

async function pickScenario(page, title) {
  await clickByText(page, title, 'aside');
}

async function shot(page, name) {
  const path = resolve(OUT_DIR, `${name}.png`);
  await sleep(FINAL_SETTLE_MS);
  await page.screenshot({ path, fullPage: false });
  console.log(`  wrote ${path}`);
}

async function runScenario(page, sc) {
  console.log(`\n[${sc.file}] ${sc.persona} · ${sc.title}`);
  await setPersona(page, sc.persona);
  await pickScenario(page, sc.title);

  if (sc.proactive) {
    const cta = sc.cta ?? 'Open in chat';
    await waitForButton(page, cta);
    await shot(page, `${sc.file}-inbox`);
    await clickByText(page, cta);
  }

  for (const choice of sc.path ?? []) {
    await clickByText(page, choice);
  }

  await shot(page, sc.file);
}

async function main() {
  await mkdir(OUT_DIR, { recursive: true });

  const browser = await puppeteer.launch({
    executablePath: CHROME,
    headless: 'new',
    defaultViewport: VIEWPORT,
    args: ['--no-sandbox', '--disable-dev-shm-usage'],
  });
  const page = await browser.newPage();
  await page.setViewport(VIEWPORT);
  await page.goto(URL, { waitUntil: 'domcontentloaded' });

  // Landing page
  await page.evaluate(() => { try { localStorage.clear(); sessionStorage.clear(); } catch {} });
  await page.goto(URL, { waitUntil: 'domcontentloaded' });
  await sleep(SHORT_MS);
  await shot(page, '00-landing');

  // Enter app
  await clickByText(page, 'Open the demo');
  await page.waitForSelector('aside', { timeout: 8000 });

  for (const sc of scenarios) {
    try {
      await runScenario(page, sc);
    } catch (err) {
      console.error(`  FAILED ${sc.file}: ${err.message}`);
    }
  }

  try {
    await runScenario(page, bonus);
  } catch (err) {
    console.error(`  FAILED ${bonus.file}: ${err.message}`);
  }

  await browser.close();
  console.log(`\nDone. Output: ${OUT_DIR}`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
