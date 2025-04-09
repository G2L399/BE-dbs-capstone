import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const args = process.argv.slice(2);

if (args.length < 2) {
  console.error("Usage: node create-route.js <method> <path>");
  process.exit(1);
}

const [method, routePath] = args;

// Create folder structure
const dirPath = path.join(__dirname, "src", method.toUpperCase(), routePath);
fs.mkdirSync(dirPath, { recursive: true });

// Create app.ts file
const filePath = path.join(dirPath, "app.ts");
fs.writeFileSync(
  filePath,
  `export default (request, h) => {
    return \`${method.toUpperCase()} request to /${routePath}\`;
  };`
);

console.log(`Route created: ${method.toUpperCase()} /${routePath}`);
