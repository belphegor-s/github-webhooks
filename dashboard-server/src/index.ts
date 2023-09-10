import dotenv from "dotenv";
dotenv.config();
const PORT = process.env.PORT || 8888;

import express from "express";
import fs from "fs";
import path from "path";
import authMiddleware from "./middlewares/auth";
import { obj } from "./types/global";

const app = express();
let messages: obj = [];

if(fs.existsSync(path.join(__dirname, 'data/messages.json'))) {
    messages = JSON.parse(fs.readFileSync(path.join(__dirname, 'data/messages.json'), 'utf-8') || '[]');
}

app.use(express.json());
app.get("/", (req, res) => {
    res.send('Server is live 🍵');
});

app.post('/git-info', authMiddleware, (req, res) => {
    const data  = req.body;
    messages.push(data);

    fs.writeFileSync(path.join(__dirname, 'data/messages.json'), JSON.stringify(messages, null, 4));

    res.sendStatus(200);
})

app.get('/get-git-info', (req, res) => {
    res.status(200).json(messages)
})

app.listen(PORT, () => {
    console.log(`listening on http://localhost:${PORT}`);
});
