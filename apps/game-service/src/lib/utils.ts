import fs, { Dirent } from "fs";
import type { Application, NextFunction, Request, Response } from "express";
import path from "path";
import colors from "../../../../packages/shared/shared-dist/color";
import { Channel } from "amqplib";
import Docker from "dockerode";
import { RabbitHandler } from "#/handlers/rabbit-handler";
export const getFiles = (
  dir: string,
  nested?: boolean,
  filter?: (f: Dirent) => boolean
): string[] => {
  const filesInfo: string[] = [];
  const folders = fs
    .readdirSync(dir, { withFileTypes: true })
    .filter((f) => filter?.(f));

  folders.forEach((folder) => {
    const folderPath = path.join(dir, folder.name);
    if (folder.isDirectory() && nested) {
      filesInfo.push(...getFiles(folderPath, nested));
    } else if (folder.isFile()) {
      filesInfo.push(folderPath);
    }
  });

  return filesInfo;
};

export const attachRabbit = (app: Application, channel: Channel) => {
  return app.set("rabbit", channel);
};

export const attachDocker = (app: Application, docker: Docker) => {
  return app.set("docker", docker);
};

export const pingDocker = async (docker: Docker) => {
  try {
    await docker.ping();
  } catch (error) {
    console.error(colors.red("Unable to connect to Docker"), error);
    process.exit(1);
  }
};
export const initRabbitMQ = async (rabbit: RabbitHandler) => {
   await rabbit.init();
  if (!rabbit.connection || !rabbit.channel) {
    console.error(colors.red("RabbitMQ connection failed"));
    process.exit(1);
  }
};

export const catchAsync =
  (
    callback: (req: Request, res: Response, next: NextFunction) => Promise<void>
  ) =>
  (req: Request, res: Response, next: NextFunction) =>
    Promise.resolve(callback(req, res, next)).catch(next);

export async function checkAvailability(
  port: number,
  docker: Docker
): Promise<boolean> {
  const containers = await docker.listContainers();
  return containers.every(
    (container) => !(container.Ports || []).some((p) => p.PrivatePort === port)
  );
}
export const getPort = async (docker: Docker): Promise<number> => {
  let randomPort = Math.floor(Math.random() * (65535 - 1024 + 1)) + 1024;
  let available = await checkAvailability(randomPort, docker);

  while (!available) {
    randomPort = Math.floor(Math.random() * (65535 - 1024 + 1)) + 1024;
    available = await checkAvailability(randomPort, docker);
  }

  return randomPort;
};
