// A self-contained preview of the profile as GitHub shows it: both READMEs, both themes, every image embedded (the
// robot GIF and the SVG animations play). It is an approximation of GitHub's rendering, for review before pushing.
// Run with `npm run preview`; it writes preview.html (not committed).
import { readFileSync, writeFileSync } from 'node:fs'

const root = new URL('../', import.meta.url)
const cache = new Map()
const dataUri = (path) => {
  if (!cache.has(path)) {
    const type = path.endsWith('.gif') ? 'image/gif' : path.endsWith('.png') ? 'image/png' : 'image/svg+xml'
    cache.set(path, `data:${type};base64,${readFileSync(new URL(path, root)).toString('base64')}`)
  }
  return cache.get(path)
}
const bold = (text) => text.replace(/\*\*(.+?)\*\*/g, '<b>$1</b>')

/** A rough Markdown renderer for what these READMEs use: pictures, headings, a table, raw HTML lines, paragraphs. */
function render(markdown, theme, language) {
  let md = markdown.replace(/<!--[\s\S]*?-->/g, '')
  md = md.replace(/<picture>[\s\S]*?<\/picture>/g, (block) => {
    const source = block.match(new RegExp(`srcset="(assets/[^"?]*-${theme}\\.(?:svg|gif|png))`))[1]
    const attributes = block.match(/<img ([^>]*)>/)[1].replace(/src="[^"]*"/, `src="${dataUri(source)}"`)
    return `<img ${attributes}>`
  })
  // The language switch links to the other README: in the preview it flips the language instead.
  md = md.replace(/<a href="README(\.cs)?\.md">/g, `<a href="#" data-switch="${language === 'en' ? 'cs' : 'en'}">`)
  const out = []
  let table = []
  for (const line of [...md.split('\n'), '']) {
    if (line.startsWith('|')) {
      table.push(line)
      continue
    }
    if (table.length) {
      const rows = table.filter((row) => !/^\|\s*:?-/.test(row) && row.replace(/[|\s]/g, ''))
      out.push(`<table>${rows.map((row) => `<tr>${row.replace(/^\||\|$/g, '').split('|').map((cell) => `<td>${bold(cell.trim())}</td>`).join('')}</tr>`).join('')}</table>`)
      table = []
    }
    if (line.startsWith('## ')) out.push(`<h2>${line.slice(3)}</h2>`)
    else if (!line.trim()) out.push('')
    else if (line.trimStart().startsWith('<')) out.push(line)
    else out.push(`<p>${bold(line)}</p>`)
  }
  return out.join('\n')
}

const articles = []
for (const [language, file] of [['en', 'README.md'], ['cs', 'README.cs.md']]) {
  const markdown = readFileSync(new URL(file, root), 'utf8')
  for (const theme of ['dark', 'light']) articles.push(`<article data-variant="${language}-${theme}" class="gh ${theme}" hidden>${render(markdown, theme, language)}</article>`)
}

const page = `<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>GitHub profile preview</title>
<style>
body{margin:0;font-family:-apple-system,BlinkMacSystemFont,"Segoe UI",Helvetica,Arial,sans-serif;background:#0d1117}
.bar{position:sticky;top:0;z-index:2;display:flex;gap:8px;justify-content:center;padding:10px 16px;background:#161b22;border-bottom:1px solid #30363d}
.bar button{font:600 13px -apple-system,sans-serif;padding:6px 14px;border:1px solid #30363d;background:#0d1117;color:#e6edf3;cursor:pointer}
.bar button[aria-pressed=true]{background:#7a6cff;border-color:#7a6cff;color:#fff}
.gh{max-width:830px;margin:0 auto;padding:24px 16px 64px;line-height:1.5}
.gh.dark{color:#e6edf3}.gh.light{color:#1f2328}
.gh h2{font-size:1.5em;padding-bottom:.3em;margin:24px 0 16px;border-bottom:1px solid #30363d}.gh.light h2{border-color:#d1d9e0}
.gh img{max-width:100%;height:auto;vertical-align:middle}.gh table{border-collapse:collapse;font-size:14px;margin:12px 0}
.gh td{padding:6px 13px;border:1px solid #30363d}.gh.light td{border-color:#d1d9e0}.gh summary{cursor:pointer;margin:8px 0}.gh p{margin:0 0 12px}
</style></head><body>
<div class="bar"><button data-theme="dark" aria-pressed="true">Dark</button><button data-theme="light" aria-pressed="false">Light</button></div>
${articles.join('\n')}
<script>
let language = 'en', theme = 'dark'
const show = () => {
  document.querySelectorAll('[data-variant]').forEach((article) => (article.hidden = article.dataset.variant !== language + '-' + theme))
  document.querySelectorAll('[data-theme]').forEach((button) => button.setAttribute('aria-pressed', button.dataset.theme === theme))
  document.body.style.background = theme === 'dark' ? '#0d1117' : '#ffffff'
}
document.querySelectorAll('[data-theme]').forEach((button) => (button.onclick = () => { theme = button.dataset.theme; show() }))
document.querySelectorAll('[data-switch]').forEach((link) => (link.onclick = (event) => { event.preventDefault(); language = link.dataset.switch; show(); scrollTo(0, 0) }))
show()
</script></body></html>`
writeFileSync(new URL('preview.html', root), page)
console.log(`preview.html written (${Math.round(page.length / 1024)} kB)`)
