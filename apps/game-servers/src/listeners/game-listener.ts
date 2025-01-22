import { Channel } from "amqplib";
import { consumeQueueAsync } from "../../../shared/shared-dist/rabbit/promise";
import type Docker from 'dockerode'
export async function createServer(channel: Channel, docker:Docker) {
   const content = await consumeQueueAsync(channel, "xpanel-server-create");
   try {
     // will continue later...
   } catch (error) {
    
   }
}
