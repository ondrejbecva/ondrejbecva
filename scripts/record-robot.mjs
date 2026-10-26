// Records the ondrejbecva.cz companion robot waving and writes assets/robot-dark.gif and assets/robot-light.gif.
// It needs the site's dev server (https://ondrejbecva.test, DDEV): the robot is a three.js module of that site, loaded
// here through the dev server, so this repository holds only its recording. Run with:
//   npm run record-robot   (renders in software WebGL, a few minutes)
import { chromium } from 'playwright'
import { PNG } from 'pngjs'
import { writeFileSync } from 'node:fs'
import gifenc from 'gifenc'
const { GIFEncoder, quantize, applyPalette } = gifenc
const SIZE = 400
const [outDir = new URL('../assets', import.meta.url).pathname, action = 'wave', seconds = '4.2'] = process.argv.slice(2)
const b = await chromium.launch({ args: ['--use-gl=angle', '--use-angle=swiftshader', '--enable-unsafe-swiftshader'] })
// GitHub's own page colours, so the robot stands on the profile page rather than in a box.
for (const [theme, bg] of [['dark', '#0d1117'], ['light', '#ffffff']]) {
  const p = await b.newPage({ viewport: { width: 900, height: 700 }, deviceScaleFactor: 1, ignoreHTTPSErrors: true })
  const errors = []; p.on('pageerror', (e) => errors.push(e.message))
  await p.addInitScript(() => localStorage.setItem('robot-off', '1'))
  // A fake clock: the animation advances exactly one frame step per capture, however slow the software renderer is.
  await p.clock.install()
  // three.js's Clock reads performance.now(), which the fake clock above does not cover: drive it by hand as well.
  await p.addInitScript(() => { const real = performance.now.bind(performance); performance.now = () => (window.__virtual ?? real()) })
  await p.goto('https://ondrejbecva.test/kontakt', { waitUntil: 'load' })
  await p.evaluate(async ({ SIZE, bg }) => {
    const stage = document.createElement('div')
    stage.style.cssText = `position:fixed;inset:0;z-index:2147483647;background:${bg};display:grid;place-items:center`
    const canvas = document.createElement('canvas')
    canvas.style.cssText = `width:${SIZE}px;height:${SIZE}px`
    canvas.id = 'rec'
    stage.append(canvas); document.body.append(stage)
    const { startCompanion } = await import('/src/robot/companion.js')
    window.__robot = startCompanion(canvas)
  }, { SIZE, bg })
  await p.evaluate(() => { window.__virtual = performance.now() })
  const advance = async (ms) => { await p.evaluate((ms) => { window.__virtual += ms }, ms); await p.clock.runFor(ms) }
  for (let i = 0; i < 75; i++) await advance(40)
  // Cropped to the figure: the 3D stage keeps headroom for flights that a still recording does not need.
  const stage = await p.locator('#rec').boundingBox()
  const box = { x: stage.x + 70, y: stage.y + 14, width: 260, height: 350 }
  await p.evaluate((action) => { window.__robot.wake?.(); window.__robot.play(action) }, action)
  const STEP = 40
  const frames = []
  for (let t = 0; t < Number(seconds) * 1000; t += STEP) {
    await advance(STEP)
    frames.push({ t, png: PNG.sync.read(await p.screenshot({ clip: box })) })
  }
  const gif = GIFEncoder()
  frames.forEach((frame, i) => {
    const { data, width, height } = frame.png
    const palette = quantize(data, 256)
    const delay = i < frames.length - 1 ? STEP : 600
    gif.writeFrame(applyPalette(data, palette), width, height, { palette, delay, repeat: 0 })
  })
  gif.finish()
  writeFileSync(`${outDir}/robot-${theme}.gif`, gif.bytes())
  console.log(theme, frames.length, 'frames,', Math.round(gif.bytes().length / 1024), 'kB, errors:', errors.slice(0, 2))
  await p.close()
}
await b.close()
