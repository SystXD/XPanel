import { Listener } from "#/lib/structures";
import { Channel } from "amqplib";
import type Docker from 'dockerode';
import type { IPterodactylEgg } from '#lib/interface/egg.interface'
export class CreateServerListener extends Listener<IPterodactylEgg> {
    public queueName = 'xpanel_server_create';
    public description = 'Handles Game-server Creation Queue';
    public routingKey = 'server.actions.create';

    public async run(channel: Channel, docker: Docker, content: IPterodactylEgg): Promise<void> {
        for await (const image of content.docker_images.values()) await docker.pull(image);

        
    }
}