import { model, Schema } from "mongoose";

const EggSchema = new Schema(
  {
    name: { type: String, required: true },
    description: { type: String },
    author: { type: String, required: true, index: true },
    meta: {
      version: { type: String, required: true },
      game_version: { type: String },
      requires_game_build: { type: Boolean },
      game_name: { type: String },
    },
    file_denylist: [{ type: String }],
    features: [{ type: [String], default: [] }],
    startup: { type: String, required: true, index: true },
    config: {
      files: {
        type: Schema.Types.Mixed, 
        default: {},
      },
      startup: {
        done: { type: [String], default: [] },
        userInteraction: { type: [String], default: [] },
      },
      stop: { type: String, required: true },
      logs: {
        custom: { type: Boolean, required: true },
        location: { type: String, required: true },
      },
    },
    scripts: {
      installation: {
        script: { type: String, required: true },
        container: { type: String, required: true },
        entrypoint: { type: String, required: true },
      },
    },
    variables: [
      {
        name: { type: String, required: true },
        description: { type: String, required: true },
        env_variable: { type: String, required: true },
        default_value: { type: String, required: true },
        user_viewable: { type: Boolean, required: true },
        user_editable: { type: Boolean, required: true },
        rules: { type: String, required: true },
        field_type: {
          type: String,
          enum: ["text", "number", "port", "string", "boolean", "select"],
        },
      },
    ],
    docker_images: {
      type: Map,
      of: String,
    },
  },
  {
    timestamps: true,
  }
);
export const Egg = model("egg", EggSchema);
