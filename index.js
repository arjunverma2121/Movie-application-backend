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
  "http://localhost:3000", // Local development
  "https://movie-application-8clpbg267-7985575255s-projects.vercel.app" // Your Vercel frontend
];

// CORS configuration
const corsOptions = {
  origin: (origin, callback) => {
      if (!origin || allowedOrigins.includes(origin)) {
          callback(null, true); 
      } else {
          callback(new Error("Not allowed by CORS")); 
      }
  },
  credentials: true, 
};

app.use(cors(corsOptions));


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
