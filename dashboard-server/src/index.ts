import dotenv from "dotenv";
dotenv.config();
const PORT = process.env.PORT || 8888;

import express from "express";
import fs from "fs";
import path from "path";
import authMiddleware from "./middlewares/auth";

interface obj {
    [key:string]: any;
}

const app = express();
let messages: obj = [];

if(fs.existsSync(path.join(__dirname, 'data/messages.json'))) {
    messages = JSON.parse(fs.readFileSync(path.join(__dirname, 'data/messages.json'), 'utf-8') || '[]');
}

app.use(express.json());
app.get("/", (req, res) => {
    res.send('Server is live 🍵');
});

app.post('/get-info', authMiddleware, (req, res) => {
    const data  = req.body;
    messages.push(data);

    fs.writeFileSync(path.join(__dirname, 'data/messages.json'), JSON.stringify(messages, null, 4));

    res.sendStatus(200);
})

app.listen(PORT, () => {
    console.log(`listening on http://localhost:${PORT}`);
});
