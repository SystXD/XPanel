import express from "express";
import { rabbitMiddleware } from "#middlewares/rabbit.middleware";
import { errorMiddleware } from "./middlewares/catchError.middleware";

const app = express();

app.use(rabbitMiddleware);
app.use(errorMiddleware);
export default app;
