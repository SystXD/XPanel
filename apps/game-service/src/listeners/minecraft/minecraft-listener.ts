import { Listener } from "#/lib/structures";

export const MCListener = new Listener(
  {
    data: {
      queueName: "xpanel-minecraft-create",
      description: "Create an MC Docker Instance",
    },
  },
  async (channel, docker, content) => {}
);
