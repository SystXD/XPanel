import { Channel, Connection, ConsumeMessage } from "amqplib";
export declare function connectRabbit(): Promise<{
    connection: Connection;
    channel: Channel;
}>;
export declare function subscribeToQueue(queueName: string, callback: (err: any, data: ConsumeMessage | null) => Promise<void>): void;
//# sourceMappingURL=rabbit.d.ts.map