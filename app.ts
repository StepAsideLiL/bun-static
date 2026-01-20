import { file } from "bun";

async function main() {
  const rootFile = file("./site/index.md");
  console.log(await rootFile.text());
}

await main();
