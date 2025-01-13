import { Channel, connect, Connection, ConsumeMessage, Message } from "amqplib";
let connection: Connection | null;
let channel: Channel | null;
export async function connectRabbit() {
  connection = await connect("amqp://localhost");
  channel = await connection.createChannel();
  return {
    connection,
    channel,
  };
}

export function subscribeToQueue(
  queueName: string,
  callback: (err: any, data: ConsumeMessage | null) => Promise<void>
) {
  if (!channel)
    connectRabbit().then((keys) => {
      try {
        keys.channel.assertQueue(queueName);
        keys.channel.consume(queueName, (msg) => {
          callback(null, msg);
          channel?.ack(msg as Message);
        });
      } catch (error) {
        callback(error, null);
      }
    });
}
