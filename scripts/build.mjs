// Builds every image of the profile README: each card in English and Czech, in a dark and a light version (the README
// picks one with <picture> and prefers-color-scheme). Run with `npm run build`; it writes assets/*.svg.
//
// The look is ondrejbecva.cz's: the shell and paper tones, the violet accent, the slashed top-right corner, the spiral
// mark and the thin-wide-thin beams. Text uses system fonts, since GitHub serves these SVGs as images and an image cannot
// load a web font; widths are therefore estimated, and the layout leaves slack for that.
import { writeFileSync } from 'node:fs'
import * as lucide from 'lucide'
import * as simpleIcons from 'simple-icons'
import { LANGUAGES, STACK, TEXT } from './content.mjs'
import { MARK, MARK_SIZE, WORDMARK, WORDMARK_BOX } from './mark.mjs'

const W = 900
const SANS = "-apple-system, BlinkMacSystemFont, 'Segoe UI', Helvetica, Arial, sans-serif"
const MONO = "ui-monospace, SFMono-Regular, Menlo, Consolas, 'Liberation Mono', monospace"
const ACCENT = '#7a6cff'
const THEMES = {
  dark: { bg: '#08080b', card: '#131318', line: 'rgba(233,232,227,0.12)', ink: '#e9e8e3', muted: '#91919a', tile: 'rgba(122,108,255,0.18)' },
  light: { bg: '#f4f4f3', card: '#ffffff', line: 'rgba(17,17,15,0.14)', ink: '#11110f', muted: '#5c5c62', tile: 'rgba(122,108,255,0.12)' },
}

