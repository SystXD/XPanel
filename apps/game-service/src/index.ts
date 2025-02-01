import Docker from "dockerode";
import "dotenv/config";
import app from "./app";
import { RabbitHandler } from "./handlers/rabbit-handler";
import path from "path";
import colors from "../../../packages/shared/shared-dist/color";
import {
  attachDocker,
  attachRabbit,
  initRabbitMQ,
  pingDocker,
} from "#/lib/utils";
import { Channel } from "amqplib";
const docker = new Docker({
  socketPath: process.env.SOCKET_PATH,
});

const rabbit = new RabbitHandler({
  path: path.join(__dirname, "listeners"),
  docker,
});

(async () => {
  await pingDocker(docker);
  await initRabbitMQ(rabbit);
  attachDocker(app, docker);
  attachRabbit(app, rabbit.channel as Channel);
  app.listen(2300, () =>
    console.log(colors.green(`The game-microservice Launched`))
  );
})();
