import { Config } from "@remotion/cli/config";

Config.setRspack(true);
// png frames give a plain yuv420p mp4 (jpeg would yield yuvj420p)
Config.setVideoImageFormat("png");
Config.setOverwriteOutput(true);