const escape = (value) => String(value).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;')
/** A rough text width: system sans at weight 500 averages about 0.56 em, capitals and wide letters more. */
const textWidth = (text, size, mono = false) => [...text].reduce((sum, ch) => sum + (mono ? 0.6 : /[A-ZÁČĎÉĚÍŇÓŘŠŤÚŮÝŽMW]/.test(ch) ? 0.68 : /[iljtf.,:;'|!]/.test(ch) ? 0.3 : ch === ' ' ? 0.28 : 0.55), 0) * size
/** The design system's panel: a rectangle with the top-right corner slashed off. */
const panel = (x, y, w, h, cut) => `M${x} ${y} H${x + w - cut} L${x + w} ${y + cut} V${y + h} H${x} Z`
const svg = (height, body, title) =>
  `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${W} ${height}" width="${W}" height="${height}" role="img" aria-label="${escape(title)}">${body}</svg>\n`

/** Breaks text into lines of at most `max` characters, on spaces. */
const wrap = (text, max) => {
  const lines = ['']
  for (const word of text.split(' ')) {
    const current = lines.at(-1)
    if (current && (current + ' ' + word).length > max) lines.push(word)
    else lines[lines.length - 1] = current ? `${current} ${word}` : word
  }
  return lines
}

/** A Lucide icon drawn in a 24-unit box, scaled to `size`, stroked in `color`. */
const lucideIcon = (name, x, y, size, color) => {
  const node = lucide[name]
  if (!node) throw new Error(`Lucide has no icon "${name}"`)
  const children = node[2]
    .map(([tag, attributes]) => `<${tag} ${Object.entries(attributes).map(([key, value]) => `${key}="${value}"`).join(' ')}/>`)
    .join('')
  return `<g transform="translate(${x} ${y}) scale(${size / 24})" fill="none" stroke="${color}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">${children}</g>`
}

/** A tool's mark: its simple-icons logo, or the generic sparkle (AI), flask (testing) or pen (design), in one colour. */
const toolMark = (icon, x, y, size, color) => {
  if (icon === 'ai') return lucideIcon('Sparkles', x, y, size, color)
  if (icon === 'test') return lucideIcon('FlaskConical', x, y, size, color)
  if (icon === 'design') return lucideIcon('PenTool', x, y, size, color)
  const key = `si${icon[0].toUpperCase()}${icon.slice(1)}`
  const brand = simpleIcons[key]
  if (!brand) throw new Error(`simple-icons has no "${icon}" (${key})`)
  return `<path transform="translate(${x} ${y}) scale(${size / 24})" d="${brand.path}" fill="${color}"/>`
}

/**
 * The thin-wide-thin beams of the site's closing section, at -45°, clipped to `clip` (an SVG path, so the panel's cut
 * corner stays cut). Static.
 */
const beams = (id, x, y, w, h, clip, opacity) => {
  const stripes = []
  for (let offset = -h; offset < w + h; offset += 200) {
    for (const [start, width] of [[0, 6], [18, 34], [64, 3]]) {
      const at = x + offset + start
      stripes.push(`<path d="M${at} ${y + h} L${at + h} ${y} H${at + h + width} L${at + width} ${y + h} Z"/>`)
    }
  }
  return fadedGroup(id, x, y, w, h, clip, `fill="${ACCENT}" opacity="${opacity}"`, stripes.join(''))
}

/**
 * Thin accent lines at -45° that draw themselves in once, one after another from left to right, then rest (owner,
 * 2026-10-27, picked over still beams, a light sweep and no beams; breathing and glowing beams "looked weird"). The
 * same entrance as the process drawings on ondrejbecva.cz: stroke-dashoffset on pathLength 1. CSS inside the SVG runs
 * when GitHub shows it as an image; under reduced motion the lines are simply there.
 */
const linesDrawIn = (id, x, y, w, h, clip) => {
  const lines = []
  let n = 0
  for (let offset = -h; offset < w + h; offset += 96) {
    for (const [start, width, strength] of [[0, 1.2, 0.5], [12, 2.6, 0.35], [32, 1, 0.6]]) {
      const at = x + offset + start
      lines.push(`<line class="draw" style="animation-delay:${(0.15 + n * 0.09).toFixed(2)}s" x1="${at}" y1="${y + h}" x2="${at + h}" y2="${y}" stroke-width="${width}" stroke-opacity="${strength}" pathLength="1"/>`)
      n++
    }
  }
  const style = `<style>.draw{stroke-dasharray:1;stroke-dashoffset:1;animation:draw 1.6s cubic-bezier(.22,1,.36,1) forwards}@keyframes draw{to{stroke-dashoffset:0}}@media (prefers-reduced-motion:reduce){.draw{animation:none;stroke-dashoffset:0}}</style>`
  return style + fadedGroup(id, x, y, w, h, clip, `stroke="${ACCENT}" fill="none"`, lines.join(''))
}

/** A group clipped to `clip` and faded in from the left of its area, so it has no hard edge where it starts. */
function fadedGroup(id, x, y, w, h, clip, attributes, content) {
  return (
    `<clipPath id="${id}"><path d="${clip}"/></clipPath>` +
    `<linearGradient id="${id}-fade" x1="0" x2="1"><stop offset="0" stop-color="#fff" stop-opacity="0"/><stop offset="0.5" stop-color="#fff"/></linearGradient>` +
    `<mask id="${id}-mask"><rect x="${x}" y="${y}" width="${w}" height="${h}" fill="url(#${id}-fade)"/></mask>` +
    `<g clip-path="url(#${id})" mask="url(#${id}-mask)" ${attributes}>${content}</g>`
  )
}

function hero(text, t) {
  const H = 240
  const markScale = 108 / MARK_SIZE.width
  return svg(
    H,
    `<path d="${panel(0, 0, W, H, 28)}" fill="${t.bg}"/>` +
      // Right of the text block (it ends near x 690), so no line crosses the title or the services line.
      linesDrawIn('hero-lines', 700, 0, W - 700, H, panel(0, 0, W, H, 28)) +
      `<g transform="translate(44 66) scale(${markScale})" color="${t.ink}">${MARK}</g>` +
      // The name is the logo's own wordmark, not typed text: 330 units wide, its baseline where the text's was.
      `<g transform="translate(184 78) scale(${330 / WORDMARK_BOX.width}) translate(${-WORDMARK_BOX.x} ${-WORDMARK_BOX.y})" color="${t.ink}">${WORDMARK}</g>` +
      `<text x="184" y="146" font-family="${SANS}" font-size="20" font-weight="500" fill="${t.ink}">${escape(text.role)}<tspan fill="${t.muted}"> · ${escape(text.ai)}</tspan></text>` +
      // The places on a line of their own: with the role and AI on one line they ran past the panel's edge.
      `<text x="184" y="174" font-family="${SANS}" font-size="15" font-weight="500" fill="${t.muted}">${escape(text.place)}</text>` +
      `<text x="184" y="206" font-family="${SANS}" font-size="12.5" font-weight="600" letter-spacing="1.6" fill="${ACCENT}">◇  ${escape(text.label.toUpperCase())}</text>`,
    `Ondřej Bečva — ${text.role} · ${text.ai} · ${text.place}`,
  )
}

function whoami(text, t) {
  const lineHeight = 30
  // One more line for the waiting prompt with its blinking cursor.
  const H = 104 + (text.whoami.length + 1) * lineHeight + 20
  const promptY = 120 + text.whoami.length * lineHeight
  const body =
    `<style>.cursor{animation:blink 1.1s steps(1) infinite}@keyframes blink{50%{opacity:0}}@media (prefers-reduced-motion:reduce){.cursor{animation:none}}</style>` +
    `<path d="${panel(0, 0, W, H, 22)}" fill="${t.card}" stroke="${t.line}"/>` +
    `<line x1="0" y1="40" x2="${W}" y2="40" stroke="${t.line}"/>` +
    `<circle cx="24" cy="20" r="5" fill="${ACCENT}"/><circle cx="42" cy="20" r="5" fill="none" stroke="${t.muted}"/><circle cx="60" cy="20" r="5" fill="none" stroke="${t.muted}"/>` +
    `<text x="28" y="82" font-family="${MONO}" font-size="15" fill="${t.ink}"><tspan fill="${ACCENT}">$</tspan> ${escape(text.prompt)}</text>` +
    text.whoami
      .map((line, i) => `<text x="28" y="${120 + i * lineHeight}" font-family="${MONO}" font-size="14.5" fill="${t.ink}"><tspan fill="${t.muted}">›</tspan> ${escape(line)}</text>`)
      .join('') +
    `<text x="28" y="${promptY}" font-family="${MONO}" font-size="15" fill="${ACCENT}">$</text>` +
    `<rect class="cursor" x="46" y="${promptY - 13}" width="9" height="17" fill="${ACCENT}"/>`
  return svg(H, body, `$ ${text.prompt} — ${text.whoami.join(' ')}`)
}

/**
 * A grid of cards, two to a row: the icon tile (or the studio diamond) beside the title, the text under it. Two wide
 * columns keep every text to two lines, so the cards are even (three narrow ones wrapped some texts to three).
 */
function cardGrid(items, t, mark) {
  const columns = 2
  const gap = 16
  const cardW = (W - gap) / columns
  // Even padding: 26 above the icon row and about as much below the second text line.
  const cardH = 134
  const rows = Math.ceil(items.length / columns)
  const H = rows * cardH + (rows - 1) * gap
  const body = items
    .map((item, i) => {
      const x = (i % columns) * (cardW + gap)
      const y = Math.floor(i / columns) * (cardH + gap)
      const lines = wrap(item.text, 58).slice(0, 2)
      return (
        `<path d="${panel(x, y, cardW, cardH, 16)}" fill="${t.card}" stroke="${t.line}"/>` +
        mark(item, x + 26, y + 26) +
        `<text x="${x + 76}" y="${y + 50}" font-family="${SANS}" font-size="17" font-weight="700" fill="${t.ink}">${escape(item.title)}</text>` +
        lines.map((line, j) => `<text x="${x + 26}" y="${y + 88 + j * 21}" font-family="${SANS}" font-size="14" fill="${t.muted}">${escape(line)}</text>`).join('')
      )
    })
    .join('')
  return svg(H, body, items.map((item) => `${item.title}: ${item.text}`).join(' '))
}

const services = (text, t) =>
  cardGrid(text.services, t, (service, x, y) => `<path d="${panel(x, y, 36, 36, 7)}" fill="${t.tile}"/>` + lucideIcon(service.icon, x + 9, y + 9, 18, ACCENT))

// The site's mark for a principle: the diamond with a smaller one cut out (SiteSymbol on ondrejbecva.cz).
const principles = (text, t) =>
  cardGrid(text.principles, t, (item, x, y) => `<path transform="translate(${x + 6} ${y + 6}) scale(2)" fill-rule="evenodd" fill="${ACCENT}" d="M6 0l6 6-6 6-6-6 6-6zm0 3.4L2.6 6 6 8.6 9.4 6 6 3.4z"/>`)

function stack(text, t) {
  const padding = 30
  // Wide enough for the longest group label ("NÁSTROJE A PROVOZ") with room before the first chip.
  const labelWidth = 182
  const chipH = 30
  const chipGap = 8
  let y = padding
  const rows = []
  for (const { group, tools } of STACK) {
    let x = padding + labelWidth
    const groupTop = y
    const chips = []
    for (const [name, icon] of tools) {
      const width = 12 + 14 + 8 + textWidth(name, 13) + 14
      if (x + width > W - padding) {
        x = padding + labelWidth
        y += chipH + chipGap
      }
      chips.push(
        `<path d="${panel(x, y, width, chipH, 7)}" fill="${t.card}" stroke="${t.line}"/>` +
          toolMark(icon, x + 12, y + 8, 14, t.ink) +
          `<text x="${x + 34}" y="${y + 19.5}" font-family="${SANS}" font-size="13" font-weight="500" fill="${t.ink}">${escape(name)}</text>`,
      )
      x += width + chipGap
    }
    rows.push(`<text x="${padding}" y="${groupTop + 19.5}" font-family="${SANS}" font-size="11.5" font-weight="700" letter-spacing="1.4" fill="${ACCENT}">${escape(text.groups[group].toUpperCase())}</text>` + chips.join(''))
    y += chipH + 18
  }
  const H = y - 18 + padding
  return svg(H, `<path d="${panel(0, 0, W, H, 22)}" fill="${t.bg}"/>` + rows.join(''), STACK.map(({ group, tools }) => `${text.groups[group]}: ${tools.map(([name]) => name).join(', ')}`).join(' · '))
}

function chip(label, mark, t) {
  const width = Math.round(20 + 18 + 12 + textWidth(label, 15) + 22)
  const body = `<path d="${panel(1, 1, width - 2, 50, 10)}" fill="${t.card}" stroke="${t.line}"/>` + mark(20, 17, 18) + `<text x="50" y="31" font-family="${SANS}" font-size="15" font-weight="600" fill="${t.ink}">${escape(label)}</text>`
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${width} 52" width="${width}" height="52" role="img" aria-label="${escape(label)}">${body}</svg>\n`
}

/**
 * The work history as a timeline: the years in the accent on the left, a rail with a diamond per role (the current one
 * filled), the role and the company, and an optional line under it. The specialisation closes the panel.
 */
function experience(text, t) {
  const { items, note, stats } = text.experience
  // The figures first, in three columns over a hairline; the timeline below them.
  const statWidth = (W - 64) / stats.length
  const figures = stats
    .map((stat, i) => {
      const x = 32 + i * statWidth
      return (
        (i ? `<line x1="${x - 16}" y1="30" x2="${x - 16}" y2="92" stroke="${t.line}"/>` : '') +
        `<text x="${x}" y="68" font-family="${SANS}" font-size="38" font-weight="700" letter-spacing="-1" fill="${t.ink}">${escape(stat.value)}</text>` +
        `<text x="${x}" y="92" font-family="${SANS}" font-size="13.5" fill="${t.muted}">${escape(stat.label)}</text>`
      )
    })
    .join('')
  const top = 150
  const rowH = (item) => (item.note ? 84 : 62)
  let y = top
  const rows = items.map((item, i) => {
    const rowTop = y
    y += rowH(item)
    const current = i === 0
    const diamond = `<path transform="translate(186 ${rowTop + 2}) scale(1.4)" fill-rule="evenodd" fill="${current ? ACCENT : t.card}" stroke="${ACCENT}" stroke-width="${current ? 0 : 1.2}" d="${current ? 'M6 0l6 6-6 6-6-6 6-6zm0 3.4L2.6 6 6 8.6 9.4 6 6 3.4z' : 'M6 0.8l5.2 5.2-5.2 5.2-5.2-5.2z'}"/>`
    return (
      `<text x="32" y="${rowTop + 15}" font-family="${MONO}" font-size="13.5" fill="${current ? ACCENT : t.muted}">${escape(item.years)}</text>` +
      diamond +
      `<text x="226" y="${rowTop + 15}" font-family="${SANS}" font-size="16.5" font-weight="700" fill="${t.ink}">${escape(item.role)}</text>` +
      `<text x="226" y="${rowTop + 38}" font-family="${SANS}" font-size="14" font-weight="500" fill="${t.muted}">${escape(item.place)}</text>` +
      (item.note ? `<text x="226" y="${rowTop + 60}" font-family="${SANS}" font-size="13.5" fill="${t.muted}">${escape(item.note)}</text>` : '')
    )
  })
  const railTop = top + 10
  const railBottom = y - rowH(items.at(-1)) + 10
  const H = y + 54
  const body =
    `<path d="${panel(0, 0, W, H, 22)}" fill="${t.card}" stroke="${t.line}"/>` +
    figures +
    `<line x1="32" y1="118" x2="${W - 32}" y2="118" stroke="${t.line}"/>` +
    `<line x1="194.4" y1="${railTop}" x2="194.4" y2="${railBottom}" stroke="${t.line}" stroke-width="1.5"/>` +
    rows.join('') +
    `<line x1="32" y1="${y + 4}" x2="${W - 32}" y2="${y + 4}" stroke="${t.line}"/>` +
    `<text x="32" y="${y + 32}" font-family="${SANS}" font-size="14" fill="${t.muted}">${escape(note)}</text>`
  return svg(H, body, stats.map((stat) => `${stat.value} ${stat.label}`).join(' · ') + '. ' + items.map((item) => `${item.years}: ${item.role}, ${item.place}`).join(' · ') + '. ' + note)
}

/**
 * The language switch: a two-segment pill, the current language filled in the accent. GitHub runs no scripts in a
 * README, so the whole image links to the other language's README; a click flips it, like a toggle.
 */
function languageToggle(active, t) {
  const width = 120
  const height = 36
  const half = width / 2
  const segment = (x, label, on) =>
    (on ? `<path d="${panel(x + 3, 3, half - 6, height - 6, 7)}" fill="${ACCENT}"/>` : '') +
    `<text x="${x + half / 2}" y="23" text-anchor="middle" font-family="${SANS}" font-size="13" font-weight="700" letter-spacing="1" fill="${on ? '#ffffff' : t.muted}">${label}</text>`
  const body =
    `<path d="${panel(0.5, 0.5, width - 1, height - 1, 10)}" fill="${t.card}" stroke="${t.line}"/>` +
    segment(0, 'EN', active === 'en') +
    segment(half, 'CZ', active === 'cs')
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${width} ${height}" width="${width}" height="${height}" role="img" aria-label="${active === 'en' ? 'English · switch to Czech' : 'Čeština · přepnout do angličtiny'}">${body}</svg>\n`
}

let written = 0
const write = (name, content) => {
  writeFileSync(new URL(`../assets/${name}`, import.meta.url), content)
  written++
}
for (const language of LANGUAGES) {
  const text = TEXT[language]
  for (const [themeName, t] of Object.entries(THEMES)) {
    const suffix = `${language}-${themeName}.svg`
    write(`hero-${suffix}`, hero(text, t))
    write(`whoami-${suffix}`, whoami(text, t))
    write(`services-${suffix}`, services(text, t))
    write(`principles-${suffix}`, principles(text, t))
    write(`experience-${suffix}`, experience(text, t))
    write(`stack-${suffix}`, stack(text, t))
    write(`toggle-${suffix}`, languageToggle(language, t))
    write(`chip-site-${suffix}`, chip(text.chips.site, (x, y, s) => lucideIcon('Globe', x, y, s, ACCENT), t))
    write(`chip-linkedin-${suffix}`, chip(text.chips.linkedin, (x, y, s) => lucideIcon('Linkedin', x, y, s, ACCENT), t))
    write(`chip-email-${suffix}`, chip(text.chips.email, (x, y, s) => lucideIcon('Mail', x, y, s, ACCENT), t))
  }
}
console.log(`${written} images written to assets/`)
