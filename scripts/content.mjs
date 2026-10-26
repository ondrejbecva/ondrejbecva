// Everything the profile says, in both languages. Facts come from ondrejbecva.cz (its bio, experience, services, way of
// working and tech stack as of 2026-10-26); nothing here should claim more than the site does.

export const LANGUAGES = ['en', 'cs']

export const TEXT = {
  en: {
    role: 'Full-stack developer & tech lead',
    place: 'Břeclav, Czechia',
    label: 'Websites · e-shops · apps · AI automation · CRM',
    prompt: 'ondrej --whoami',
    whoami: [
      'Full-stack developer and tech lead from Břeclav. Freelancing since 2020.',
      'Websites, e-shops, custom apps, CRM and AI automation, built to the brief.',
      'One accountable person from the first call to launch. No hand-offs.',
      'AI is part of my toolkit, not a sales slogan. It shortens the routine.',
    ],
    services: [
      { icon: 'Code2', title: 'Custom websites', text: 'Fast, clear sites built to the brief, not a template you work around.' },
      { icon: 'ShoppingBag', title: 'E-shops', text: 'Shops wired to how you really run: stock, invoicing, carriers. Custom or on Upgates.' },
      { icon: 'Boxes', title: 'Custom apps', text: 'Internal tools where a spreadsheet or boxed software no longer fits.' },
      { icon: 'Workflow', title: 'AI & automation', text: 'Repetitive work automated, measured first. AI only where it saves time.' },
      { icon: 'Contact', title: 'CRM', text: 'Customer and sales records that follow how the company really works.' },
      { icon: 'LayoutTemplate', title: 'WordPress', text: 'Custom themes and plugins, care and maintenance.' },
    ],
    groups: { Frontend: 'Frontend', 'Backend a CMS': 'Backend & CMS', 'Databáze': 'Databases', 'Nástroje a provoz': 'Tools & ops', 'Testování': 'Testing', AI: 'AI' },
    chips: { site: 'ondrejbecva.cz', linkedin: 'LinkedIn', email: 'mail@ondrejbecva.cz' },
  },
  cs: {
    role: 'Full-stack vývojář a tech lead',
    place: 'Břeclav',
    label: 'Weby · e-shopy · aplikace · AI automatizace · CRM',
    prompt: 'ondrej --whoami',
    whoami: [
      'Full-stack vývojář a tech lead z Břeclavi. Na volné noze od roku 2020.',
      'Weby, e-shopy, aplikace na míru, CRM a AI automatizace na míru zadání.',
      'Jeden odpovědný člověk od prvního hovoru po spuštění. Bez předávání.',
      'AI je součást mého nářadí, ne prodejní slogan. Zkracuje rutinu.',
    ],
    services: [
      { icon: 'Code2', title: 'Weby na míru', text: 'Rychlé, přehledné weby na míru zadání — ne šablona, kterou je potřeba obcházet.' },
      { icon: 'ShoppingBag', title: 'E-shopy', text: 'Napojené na váš reálný provoz: sklad, fakturace, dopravci. Na míru i na Upgates.' },
      { icon: 'Boxes', title: 'Aplikace na míru', text: 'Interní nástroje tam, kde tabulka nebo krabicový software už nestačí.' },
      { icon: 'Workflow', title: 'AI a automatizace', text: 'Opakovaná práce zautomatizovaná a změřená. AI jen tam, kde šetří čas.' },
      { icon: 'Contact', title: 'CRM', text: 'Evidence zákazníků a obchodu podle toho, jak firma opravdu funguje.' },
      { icon: 'LayoutTemplate', title: 'WordPress', text: 'Šablony a pluginy na míru, správa a údržba.' },
    ],
    groups: { Frontend: 'Frontend', 'Backend a CMS': 'Backend a CMS', 'Databáze': 'Databáze', 'Nástroje a provoz': 'Nástroje a provoz', 'Testování': 'Testování', AI: 'AI' },
    chips: { site: 'ondrejbecva.cz', linkedin: 'LinkedIn', email: 'mail@ondrejbecva.cz' },
  },
}

// The site's tech stack (ondrejbecva.cz, site global `techStack`). `icon` is a simple-icons slug, or `ai` / `test` for
// the generic Lucide marks the site uses where no single brand fits.
export const STACK = [
  { group: 'Frontend', tools: [['HTML5', 'html5'], ['SCSS', 'sass'], ['JavaScript', 'javascript'], ['TypeScript', 'typescript'], ['React', 'react'], ['Next.js', 'nextdotjs'], ['Astro', 'astro'], ['Three.js', 'threedotjs'], ['Tailwind CSS', 'tailwindcss'], ['GSAP', 'gsap'], ['Framer Motion', 'framer'], ['TanStack', 'tanstack']] },
  { group: 'Backend a CMS', tools: [['PHP', 'php'], ['Laravel', 'laravel'], ['WordPress', 'wordpress'], ['Payload CMS', 'payloadcms'], ['Node.js', 'nodedotjs'], ['Bun', 'bun']] },
  { group: 'Databáze', tools: [['MySQL', 'mysql'], ['PostgreSQL', 'postgresql'], ['MongoDB', 'mongodb'], ['Supabase', 'supabase'], ['SQLite', 'sqlite'], ['Redis', 'redis'], ['Drizzle', 'drizzle']] },
  { group: 'Nástroje a provoz', tools: [['Vite', 'vite'], ['esbuild', 'esbuild'], ['Docker', 'docker'], ['CI/CD', 'githubactions'], ['Git', 'git'], ['JetBrains', 'jetbrains'], ['Cloudflare', 'cloudflare'], ['Figma', 'figma'], ['Linux VPS', 'linux'], ['PostHog', 'posthog']] },
  { group: 'Testování', tools: [['Playwright', 'test'], ['Vitest', 'vitest'], ['Jest', 'jest'], ['PHPUnit', 'test'], ['Pest', 'test']] },
  { group: 'AI', tools: [['Claude', 'claude'], ['Gemini', 'googlegemini'], ['ChatGPT', 'ai'], ['MCP', 'modelcontextprotocol'], ['Agent SDK', 'ai'], ['Prompt eval', 'test']] },
]
