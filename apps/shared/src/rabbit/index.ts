import type { Channel } from "amqplib";

export function publishToQueue(
  channel: Channel,
  queue: string,
  message: string,
  callback: (err: any, result: string | null) => void
): void {
  try {
    channel.assertQueue(queue, { durable: true }).then(() => {
      const success = channel.sendToQueue(
        queue,
        Buffer.from(JSON.stringify(message))
      );
      if (success) callback(null, `Message sent for ${queue}`);
    });
  } catch (error) {
    callback(error, null);
  }
}
