import { Channel, Connection, ConsumeMessage } from "amqplib";
import colors from "../../../../packages/shared/shared-dist/color";
import { connectRabbit } from "../../../../packages/shared/shared-dist/rabbit/promise";
import { getFiles } from "../lib/utils";
import { Listener } from "../lib/structures";
import type Docker from "dockerode";
import { ListenerConstructor } from "#/lib/types";

type MessageContent = Record<string, any>;

export class RabbitHandler {
  public path: string;
  public docker: Docker;
  public connection?: Connection;
  public channel?: Channel;

  constructor({ path, docker }: { path: string; docker: Docker }) {
    this.path = path;
    this.docker = docker;
  }

  async init(): Promise<void> {
    try {
      console.log(colors.blue(`Initializing RabbitMQ handler...`));
      if (this.path && this.docker) {
        await this.#getAsyncQueue();
      }
    } catch (error) {
      console.error(colors.red(`Failed to initialize RabbitHandler.`), error);
    }
  }

  async #getAsyncQueue(): Promise<void> {
    try {
      const response = await connectRabbit();
      if (!response) return;
      this.channel = response.channel;
      this.connection = response.connection;
      await this.channel.assertExchange("server_actions", "topic", {
        durable: true,
      });
      const files = getFiles(this.path, true, (f) => f.name.endsWith(".js"));
      for (const file of files) {
        const loaderFile = require(file);
        const loaders = Object.values(loaderFile) as ListenerConstructor[];
        await Promise.all(
          loaders.map(async (LoaderClass) => {
            const loader = new LoaderClass();
            await this.#consumeQueueAsync(
              response.channel,
              loader.queueName,
              loader
            );
          })
        );
      }
    } catch (error) {
      console.error(colors.red(`Error initializing Rabbit queues`), error);
    }
  }

  async #consumeQueueAsync(
    channel: Channel,
    queue: string,
    file: Listener<MessageContent>
  ): Promise<void> {
    try {
      await channel.assertQueue(queue, { durable: true });
      await channel.prefetch(
        process.env.LOAD_PER_QUEUE ? +process.env.LOAD_PER_QUEUE : 1
      );
      await channel.bindQueue(queue, "server_actions", file.routingKey);
      channel.consume(queue, async (msg: ConsumeMessage | null) => {
        if (msg) {
          try {
            const content: MessageContent = JSON.parse(msg.content.toString());
            await file.run(channel, this.docker, content);
            channel.ack(msg);
          } catch (error) {
            channel.nack(msg, false, true);
            console.error(colors.red(`Error Executing Queue Message: `), error);
          }
        } else {
          console.warn(colors.yellow(`Received an Empty Queue`));
        }
      });
    } catch (error) {
      console.error(colors.red(`Error consuming Queue: `), error);
    }
  }
}
