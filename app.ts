import { micromark } from "micromark";
import { rm } from "node:fs/promises";
import { mkdir, readdir, stat, readFile } from "node:fs/promises";
import { resolve } from "node:path";

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
  const dirName = ".build";
  const buildDir = resolve(CWD, dirName);

  await readdir(buildDir)
    .then(async () => {
      await cleanUpBuildDir(buildDir)
        .then(() => {
          transpile(SITE_DIR);
        })
        .catch(() => {
          console.log(`❌ Failed to clean up ${dirName}`);
        });
    })
    .catch(async () => {
      console.log(`❗ No ${dirName} dir found.`);
      await mkdir(buildDir)
        .then(() => {
          console.log(`✅ ${dirName} is created!`);
        })
        .catch(() => {
          throw new Error(`❌ Failed to create ${dirName}`);
        });
    });
}

async function transpile(sourceDir: string) {
  const siteFiles = await readdir(sourceDir);

  siteFiles.forEach(async (file) => {
    const filePath = resolve(sourceDir, file);

    const fileState = await stat(filePath);
    if (fileState.isDirectory()) {
      transpile(filePath);
    } else {
      const htmlContent = HTML_TEMPLETE.replace(
        "<!-- Body -->",
        micromark(await readFile(filePath, "utf-8")),
      );
      console.log(htmlContent);
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
