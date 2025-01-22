import { connectRabbit } from "../../shared/shared-dist/rabbit/promise";
import Logger from "../../shared/shared-dist/logger";
import colors from "../../shared/shared-dist/color";
import Docker from "dockerode";
import fs from "fs";
import path from "path";

const docker = new Docker({
  host: process.env.DOCKER_HOST || "http://localhost",
  port: process.env.DOCKER_PORT || 2375,
});

const basePath = path.join(__dirname, "listeners");
(async () =>
  await connectRabbit()
    .then(async (response) => {
      const files = fs
        .readdirSync(basePath, { withFileTypes: true })
        .filter((f) => f.isFile());

      for (const file of files) {
        const targetFile = require(path.join(basePath, file.name));
        const loaders = Object.values(targetFile).filter(
          (f) => typeof f === "function"
        );
        for (const loader of loaders)
          await loader.call(this, response?.channel, docker);
      }
      console.log(colors.green(`Connection Game-Microservice`));
    })
    .catch(Logger.error))();
