import type { Channel, Connection } from "amqplib";

export interface RabbitConnection {
    connection: Connection;
    channel: Channel
}