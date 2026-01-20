import { file } from "bun";
import { micromark } from "micromark";

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
  const rootFile = file("./site/index.md");
  console.log(
    HTML_TEMPLETE.replace("<!-- Body -->", micromark(await rootFile.text())),
  );
}

await main();
