import { model, Schema } from "mongoose";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
const userSchema = new Schema(
  {
    userName: { type: String, required: true },
    email: { type: String, required: true, unique: true, index: true },
    password: { type: String, required: true },
    refreshToken: { type: String, required: false },
    isAdmin: { type: String, default: false },
    servers: [
      {
        game: {
          id: { type: String, default: crypto.randomUUID() },
          game: { type: String, required: false },
        },
      },
    ],
  },
  {
    timestamps: true,
    methods: {
      getAccessToken() {
        return jwt.sign(
          { _id: this._id, userName: this.userName, isAdmin: this.isAdmin },
          process.env.JWTUserSecret as string
        );
      },
      getRefreshToken() {
        return jwt.sign({ _id: this._id }, process.env.JWTUserSecret as string);
      },
    },
  }
).pre("save", async function (next) {
  if (!this.isModified(this.password)) return;
  this.password = await bcrypt.hash(this.password, 12);
  await this.save();
  next();
});

export const User = model("user", userSchema);
