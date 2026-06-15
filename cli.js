#!/usr/bin/env node

import Parser from 'rss-parser';

const colors = {
  reset: '\x1b[0m',
  bold: '\x1b[1m',
  dim: '\x1b[2m',
  underline: '\x1b[4m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m',
  cyan: '\x1b[36m',
  white: '\x1b[37m'
};

const TOPICS = {
  world: 'WORLD',
  nation: 'NATION',
  business: 'BUSINESS',
  technology: 'TECHNOLOGY',
  entertainment: 'ENTERTAINMENT',
  sports: 'SPORTS',
  science: 'SCIENCE',
  health: 'HEALTH'
};

function printHelp() {
  console.log(`
${colors.bold}${colors.cyan}📰 Google News CLI${colors.reset}
A fast, light command-line tool to fetch the latest news from Google News.

${colors.bold}Usage:${colors.reset}
  google-news [options]
  node cli.js [options]

${colors.bold}Options:${colors.reset}
  -s, --search <query>  Search for articles matching the given query
  -t, --topic <topic>   Fetch articles for a specific topic. Supported topics:
                          ${colors.green}world, nation, business, technology,
                          entertainment, sports, science, health${colors.reset}
  -n, --limit <number>  Number of articles to display (default: 10, max: 50)
  -h, --help            Show this help message

${colors.bold}Examples:${colors.reset}
  node cli.js
  node cli.js --topic technology --limit 5
  node cli.js --search "AI agents"
`);
}

function parseArgs(args) {
  const options = {
    search: null,
    topic: null,
    limit: 10,
    help: false
  };

  for (let i = 0; i < args.length; i++) {
    const arg = args[i];
    if (arg === '-h' || arg === '--help') {
      options.help = true;
    } else if (arg === '-s' || arg === '--search') {
      options.search = args[++i] || null;
    } else if (arg === '-t' || arg === '--topic') {
      const topicVal = args[++i];
      if (topicVal) {
        options.topic = topicVal.toLowerCase();
      }
    } else if (arg === '-n' || arg === '--limit') {
      const val = parseInt(args[++i], 10);
      if (!isNaN(val) && val > 0) {
        options.limit = Math.min(val, 50);
      }
    }
  }
  return options;
}

function formatTime(dateStr) {
  try {
    const date = new Date(dateStr);
    const now = new Date();
    const diffMs = now - date;
    const diffMins = Math.floor(diffMs / 60000);
    if (diffMins < 1) return 'just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    const diffHrs = Math.floor(diffMins / 60);
    if (diffHrs < 24) return `${diffHrs}h ago`;
    const diffDays = Math.floor(diffHrs / 24);
    return `${diffDays}d ago`;
  } catch {
    return dateStr;
  }
}

function parseTitle(fullTitle) {
  const lastDash = fullTitle.lastIndexOf(' - ');
  if (lastDash !== -1) {
    const title = fullTitle.substring(0, lastDash).trim();
    const source = fullTitle.substring(lastDash + 3).trim();
    return { title, source };
  }
  return { title: fullTitle, source: '' };
}

async function main() {
  const args = process.argv.slice(2);
  const options = parseArgs(args);

  if (options.help) {
    printHelp();
    return;
  }

  let url = 'https://news.google.com/rss?hl=en-US&gl=US&ceid=US:en';
  let feedType = 'Top Stories';

  if (options.search) {
    const queryEncoded = encodeURIComponent(options.search);
    url = `https://news.google.com/rss/search?q=${queryEncoded}&hl=en-US&gl=US&ceid=US:en`;
    feedType = `Search results for "${options.search}"`;
  } else if (options.topic) {
    const topicKey = options.topic;
    const topicId = TOPICS[topicKey];
    if (topicId) {
      url = `https://news.google.com/rss/headlines/section/topic/${topicId}?hl=en-US&gl=US&ceid=US:en`;
      feedType = `Topic: ${topicKey.charAt(0).toUpperCase() + topicKey.slice(1)}`;
    } else {
      console.error(`${colors.red}${colors.bold}Error:${colors.reset} Invalid topic "${options.topic}".`);
      console.error(`Supported topics: ${Object.keys(TOPICS).join(', ')}`);
      process.exit(1);
    }
  }

  console.log(`\n${colors.cyan}⚡ Fetching ${colors.bold}${feedType}${colors.reset}${colors.cyan}...${colors.reset}\n`);

  const parser = new Parser();
  try {
    const feed = await parser.parseURL(url);
    const items = feed.items.slice(0, options.limit);

    if (items.length === 0) {
      console.log(`${colors.yellow}No news articles found.${colors.reset}\n`);
      return;
    }

    items.forEach((item, index) => {
      const { title, source } = parseTitle(item.title);
      const timeStr = formatTime(item.pubDate);
      const numberStr = `${index + 1}.`.padEnd(4);
      
      console.log(`${colors.bold}${colors.green}${numberStr}${colors.reset}${colors.bold}${title}${colors.reset}`);
      
      const metaParts = [];
      if (source) metaParts.push(`${colors.cyan}${source}${colors.reset}`);
      if (timeStr) metaParts.push(`${colors.yellow}${timeStr}${colors.reset}`);
      
      if (metaParts.length > 0) {
        console.log(`    ${metaParts.join(` ${colors.dim}•${colors.reset} `)}`);
      }
      
      if (item.link) {
        console.log(`    ${colors.dim}${colors.underline}${item.link}${colors.reset}`);
      }
      console.log(); // Blank line for spacing
    });

  } catch (error) {
    console.error(`${colors.red}${colors.bold}Error fetching news:${colors.reset} ${error.message}`);
    console.error(`Please make sure you are connected to the internet.\n`);
    process.exit(1);
  }
}

main();
