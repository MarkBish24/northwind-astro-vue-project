import express from "express";
import cors from "cors";
import routes from "./routes.js";

const app = express();
const PORT = 4000;

app.use(cors());
app.use(express.json());
app.use("/api/v1", routes);

app.listen(PORT, () => {
  console.log(`API server listening on http://localhost:${PORT}`);
});
