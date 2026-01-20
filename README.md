# bun-static

Build a static site from markdown files.

## Requirements

This project is written in TypeScript without any build-to-JavaScript step. It is done with **[Bun](https://bun.com)**. Install bun from [here](https://bun.com/docs/installation).

Bun is an all-in-one toolkit for developing modern JavaScript/TypeScript applications. It also runs `ts` file directly.

1. Install the dependency:

```bash
bun install
```

2. Run the app:

```bash
bun run app.ts
```

## Project Structure

All the application code is in `app.ts`.

The markdown contents should be in `site` directory. The directory tree in `site` will be used to create the same directory tree in `.build` directory with `.html` files.
