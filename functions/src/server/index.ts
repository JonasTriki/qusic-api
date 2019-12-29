import express from "express";
import cors from "cors";
import morgan from "morgan";
import routes from "./routes";

const app = express();

// Setup middlewares
app.use(cors({ credentials: true, origin: "http://localhost:3000" }));
app.use(morgan("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Routes
app.use(routes);

export default app;