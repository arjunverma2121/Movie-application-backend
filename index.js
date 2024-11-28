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
const corsOptions = {
    origin: "*", // Allow all origins
    credentials: true, // Allow cookies and credentials
};
app.use(cors(corsOptions))


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

    app.listen( port, () => {
      console.log(`Server is running on port ${port}`);
    });
  } catch (error) {
    console.error("Failed to start the server:", error);
    process.exit(1); // Exit if the database connection fails
  }
})();
