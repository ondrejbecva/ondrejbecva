// The LinkedIn background photo, 1584 × 396 (LinkedIn's recommended size; JPG or PNG, it does not animate), in
// Czech and English: the profile hero's look at banner proportions, with the robot still at the right.
// LinkedIn lays the round profile photo over the lower left on desktop and crops the sides on phones, so everything
// that matters sits right of x ≈ 400 and away from the far edges; the text block ends left of the robot.
// Needs assets/linkedin/robot-still.png (scripts/robot-still.mjs). Run with:  node scripts/linkedin-banner.mjs
import { readFileSync, writeFileSync } from 'node:fs'
import { chromium } from 'playwright'
import { TEXT } from './content.mjs'
import { MARK, MARK_SIZE, WORDMARK, WORDMARK_BOX } from './mark.mjs'

const W = 1584
const H = 396
const SANS = "-apple-system, BlinkMacSystemFont, 'Segoe UI', Helvetica, Arial, sans-serif"
const ACCENT = '#7a6cff'
const BG = '#08080b'
const INK = '#e9e8e3'
const MUTED = '#91919a'
const escape = (value) => String(value).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
const robot = `data:image/png;base64,${readFileSync(new URL('../assets/linkedin/robot-still.png', import.meta.url)).toString('base64')}`

/** The thin-wide-thin beams of ondrejbecva.cz at -45°, faded in from the left of their area. */
function beams(x, w) {
  const stripes = []
  for (let offset = -H; offset < w + H; offset += 220) {
    for (const [start, width] of [[0, 7], [20, 40], [72, 3]]) {
      const at = x + offset + start
      stripes.push(`<path d="M${at} ${H} L${at + H} 0 H${at + H + width} L${at + width} ${H} Z"/>`)
    }
  }
  return (
    `<linearGradient id="fade" x1="0" x2="1"><stop offset="0" stop-color="#fff" stop-opacity="0"/><stop offset="0.5" stop-color="#fff"/></linearGradient>` +
    `<mask id="beams"><rect x="${x}" y="0" width="${w}" height="${H}" fill="url(#fade)"/></mask>` +
    `<clipPath id="area"><rect x="${x}" y="0" width="${w}" height="${H}"/></clipPath>` +
    `<g clip-path="url(#area)" mask="url(#beams)" fill="${ACCENT}" opacity="0.16">${stripes.join('')}</g>`
  )
}

function banner(text) {
  const markSize = 132
  const wordmarkWidth = 470
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${W} ${H}" width="${W}" height="${H}">
<rect width="${W}" height="${H}" fill="${BG}"/>
${beams(900, W - 900)}
<g transform="translate(420 96) scale(${markSize / MARK_SIZE.width})" color="${INK}">${MARK}</g>
<g transform="translate(588 114) scale(${wordmarkWidth / WORDMARK_BOX.width}) translate(${-WORDMARK_BOX.x} ${-WORDMARK_BOX.y})" color="${INK}">${WORDMARK}</g>
<text x="590" y="206" font-family="${SANS}" font-size="24" font-weight="500" fill="${INK}">${escape(text.role)}<tspan fill="${MUTED}"> · ${escape(text.ai)}</tspan></text>
<text x="590" y="258" font-family="${SANS}" font-size="16" font-weight="700" letter-spacing="2.2" fill="${ACCENT}">◇  ${escape(text.label.toUpperCase())}</text>
<text x="590" y="312" font-family="${SANS}" font-size="18" font-weight="500" fill="${MUTED}">ondrejbecva.cz<tspan> · ${escape(text.place)}</tspan></text>
<image href="${robot}" x="1262" y="22" width="280" height="360"/>
</svg>`
}

const browser = await chromium.launch()
const page = await browser.newPage({ viewport: { width: W, height: H }, deviceScaleFactor: 1 })
for (const language of ['cs', 'en']) {
  const svg = banner(TEXT[language])
  const out = new URL(`../assets/linkedin/banner-${language}.png`, import.meta.url).pathname
  await page.setContent(`<body style="margin:0">${svg}</body>`)
  writeFileSync(out, await page.screenshot({ clip: { x: 0, y: 0, width: W, height: H } }))
  console.log('written', out)
}
await browser.close()
