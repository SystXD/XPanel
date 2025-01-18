import { type Channel, connect, type Connection } from "amqplib";
import colors from "../color";
export async function connectRabbit(): Promise<{
  connection: Connection;
  channel: Channel;
} | null> {
  try {
    const connection = await connect("amqp://localhost");
    const channel = await connection.createChannel();
    return {
      connection,
      channel,
    };
  } catch (error) {
    console.error(colors.red(`Error connection to RabbitMQ`), error);
    return null;
  }
}

export async function publishToQueueAsync(
  channel: Channel,
  queue: string,
  message: string
): Promise<boolean | null> {
  try {
    await channel.assertQueue(queue, { durable: true });
    const success = channel.sendToQueue(
      queue,
      Buffer.from(JSON.stringify(message))
    );
    return success;
  } catch (error) {
    console.error(colors.red(`Error connection to RabbitMQ`), error);
    return null;
  }
}

export async function consumeQueueAsync(
  channel: Channel,
  queue: string,
  callback?: (err: any, result: string | null) => void
): Promise<void> {
  try {
    await channel.assertQueue(queue, { durable: true });
    channel.consume(queue, (msg) => {
      if (msg) {
        try {
          channel.ack(msg);
          const content = JSON.stringify(msg.content.toString());
          return callback?.(null, content);
        } catch (error) {
          channel.nack(msg);
          console.error(colors.red(`Error Parsing Queue Message`), error);
          return callback?.(error, null);
        }
      }
    });
  } catch (error) {
    console.error(colors.red(`Error consuming Queue`), error);

    return;
  }
}
