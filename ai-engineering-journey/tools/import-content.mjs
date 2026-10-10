#!/usr/bin/env node
/**
 * Import lessons from ai-engineering-from-scratch into content/.
 * Generates meta.json + slides.json per lesson; copies en.md.
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '..');
const SOURCE = process.env.AIFS_SOURCE
  || '/Users/patrick/workspace/variableway/skills-hub/tutorials/ai-engineering-from-scratch';
const OUT_LESSONS = path.join(ROOT, 'content/lessons');
const OUT_GLOSSARY = path.join(ROOT, 'content/glossary');

const CMD_LANGS = new Set(['bash', 'sh', 'shell', 'console', 'powershell', 'zsh', 'text']);

function parseFrontMeta(md) {
  const titleMatch = md.match(/^#\s+(.+)$/m);
  const hookMatch = md.match(/^>\s+(.+)$/m);
  const typeMatch = md.match(/^\*\*Type:\*\*\s*(.+)$/m);
  const langsMatch = md.match(/^\*\*Languages:\*\*\s*(.+)$/m);
  const prereqMatch = md.match(/^\*\*Prerequisites:\*\*\s*(.+)$/m);
  const timeMatch = md.match(/^\*\*Time:\*\*\s*~?\s*(\d+)/m);
  return {
    title: titleMatch?.[1]?.trim() || '',
    hook: hookMatch?.[1]?.trim() || '',
    type: typeMatch?.[1]?.trim() || 'Learn',
    languages: (langsMatch?.[1] || '').split(',').map((s) => s.trim()).filter(Boolean),
    prerequisites: (prereqMatch?.[1]?.trim() === 'None' ? '' : prereqMatch?.[1] || '').split(',').map((s) => s.trim()).filter((s) => s && s !== 'None'),
    timeMinutes: timeMatch ? Number(timeMatch[1]) : null,
  };
}

function prereqMatchValue(m) {
  return m?.[1]?.trim() === 'None' ? '' : m?.[1] || '';
}

function stripFence(code) {
  return code.replace(/\n$/, '');
}

function splitSections(md) {
  const lines = md.split('\n');
  const sections = [];
  let current = { title: 'Intro', body: [] };
  let inFence = false;
  for (const line of lines) {
    if (line.startsWith('```')) inFence = !inFence;
    if (!inFence && /^##\s+/.test(line)) {
      if (current.body.length) sections.push(current);
      current = { title: line.replace(/^##\s+/, '').trim(), body: [] };
    } else {
      current.body.push(line);
    }
  }
  if (current.body.length) sections.push(current);
  return sections.map((s, i) => ({ id: slugify(s.title) || `s${i}`, title: s.title, body: s.body.join('\n').trim() }));
}

function slugify(s) {
  return s.toLowerCase().replace(/[^a-z0-9\u4e00-\u9fff]+/g, '-').replace(/^-|-$/g, '');
}

function extractCommands(body) {
  const commands = [];
  const re = /```(\w+)?\n([\s\S]*?)```/g;
  let m;
  while ((m = re.exec(body))) {
    const lang = (m[1] || 'text').toLowerCase();
    if (CMD_LANGS.has(lang) || lang === 'bash') {
      commands.push({ lang, code: stripFence(m[2]) });
    }
  }
  return commands;
}

function extractKeyPoints(body, sectionTitle) {
  const points = [];
  // Learning objectives style bullets
  for (const line of body.split('\n')) {
    const bullet = line.match(/^\s*[-*]\s+\*\*(.+?)\*\*[:：]?\s*(.*)$/);
    if (bullet) {
      points.push(bullet[2] ? `${bullet[1]}: ${bullet[2]}`.trim() : bullet[1]);
      continue;
    }
    const plain = line.match(/^\s*[-*]\s+(.+)$/);
    if (plain && points.length < 6) {
      const t = plain[1].replace(/\*\*/g, '').trim();
      if (t.length > 8 && t.length < 160) points.push(t);
    }
    const bold = line.match(/\*\*(.+?)\*\*/g);
    if (bold && points.length < 6 && line.trim().length < 200) {
      for (const b of bold) {
        const t = b.replace(/\*\*/g, '');
        if (t.length > 4 && t.length < 80 && !points.includes(t)) points.push(t);
      }
    }
    if (points.length >= 6) break;
  }
  if (!points.length && /objectives/i.test(sectionTitle)) {
    for (const line of body.split('\n')) {
      const plain = line.match(/^\s*[-*]\s+(.+)$/);
      if (plain) points.push(plain[1].replace(/\*\*/g, '').trim());
      if (points.length >= 6) break;
    }
  }
  return points.slice(0, 6);
}

function buildSlides(md) {
  const sections = splitSections(md);
  return sections.map((s) => ({
    id: s.id,
    title: s.title,
    bodyMarkdown: s.body,
    keyPoints: extractKeyPoints(s.body, s.title),
    commands: extractCommands(s.body),
  }));
}

