// Renders 1088x1920 with HyperFrames, then crops to 1080x1920 (width bug workaround).
import { execFileSync } from "node:child_process";
import { mkdirSync, unlinkSync } from "node:fs";
import { ROOT } from "./theme.mjs";

mkdirSync(`${ROOT}/out`, { recursive: true });
const run = (cmd, args) => execFileSync(cmd, args, { cwd: ROOT, stdio: "inherit", shell: process.platform === "win32" && cmd === "pnpm" });
run("pnpm", ["exec", "hyperframes", "render", "--output", "out/raw.mp4"]);
run("ffmpeg", ["-y", "-v", "error", "-i", "out/raw.mp4", "-vf", "crop=1080:1920:0:0", "-c:v", "libx264", "-crf", "14", "-preset", "slow", "-pix_fmt", "yuv420p", "-r", "30", "out/chat-social-ui.mp4"]);
unlinkSync(`${ROOT}/out/raw.mp4`);
