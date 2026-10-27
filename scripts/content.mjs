// Everything the profile says, in both languages. Facts come from ondrejbecva.cz (its bio, experience, services, way of
// working and tech stack as of 2026-10-26); nothing here should claim more than the site does.

export const LANGUAGES = ['en', 'cs']

export const TEXT = {
  en: {
    role: 'Software engineer & tech lead',
    ai: 'AI in daily practice',
    // Where the owner works (2026-10-27): "Břeclav/Brno/Prague and the whole world".
    place: 'Břeclav · Brno · Prague · remote worldwide',
    label: 'Websites · e-commerce · apps · AI automation · CRM & ERP',
    prompt: 'ondrej --whoami',
    whoami: [
      'Software engineer and tech lead from Břeclav. Building for the web since 2018.',
      'Websites, e-commerce, custom apps, CRM, ERP and AI automation, to the brief.',
      'One accountable person from the first call to launch. No hand-offs.',
      'AI is part of my toolkit, not a sales slogan. It shortens the routine.',
    ],
    services: [
      { icon: 'Code2', title: 'Custom websites', text: 'Fast, clear sites built to the brief, not a template you work around.' },
      { icon: 'ShoppingBag', title: 'E-commerce', text: 'Online stores wired to how you really run: stock, invoicing, carriers. Custom or on Upgates.' },
      { icon: 'Boxes', title: 'Custom apps', text: 'Internal tools where a spreadsheet or boxed software no longer fits.' },
      { icon: 'Workflow', title: 'AI & automation', text: 'Repetitive work automated, measured first. AI only where it saves time.' },
      { icon: 'Contact', title: 'CRM & ERP', text: 'Customers, sales and operations in one system that follows how the company really works.' },
      { icon: 'LayoutTemplate', title: 'WordPress', text: 'Custom themes and plugins, care and maintenance.' },
    ],
    experience: {
      heading: 'Experience',
      // The owner, 2026-10-27: "100+ projects… creating sites and maintenance work on smaller tasks", and "I work from
      // 2018, not from 2020" (on his own since 2018, alongside the employments).
      stats: [
        { value: '8+', label: 'years building for the web' },
        { value: '100+', label: 'projects delivered and maintained' },
        { value: '2018', label: 'on my own since' },
      ],
      items: [
        { years: '2018 – now', role: 'Freelance software engineer & tech lead', place: 'Own practice', note: 'Projects from small sites to corporate solutions; leading teams and client work.' },
        { years: '2020 – 2024', role: 'Full-stack developer', place: 'Softmedia', note: '' },
        { years: '2018 – 2020', role: 'Web developer, front-end & back-end', place: 'Adler & Co', note: '' },
        { years: '2018 – 2019', role: 'Front-end developer', place: 'IDEATECH', note: '' },
      ],
      note: 'Specialised in WordPress, Laravel and JavaScript frameworks (Vue.js, React), with AI in everyday work.',
    },
    principles: [
      { title: 'Fixed price', text: 'If the budget has to change, you hear it at once. Nothing changes without your approval.' },
      { title: 'No agreement, no start', text: 'If we do not agree on price or approach, work does not start and you pay nothing.' },
      { title: 'Straight talk', text: 'Regular calls about the project and demos of work in progress.' },
      { title: 'The brief before the design', text: 'First what the work should do and for whom, then how it looks.' },
      { title: 'Measure, then automate', text: 'Keep what saves time, switch off what does not.' },
      { title: 'One person, no hand-offs', text: 'You talk to the one who builds it, not to a chain of salesperson and designer.' },
    ],
    groups: { Frontend: 'Frontend', 'Backend a CMS': 'Backend & CMS', 'Databáze': 'Databases', 'Nástroje a provoz': 'Tools & ops', 'Testování': 'Testing', AI: 'AI' },
    chips: { site: 'ondrejbecva.cz', linkedin: 'LinkedIn', email: 'mail@ondrejbecva.cz' },
  },
  cs: {
    role: 'Software engineer a tech lead',
    ai: 'AI v každodenní praxi',
    place: 'Břeclav · Brno · Praha · i na dálku po celém světě',
    label: 'Weby · e-shopy · aplikace · AI automatizace · CRM a ERP',
    prompt: 'ondrej --whoami',
    whoami: [
      'Software engineer a tech lead z Břeclavi. Weby stavím od roku 2018.',
      'Weby, e-shopy, aplikace na míru, CRM, ERP a AI automatizace na míru.',
      'Jeden odpovědný člověk od prvního hovoru po spuštění. Bez předávání.',
      'AI je součást mého nářadí, ne prodejní slogan. Zkracuje rutinu.',
    ],
    services: [
      { icon: 'Code2', title: 'Weby na míru', text: 'Rychlé, přehledné weby na míru zadání — ne šablona, kterou je potřeba obcházet.' },
      { icon: 'ShoppingBag', title: 'E-shopy', text: 'Napojené na váš reálný provoz: sklad, fakturace, dopravci. Na míru i na Upgates.' },
      { icon: 'Boxes', title: 'Aplikace na míru', text: 'Interní nástroje tam, kde tabulka nebo krabicový software už nestačí.' },
      { icon: 'Workflow', title: 'AI a automatizace', text: 'Opakovaná práce zautomatizovaná a změřená. AI jen tam, kde šetří čas.' },
      { icon: 'Contact', title: 'CRM a ERP', text: 'Zákazníci, obchod i provoz v jednom systému podle toho, jak firma opravdu funguje.' },
      { icon: 'LayoutTemplate', title: 'WordPress', text: 'Šablony a pluginy na míru, správa a údržba.' },
    ],
    experience: {
      heading: 'Praxe',
      stats: [
        { value: '8+', label: 'let tvořím pro web' },
        { value: '100+', label: 'dokončených a spravovaných projektů' },
        { value: '2018', label: 'na volné noze od roku' },
      ],
      items: [
        { years: '2018 – dnes', role: 'Na volné noze — software engineer a tech lead', place: 'Vlastní praxe', note: 'Projekty od menších webů po korporátní řešení; vedení týmů a spolupráce s klienty.' },
        { years: '2020 – 2024', role: 'Full-stack developer', place: 'Softmedia', note: '' },
        { years: '2018 – 2020', role: 'Webový vývojář pro front-end a back-end', place: 'Adler & Co', note: '' },
        { years: '2018 – 2019', role: 'Webový vývojář pro front-end', place: 'IDEATECH', note: '' },
      ],
      note: 'Specializuji se na WordPress, Laravel a JavaScriptové frameworky (Vue.js, React), při práci aktivně využívám AI.',
    },
    principles: [
      { title: 'Pevná cena', text: 'Pokud by bylo potřeba rozpočet upravit, dozvíte se to hned. Bez vašeho schválení se nic nemění.' },
      { title: 'Bez dohody se nezačíná', text: 'Když se na ceně nebo postupu nedohodneme, práce nezačne a nic neplatíte.' },
      { title: 'Na rovinu', text: 'Pravidelné hovory o stavu projektu a ukázky rozpracované práce.' },
      { title: 'Zadání před designem', text: 'Nejdřív co má práce dělat a pro koho, potom jak vypadá.' },
      { title: 'Změřit, pak automatizovat', text: 'Co šetří čas, zůstane. Co nešetří, vypneme.' },
      { title: 'Jeden člověk, bez předávání', text: 'Mluvíte s tím, kdo to staví — ne přes obchodníka a designéra.' },
    ],
    groups: { Frontend: 'Frontend', 'Backend a CMS': 'Backend a CMS', 'Databáze': 'Databáze', 'Nástroje a provoz': 'Nástroje a provoz', 'Testování': 'Testování', AI: 'AI' },
    chips: { site: 'ondrejbecva.cz', linkedin: 'LinkedIn', email: 'mail@ondrejbecva.cz' },
  },
}

