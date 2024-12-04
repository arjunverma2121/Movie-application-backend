import express from "express";
import { connectToDatabase } from "./utils/database.js";
import { config as dotenvConfig } from "dotenv";
import cookieParser from "cookie-parser";
import userRoute from "./Routes/userRouter.js";
import cors from "cors";

dotenvConfig();
const app = express();
const port = process.env.PORT;
const host = process.env.HOST;

const allowedOrigins = [
  "http://localhost:3000",
  "https://movie-application-8clpbg267-7985575255s-projects.vercel.app",
  "http://192.168.252.10:5000",
  "http://192.168.252.10:3000",
];

app.use(
  cors({
    origin: (origin, callback) =>
      callback(null, allowedOrigins.includes(origin) || !origin),
    credentials: true,
  })
);

app.set("view engine", "pug");
app.set("views", "./views");

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cookieParser());

//API
app.use("/api/user", userRoute);

(async () => {
  try {
    await connectToDatabase();
    console.log("Database connection successful!");

    app.listen(port, () => {
      console.log(`Server is running on port ${port}`);
    });
  } catch (error) {
    console.error("Failed to start the server:", error);
    process.exit(1); // Exit if the database connection fails
  }
})();
