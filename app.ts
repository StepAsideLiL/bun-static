import { micromark } from "micromark";
import { rm } from "node:fs/promises";
import { mkdir, readdir, stat, readFile, writeFile } from "node:fs/promises";
import { resolve, sep, dirname } from "node:path";

const CWD = process.cwd();
const SITE_DIR = resolve(CWD, "site");

const HTML_TEMPLETE = `<!DOCTYPE html>
<html lang="en">

<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>
    <!-- Title -->
  </title>
</head>

<body>
  <!-- Body -->
</body>

</html>`;

async function main() {
  await build();
}

async function build() {
  const buildDirName = ".build";
  const buildDirPath = resolve(CWD, buildDirName);

  await readdir(buildDirPath)
    .then(async () => {
      await cleanUpBuildDir(buildDirPath)
        .then(async () => {
          console.log(`✅ Cleaning up ${buildDirName} dir!`);

          await parsingMarkdownToHTML(SITE_DIR, buildDirPath)
            .then(() => {
              console.log(`✅ Markdown parsing completed!`);
            })
            .catch(() => {
              throw new Error(`❌ Markdown parsing failed`);
            });
        })
        .catch(() => {
          throw new Error(`❌ Failed to clean up ${buildDirName}`);
        });
    })
    .catch(async () => {
      await parsingMarkdownToHTML(SITE_DIR, buildDirPath)
        .then(() => {
          console.log(`✅ Markdown parsing completed!`);
        })
        .catch(() => {
          throw new Error(`❌ Markdown parsing failed`);
        });
    });
}

async function parsingMarkdownToHTML(sourceDir: string, buildDir: string) {
  const siteFiles = await readdir(sourceDir);

  siteFiles.forEach(async (file) => {
    const filePath = resolve(sourceDir, file);

    const fileState = await stat(filePath);
    if (fileState.isDirectory()) {
      parsingMarkdownToHTML(filePath, buildDir);
    } else {
      /**
       * TODOs
       * 1. check for .md file extension.
       */
      const htmlContent = HTML_TEMPLETE.replace(
        "<!-- Body -->",
        micromark(await readFile(filePath, "utf-8")),
      );
      const distPath = resolve(
        buildDir,
        filePath.replace(`${SITE_DIR}${sep}`, "").replace(".md", ".html"),
      );
      await mkdir(dirname(distPath), { recursive: true }).then(async () => {
        await writeFile(distPath, htmlContent, "utf-8");
      });
    }
  });
}

async function cleanUpBuildDir(buildDir: string) {
  const buildDirFiles = await readdir(buildDir);
  buildDirFiles.forEach(async (file) => {
    await rm(resolve(buildDir, file), { recursive: true }).catch(() => {
      throw new Error(`❌ Failed to remove ${file}`);
    });
  });
}

await main();
