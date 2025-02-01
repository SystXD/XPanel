export interface IPterodactylEgg {
    name: string;
    description?: string;
    author: string;
    meta: {
      version: string;
      game_version?: string;
      requires_game_build?: boolean;
      game_name?: string;
    };
    file_denylist: string[];
    features?: string[]
    startup: string;
    config: {
      files: {
        [key: string]: {
          parser: "json" | "yaml" | "properties" | "ini" | "xml";
          find: {
            key: string;
            default: string;
          }[];
        };
      };
      startup: {
        done: string[];
        userInteraction: string[];
      };
      stop: string;
      logs: {
        custom: boolean;
        location: string;
      };
    };
    scripts: {
      installation: {
        script: string;
        container: string;
        entrypoint: string;
      };
    };
    variables: GameServerVariable[];
    docker_images: Map<string, string>
  }
  
  interface GameServerVariable {
    name: string;
    description: string;
    env_variable: string;
    default_value: string;
    user_viewable: boolean;
    user_editable: boolean;
    rules: string;
    field_type?: "text" | "number" | "port" | "string" | "boolean" | "select";
  }