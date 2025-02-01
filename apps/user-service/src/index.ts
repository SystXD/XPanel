import app from "./app";
import { connectRabbit } from "../../../packages/shared/shared-dist/rabbit/promise";

connectRabbit().then((success) =>
  app.listen(3100, () => console.log("User-Service Backend launched"))
);
