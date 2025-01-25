import { Channel } from "amqplib";
import colors from "../../../shared/shared-dist/color";
import { connectRabbit } from "../../../shared/shared-dist/rabbit/promise";
import { getFiles } from "../lib/utils";
import { Listener } from "../lib/structures";
import type Docker from "dockerode";

export class RabbitHandler {
  public path: string;
  public docker: Docker;

  constructor({ path, docker }: { path: string; docker: Docker }) {
    this.path = path;
    this.docker = docker;
  }

  async init(): Promise<void> {
    try {
      console.log(colors.blue(`Initializing RabbitMQ handler...`));
      if (this.path && this.docker) await this.#getAsyncQueue();
    } catch (error) {
      console.error(colors.red(`Failed to initialize RabbitHandler.`), error);
    }
  }
  async #getAsyncQueue(): Promise<void> {
    try {
      const response = await connectRabbit();
      if (!response) return;
      const files = getFiles(this.path, true, (f) => f.name.endsWith(".js"));
      for (const file of files) {
        const loaderFile = require(file);
        const loaders = Object.values(loaderFile).filter(
          (f) => f instanceof Listener
        );
        for (const loader of loaders) {
          await this.#consumeQueueAsync(
            response.channel,
            loader.queueName,
            loader
          );
        }
      }
    } catch (error) {
      console.error(colors.red(`Error initializing Rabbit queues`), error);
    }
  }

  async #consumeQueueAsync(
    channel: Channel,
    queue: string,
    file: Listener
  ): Promise<void> {
    try {
      await channel.assertQueue(queue, { durable: true });
      channel.consume(queue, async (msg) => {
        if (msg) {
          try {
            const content = JSON.parse(msg.content.toString());
            await file.run(channel, this.docker, content);
            channel.ack(msg);
          } catch (error) {
            channel.nack(msg, false, true);
            console.error(colors.red(`Error Executing Queue Message: `), error);
          }
        } else {
          console.warn(colors.yellow(`Recevied an Empty Queue`));
        }
      });
    } catch (error) {
      console.error(colors.red(`Error consuming Queue: `), error);
    }
  }
}
