import { IPterodactylEgg } from "#lib/interface/egg.interface";
export class Eggs {
  static isValidEGG(body: Record<string, any>): body is IPterodactylEgg {
    const {
      name,
      author,
      description,
      docker_images,
      variables,
      meta,
      config,
      startup,
      scripts,
    } = body;

    if (meta?.version) return false;
    if (!name || typeof name !== "string") return false;
    if (!description || typeof description !== "string") return false;
    if (!author || typeof author !== "string") return false;
    if (!startup || typeof author !== "string") return false;
    if (!Array.isArray(docker_images) || docker_images.length === 0)
      return false;
    if (!Array.isArray(variables) || variables.length === 0) return false;
    if (
      !scripts.installations.script ||
      !scripts.installations.container ||
      !scripts.installations.bash
    )
      return false;
    if (!config.startup) return false;
    if (!config.stop || typeof config.stop !== "string") return false;

    for (const v of variables)
      if (!v.name || !v.env_variable || !v.rules) return false;

    return true;
  }
}
