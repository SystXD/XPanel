import app from "./app";
import { connectRabbit } from "../../shared/shared-dist/rabbit";

connectRabbit().then((success) =>
  app.listen(3100, () => console.log("User-Service Backend launched"))
);
