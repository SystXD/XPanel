import { Channel } from "amqplib";
import type Docker from 'dockerode'
import { ListenerOptions } from "./types";
export class Listener {
    public queueName: string;
    public description: string;
    public run: (channel:Channel, docker: Docker, content: Record<string, any>) => Promise<void>;
    constructor(options: ListenerOptions, run: (channel:Channel, docker: Docker, content: Record<string, any>) => Promise<void>){
        this.queueName = options.data.queueName;
        this.description = options.data.description;
        this.run = run;
    }
}