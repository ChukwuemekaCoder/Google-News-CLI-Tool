# 📰 Google News CLI Tool

An interactive Node.js command-line application that fetches the latest news from Google News.

## What Was Done

1. **Initialized Project** — Created `package.json` using Modern ES Modules.
2. **Installed Dependencies** — Installed `rss-parser` using a localized cache to bypass permission issues.
3. **Implemented Entrypoint** — Created `cli.js` with argument parsing, relative timestamp formatting, and ANSI terminal color styling.

## Key Features

- **General Feed** — Fetches top headlines by default.
- **Search Query** — Search for news on specific topics with `-s`.
- **Topic Filtering** — Browse categories: `world`, `nation`, `business`, `technology`, `entertainment`, `sports`, `science`, `health`.
- **Limits** — Control the number of results (default: 10, max: 50).
- **Relative Timestamps** — Displays readable times like `5m ago`, `2h ago`, `3d ago`.

## Installation

```bash
npm install
```

For global CLI usage:

```bash
npm link
```

## Usage

```bash
# Top headlines
node cli.js

# Filter by topic with a limit
node cli.js --topic technology --limit 3

# Search for specific news
node cli.js --search "AI coding agents"

# After npm link
google-news --topic business
```

## Options

| Flag | Alias | Description |
|------|-------|-------------|
| `--search <query>` | `-s` | Search for articles by keyword |
| `--topic <topic>` | `-t` | Filter by topic category |
| `--limit <number>` | `-n` | Number of articles to show (default: 10, max: 50) |
| `--help` | `-h` | Show help message |
