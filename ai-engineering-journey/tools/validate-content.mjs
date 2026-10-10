#!/usr/bin/env node
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const ROOT = path.resolve(__dirname, '..')
const LESSONS = path.join(ROOT, 'content/lessons')

let errors = 0
let warnings = 0

function fail(msg) {
  console.error('✗', msg)
  errors++
}
function warn(msg) {
  console.warn('!', msg)
  warnings++
}
function ok(msg) {
  console.log('✓', msg)
}

const indexPath = path.join(LESSONS, 'index.json')
if (!fs.existsSync(indexPath)) {
  fail('content/lessons/index.json missing — run pnpm import')
  process.exit(1)
}
const index = JSON.parse(fs.readFileSync(indexPath, 'utf8'))
ok(`index: ${index.length} lessons`)

for (const meta of index) {
  const dir = path.join(LESSONS, meta.id)
  if (!fs.existsSync(path.join(dir, 'meta.json'))) fail(`missing meta.json: ${meta.id}`)
  if (!fs.existsSync(path.join(dir, 'en.md'))) fail(`missing en.md: ${meta.id}`)
  const zh = fs.existsSync(path.join(dir, 'zh.md'))
  if (meta.needsTranslation === zh) {
    warn(`needsTranslation mismatch: ${meta.id} (zh=${zh}, flag=${meta.needsTranslation})`)
  }
  const slidesPath = path.join(dir, 'slides.json')
  if (!fs.existsSync(slidesPath)) {
    warn(`missing slides.json: ${meta.id}`)
  } else {
    const slides = JSON.parse(fs.readFileSync(slidesPath, 'utf8'))
    if (!Array.isArray(slides) || !slides.length) warn(`empty slides: ${meta.id}`)
  }
}

ok(`validated ${index.length} lessons (${warnings} warnings)`)
if (errors) process.exit(1)
