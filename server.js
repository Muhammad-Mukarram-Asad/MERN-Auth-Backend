import express from "express";
import dotenv from "dotenv";
import userRoutes from "./routes/userRoutes.js";
import { notFound, errorHandler } from "./middleware/errorMiddleware.js";
import connecToDB from "./config/db.js";
import cookieParser from "cookie-parser";
import path from "express";

dotenv.config();

const port = process.env.PORT || 5000;

const app = express();

connecToDB();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use("/api/users", userRoutes);

if(process.env.NODE_ENV === "production"){
  const __dirName = path.resolve();
  app.use(express.static(path.join(__dirName + "/frontend/dist")));

  app.get("*", (req, res) => {
    res.sendFile(path.resolve(__dirName, "frontend", "dist", "index.html"));
  });
}

else
{
  app.get("/", (req, res) => {
    res.send("Server is ready to use!");
  });
}


// These below two middlewares are for showing our custom error message instead of html page which is by
// default shown when any async error comes in and for showing 404 page if url is wrong
app.use(notFound);
app.use(errorHandler);

app.listen(port, () => {
  console.log("Server is listening on port " + port);
});
