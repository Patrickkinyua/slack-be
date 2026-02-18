import express from "express";
import dotenv from "dotenv";
import { connectDB } from "./config/db.config.js";
import { clerkMiddleware } from "@clerk/express";
import chatRoutes from "./routes/chat.route.js"
import { functions, inngest } from "./config/inngest.config.js";
import { serve } from "inngest/express";

dotenv.config();

const PORT = process.env.PORT || 5001;

const app = express();

app.use(clerkMiddleware());
app.use(express.json());

// ✅ FIX: use the inngest INSTANCE
app.use(
  "/api/inngest",
  serve({
    client: inngest,
    functions,
  })
);


app.use("/api/chat", chatRoutes)


app.get("/", (req, res) => {
  res.send("hello world");
});

const startServer = async () => {
  try {
    await connectDB();

    if (process.env.NODE_ENV !== "PRODUCTION") {
      app.listen(PORT, () =>
        console.log(`Server running on port ${PORT}`)
      );
    }
  } catch (error) {
    console.log(error.message, "error starting the server");
    process.exit(1);
  }
};

startServer();

export default app;
