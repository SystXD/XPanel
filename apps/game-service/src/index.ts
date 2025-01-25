import Docker from "dockerode";
import "dotenv/config";
import { RabbitHandler } from "./handlers/rabbit-handler";
import path from "path";
const docker = new Docker({
  socketPath: process.env.SOCKET_PATH,
});

const rabbit = new RabbitHandler({
  path: path.join(__dirname, "listeners"),
  docker,
});
(async () => await rabbit.init())()
