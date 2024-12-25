import express from "express"
// import bodyParser from "body-parser";

import { connectToDatabase } from "./db/db.js";
import eventRoutes from "./routes/event.routes.js"

const app = express();
app.use(express.json())

//api
app.use("/api/v3/app", eventRoutes)

const PORT = 3000
app.listen(PORT, () => {
    connectToDatabase()
    console.log(`API is running on http://localhost:${PORT}`);
})