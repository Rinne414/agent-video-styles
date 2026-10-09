import { Config } from "@remotion/cli/config";

Config.setRspack(true);
// png frames: yuv420p output for the mp4 and a requirement for alpha in the .mov
Config.setVideoImageFormat("png");
Config.setOverwriteOutput(true);
