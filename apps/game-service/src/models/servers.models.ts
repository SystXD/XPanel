import { model, Schema } from "mongoose";

const serverSchema = new Schema(
    {
        ownerId: { type: Schema.Types.ObjectId, ref: "User" },
        containerID: { type: String, required: true },
        serverName: { type: String, default: "" }
    }, { timestamps: true }
)

serverSchema.pre('save', function (next){
    if (!this.serverName) this.serverName = `${this.ownerId} - Server`;
    next()
})

export const Server = model('server', serverSchema)