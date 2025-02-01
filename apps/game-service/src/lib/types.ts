import { Listener } from "./structures";

export interface ListenerOptions {
    data: {
         queueName: string;
         description: string;
    }
}
export type ListenerConstructor = new () => Listener<Record<string, any>>;
