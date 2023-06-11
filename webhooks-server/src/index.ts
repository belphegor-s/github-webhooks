import dotenv from "dotenv";
dotenv.config();
const PORT = process.env.PORT || 8080;

import express from "express";
import cors from "cors";
import webhookRoutes from "./routes/webhooks";
const app = express();

app.use(express.json());
app.use(cors());

app.get("/", (req, res) => {
    res.send('Server is live 🍵');
});
app.use(webhookRoutes);

app.listen(PORT, () => {
    console.log(`listening on http://localhost:${PORT}`);
});
