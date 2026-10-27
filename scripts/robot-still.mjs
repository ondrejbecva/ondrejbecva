// A still of the ondrejbecva.cz robot mid-wave, at twice the pixel density, for the LinkedIn banner. Like the GIF
// recorder it needs the site's dev server (https://ondrejbecva.test) and drives the animation on a virtual clock.
// Run with:  node scripts/robot-still.mjs [background, default transparent] [out]
import { chromium } from 'playwright'
import { writeFileSync } from 'node:fs'

const [bg = 'transparent', out = new URL('../assets/linkedin/robot-still.png', import.meta.url).pathname] = process.argv.slice(2)
const SIZE = 400
const browser = await chromium.launch({ args: ['--use-gl=angle', '--use-angle=swiftshader', '--enable-unsafe-swiftshader'] })
const page = await browser.newPage({ viewport: { width: 900, height: 700 }, deviceScaleFactor: 2, ignoreHTTPSErrors: true })
await page.addInitScript(() => localStorage.setItem('robot-off', '1'))
await page.clock.install()
// three.js's Clock reads performance.now(), which the fake clock does not cover: drive it by hand as well.
await page.addInitScript(() => { const real = performance.now.bind(performance); performance.now = () => (window.__virtual ?? real()) })
await page.goto('https://ondrejbecva.test/kontakt', { waitUntil: 'load' })
await page.evaluate(async ({ SIZE, bg }) => {
  const stage = document.createElement('div')
  stage.style.cssText = `position:fixed;inset:0;z-index:2147483647;background:${bg};display:grid;place-items:center`
  // For a transparent still the site's own page background must go too, or it shows through the canvas.
  if (bg === 'transparent') {
    for (const element of [document.documentElement, document.body]) element.style.setProperty('background', 'transparent', 'important')
    for (const child of document.body.children) if (child !== stage) child.style.setProperty('display', 'none', 'important')
  }
  const canvas = document.createElement('canvas')
  canvas.style.cssText = `width:${SIZE}px;height:${SIZE}px`
  canvas.id = 'rec'
  stage.append(canvas); document.body.append(stage)
  const { startCompanion } = await import('/src/robot/companion.js')
  window.__robot = startCompanion(canvas)
  window.__virtual = performance.now()
}, { SIZE, bg })
const advance = async (ms) => { await page.evaluate((ms) => { window.__virtual += ms }, ms); await page.clock.runFor(ms) }
for (let i = 0; i < 75; i++) await advance(40)
await page.evaluate(() => window.__robot.play('wave'))
// About 1.3 s into the wave the hand is high and open (frame 30 of the GIF).
for (let i = 0; i < 33; i++) await advance(40)
const stage = await page.locator('#rec').boundingBox()
// Transparent around the figure (the renderer clears to alpha), so it stands on whatever the banner draws behind it.
writeFileSync(out, await page.screenshot({ clip: { x: stage.x + 60, y: stage.y + 10, width: 280, height: 360 }, omitBackground: true }))
console.log('written', out)
await browser.close()
