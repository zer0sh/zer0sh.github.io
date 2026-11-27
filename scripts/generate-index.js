#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

const postsDir = path.join('public/blog-posts');
const indexPath = path.join(postsDir, 'index.json');

const files = fs.readdirSync(postsDir)
  .filter(f => f.endsWith('.md'))
  .sort();

const posts = files.map(file => {
  const content = fs.readFileSync(path.join(postsDir, file), 'utf8');
  const frontmatter = content.match(/^---\n([\s\S]*?)\n---/);

  if (!frontmatter) return null;

  const fm = frontmatter[1];
  const extract = (key) => {
    const m = fm.match(new RegExp(`^${key}:\\s*"([^"]+)"`, 'm'));
    return m ? m[1] : null;
  };

  const slug = file.replace(/\.md$/, '');
  const cleanContent = content.replace(/^---[\s\S]*?---\n/, '');
  const words = cleanContent.split(/\s+/).filter(Boolean).length;
  const readingTime = Math.max(1, Math.ceil(words / 200));

  const entry = {
    slug,
    title: extract('title') || slug,
    date: extract('date') || '0000-00-00',
    category: extract('category') || 'General',
    excerpt: extract('excerpt') || '',
    readingTime,
  };

  const cover = extract('coverImage');
  const coverAlt = extract('coverAlt');
  if (cover) entry.coverImage = cover;
  if (coverAlt) entry.coverAlt = coverAlt;

  return entry;
}).filter(Boolean);

// Sort by date descending
posts.sort((a, b) => b.date.localeCompare(a.date));

fs.writeFileSync(indexPath, JSON.stringify({ posts }, null, 2) + '\n');
console.log(`Index generado: ${posts.length} posts en ${indexPath}`);
