#!/usr/bin/env node
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { spawnSync } from 'node:child_process'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const ROOT = path.resolve(__dirname, '..')

const checks = []

function check(name, fn) {
  try {
    fn()
    checks.push({ name, ok: true })
    console.log('✓', name)
  } catch (e) {
    checks.push({ name, ok: false, error: String(e) })
    console.error('✗', name, e.message || e)
  }
}

check('content index present', () => {
  const p = path.join(ROOT, 'content/lessons/index.json')
  if (!fs.existsSync(p)) throw new Error('run pnpm import')
})

check('zh/en i18n dictionaries', () => {
  for (const f of ['zh.json', 'en.json']) {
    const p = path.join(ROOT, 'site/src/i18n', f)
    if (!fs.existsSync(p)) throw new Error(`missing ${f}`)
  }
})

check('theme provider + three themes', () => {
  const p = path.join(ROOT, 'site/src/theme/ThemeProvider.tsx')
  const s = fs.readFileSync(p, 'utf8')
  if (!s.includes("light") || !s.includes("dark") || !s.includes("shadcn")) throw new Error('missing theme ids')
})

check('dual view mode (classic + slides)', () => {
  const slides = path.join(ROOT, 'site/src/features/slides/SlidesViewer.tsx')
  const lesson = path.join(ROOT, 'site/src/routes/lesson.$phase.$lesson.tsx')
  if (!fs.existsSync(slides)) throw new Error('SlidesViewer missing')
  const s = fs.readFileSync(lesson, 'utf8')
  if (!s.includes('classic') || !s.includes('slides')) throw new Error('lesson route missing modes')
})

check('site/content separation', () => {
  if (!fs.existsSync(path.join(ROOT, 'site/package.json'))) throw new Error('site package missing')
  if (!fs.existsSync(path.join(ROOT, 'content/package.json'))) throw new Error('content package missing')
})

check('static build', () => {
  const r = spawnSync('pnpm', ['--filter', '@aej/site', 'build'], {
    cwd: ROOT,
    encoding: 'utf8',
    stdio: 'inherit',
  })
  if (r.status !== 0) throw new Error('site build failed')
  const dist = path.join(ROOT, 'site/dist/index.html')
  if (!fs.existsSync(dist)) throw new Error('dist/index.html missing')
})

const failed = checks.filter((c) => !c.ok)
console.log(`\n${checks.length - failed.length}/${checks.length} checks passed`)
process.exit(failed.length ? 1 : 0)
