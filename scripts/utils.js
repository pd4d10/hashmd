// @ts-check
import fs from "fs-extra";
import path from "path";
import { fileURLToPath } from "url";

// https://stackoverflow.com/a/50052194
const __dirname = path.dirname(fileURLToPath(import.meta.url));

export const rootDir = path.resolve(__dirname, "..");

export const packagesDir = path.join(rootDir, "packages");
export const packages = fs.readdirSync(packagesDir);
