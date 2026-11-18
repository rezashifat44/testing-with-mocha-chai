import fs from "fs";
import path from "path";
import dotenv from "dotenv";

const envPath = path.resolve(process.cwd(), ".env");

// Write (or update) a key in the .env file and in process.env
export function setEnvValue(key, value) {
    const content = fs.existsSync(envPath) ? fs.readFileSync(envPath, "utf8") : "";
    const line = `${key} = "${value}"`;
    const regex = new RegExp(`^\\s*${key}\\s*=.*$`, "m");

    const updated = regex.test(content)
        ? content.replace(regex, () => line)
        : content + (content.endsWith("\n") || content === "" ? "" : "\n") + line + "\n";

    fs.writeFileSync(envPath, updated);
    process.env[key] = value;
}

// Read the latest value of a key directly from the .env file
export function getEnvValue(key) {
    if (!fs.existsSync(envPath)) return undefined;
    return dotenv.parse(fs.readFileSync(envPath))[key];
}