function parseGlossary(md) {
  const terms = [];
  const parts = md.split(/\n###\s+/).slice(1);
  for (const part of parts) {
    const lines = part.split('\n');
    const term = lines[0].trim();
    const category = part.match(/\*\*Category:\*\*\s*(.+)/)?.[1]?.trim() || '';
    const meaning = part.match(/\*\*What it actually means:\*\*\s*(.+)/)?.[1]?.trim()
      || part.match(/\*\*What people say:\*\*\s*(.+)/)?.[1]?.trim() || '';
    const why = part.match(/\*\*Why it matters:\*\*\s*(.+)/)?.[1]?.trim() || '';
    const related = (part.match(/\*\*Related terms:\*\*\s*(.+)/)?.[1] || '')
      .split(',').map((s) => s.trim()).filter(Boolean);
    if (term) terms.push({ term, category, meaning, why, related });
  }
  return terms;
}

function main() {
  const phasesDir = path.join(SOURCE, 'phases');
  if (!fs.existsSync(phasesDir)) {
    console.error('Source phases/ not found at', phasesDir);
    process.exit(1);
  }
  fs.rmSync(OUT_LESSONS, { recursive: true, force: true });
  fs.mkdirSync(OUT_LESSONS, { recursive: true });

  const phases = fs.readdirSync(phasesDir).filter((d) => fs.statSync(path.join(phasesDir, d)).isDirectory() && /^\d/.test(d)).sort();
  const index = [];
  let lessonCount = 0;

  for (const phase of phases) {
    const phaseDir = path.join(phasesDir, phase);
    const lessons = fs.readdirSync(phaseDir).filter((d) => fs.statSync(path.join(phaseDir, d)).isDirectory() && /^\d/.test(d)).sort();
    for (const lesson of lessons) {
      const enPath = path.join(phaseDir, lesson, 'docs', 'en.md');
      if (!fs.existsSync(enPath)) continue;
      const md = fs.readFileSync(enPath, 'utf8');
      const metaInfo = parseFrontMeta(md);
      const slides = buildSlides(md);
      const outDir = path.join(OUT_LESSONS, phase, lesson);
      fs.mkdirSync(outDir, { recursive: true });
      fs.copyFileSync(enPath, path.join(outDir, 'en.md'));

      const zhExists = fs.existsSync(path.join(phaseDir, lesson, 'docs', 'zh.md'));
      if (zhExists) {
        fs.copyFileSync(path.join(phaseDir, lesson, 'docs', 'zh.md'), path.join(outDir, 'zh.md'));
      }

      const meta = {
        id: `${phase}/${lesson}`,
        slug: lesson,
        phase,
        order: Number(lesson.split('-')[0]) || 0,
        phaseOrder: Number(phase.split('-')[0]) || 0,
        title: { en: metaInfo.title, zh: '' },
        hook: metaInfo.hook,
        type: metaInfo.type,
        languages: metaInfo.languages,
        prerequisites: metaInfo.prerequisites,
        timeMinutes: metaInfo.timeMinutes,
        needsTranslation: !zhExists,
      };
      fs.writeFileSync(path.join(outDir, 'meta.json'), JSON.stringify(meta, null, 2) + '\n');
      fs.writeFileSync(path.join(outDir, 'slides.json'), JSON.stringify(slides, null, 2) + '\n');
      index.push(meta);
      lessonCount++;
    }
    // phase readme title
  }

  fs.writeFileSync(path.join(OUT_LESSONS, 'index.json'), JSON.stringify(index, null, 2) + '\n');

  // glossary
  fs.mkdirSync(OUT_GLOSSARY, { recursive: true });
  const termsPath = path.join(SOURCE, 'glossary', 'terms.md');
  if (fs.existsSync(termsPath)) {
    const terms = parseGlossary(fs.readFileSync(termsPath, 'utf8'));
    fs.writeFileSync(path.join(OUT_GLOSSARY, 'en.json'), JSON.stringify(terms, null, 2) + '\n');
  }

  // phases summary
  const phaseSummaries = phases.map((p) => {
    const lessonsIn = index.filter((l) => l.phase === p);
    const readme = path.join(phasesDir, p, 'README.md');
    let blurb = '';
    if (fs.existsSync(readme)) {
      const r = fs.readFileSync(readme, 'utf8');
      blurb = r.match(/^>\s+(.+)$/m)?.[1]?.trim() || r.split('\n').find((l) => l.trim() && !l.startsWith('#'))?.trim() || '';
    }
    return {
      id: p,
      order: Number(p.split('-')[0]) || 0,
      title: {
        en: p.replace(/^\d+-/, '').split('-').map((w) => w[0].toUpperCase() + w.slice(1)).join(' '),
        zh: '',
      },
      blurb,
      lessonCount: lessonsIn.length,
    };
  });
  fs.writeFileSync(path.join(OUT_LESSONS, 'phases.json'), JSON.stringify(phaseSummaries, null, 2) + '\n');

  console.log(`Imported ${lessonCount} lessons across ${phases.length} phases → content/lessons`);
  console.log(`Glossary terms: ${fs.existsSync(path.join(OUT_GLOSSARY, 'en.json')) ? JSON.parse(fs.readFileSync(path.join(OUT_GLOSSARY, 'en.json'))).length : 0}`);
  console.log(`Needing translation (zh): ${index.filter((l) => l.needsTranslation).length}`);
}

main();