// The site's tech stack (ondrejbecva.cz, site global `techStack`). `icon` is a simple-icons slug, or `ai` / `test` for
// the generic Lucide marks the site uses where no single brand fits (`design`: a pen, for pen.dev).
export const STACK = [
  { group: 'Frontend', tools: [['HTML5', 'html5'], ['SCSS', 'sass'], ['JavaScript', 'javascript'], ['TypeScript', 'typescript'], ['React', 'react'], ['Next.js', 'nextdotjs'], ['Astro', 'astro'], ['Three.js', 'threedotjs'], ['Tailwind CSS', 'tailwindcss'], ['GSAP', 'gsap'], ['Framer Motion', 'framer'], ['TanStack', 'tanstack']] },
  { group: 'Backend a CMS', tools: [['PHP', 'php'], ['Laravel', 'laravel'], ['WordPress', 'wordpress'], ['Payload CMS', 'payloadcms'], ['Node.js', 'nodedotjs'], ['Bun', 'bun']] },
  { group: 'Databáze', tools: [['MySQL', 'mysql'], ['PostgreSQL', 'postgresql'], ['MongoDB', 'mongodb'], ['Supabase', 'supabase'], ['SQLite', 'sqlite'], ['Redis', 'redis'], ['Drizzle', 'drizzle']] },
  { group: 'Nástroje a provoz', tools: [['Vite', 'vite'], ['esbuild', 'esbuild'], ['Docker', 'docker'], ['CI/CD', 'githubactions'], ['Git', 'git'], ['JetBrains', 'jetbrains'], ['Cloudflare', 'cloudflare'], ['Figma', 'figma'], ['pen.dev', 'design'], ['Linux VPS', 'linux'], ['PostHog', 'posthog']] },
  { group: 'Testování', tools: [['Playwright', 'test'], ['Vitest', 'vitest'], ['Jest', 'jest'], ['PHPUnit', 'test'], ['Pest', 'test']] },
  { group: 'AI', tools: [['Claude', 'claude'], ['Gemini', 'googlegemini'], ['ChatGPT', 'ai'], ['MCP', 'modelcontextprotocol'], ['Agent SDK', 'ai'], ['Prompt eval', 'test']] },
]
