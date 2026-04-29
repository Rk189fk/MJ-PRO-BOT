const express = require('express');
const app = express();
const { default: makeWASocket, useMultiFileAuthState, delay, makeCacheableSignalKeyStore } = require("@whiskeysockets/baileys");
const pino = require("pino");
const fs = require("fs");

const PORT = process.env.PORT || 3000;

app.get('/', (req, res) => {
    res.send(`
    <html>
        <head>
            <title>MJ-PRO-BOT PAIRING</title>
            <style>
                body { background-color: #0b0b0b; color: white; font-family: sans-serif; text-align: center; padding-top: 50px; }
                input { padding: 10px; border-radius: 5px; border: 1px solid #9D00FF; background: #1a1a1a; color: white; width: 250px; }
                button { padding: 10px 20px; border-radius: 5px; background: #9D00FF; color: white; border: none; cursor: pointer; }
                .card { background: #111; padding: 30px; border-radius: 15px; display: inline-block; border: 1px solid #9D00FF; box-shadow: 0 0 15px #9D00FF; }
                h1 { color: #9D00FF; }
            </style>
        </head>
        <body>
            <div class="card">
                <h1>🦅 MJ-PRO-BOT</h1>
                <p>Enter your WhatsApp Number with country code (e.g., 919876543210)</p>
                <input type="text" id="number" placeholder="91XXXXXXXXXX">
                <br><br>
                <button onclick="getPair()">GET PAIRING CODE</button>
                <h2 id="pair"></h2>
            </div>
            <script>
                async function getPair() {
                    let num = document.getElementById('number').value;
                    if(!num) return alert('Please enter number!');
                    document.getElementById('pair').innerText = "Generating...";
                    let res = await fetch('/code?number=' + num);
                    let data = await res.json();
                    document.getElementById('pair').innerText = data.code || "Error! Try again.";
                }
            </script>
        </body>
    </html>
    `);
});

app.get('/code', async (req, res) => {
    let num = req.query.number;
    if (!num) return res.json({ error: "No number provided" });

    const { state, saveCreds } = await useMultiFileAuthState(__dirname + '/auth');
    try {
        let conn = makeWASocket({
            auth: {
                creds: state.creds,
                keys: makeCacheableSignalKeyStore(state.keys, pino({ level: "fatal" })),
            },
            printQRInTerminal: false,
            logger: pino({ level: "fatal" }),
            browser: ["Chrome (Linux)", "MJ-PRO-BOT", "1.0.0"]
        });

        if (!conn.authState.creds.registered) {
            await delay(1500);
            num = num.replace(/[^0-9]/g, '');
            const code = await conn.requestPairingCode(num);
            if (!res.headersSent) {
                res.json({ code: code });
            }
        }

        conn.ev.on('creds.update', saveCreds);
        conn.ev.on("connection.update", async (s) => {
            const { connection, lastDisconnect } = s;
            if (connection === "open") {
                await delay(5000);
                let session = fs.readFileSync(__dirname + '/auth/creds.json');
                // Yahan aap Session ID ko WhatsApp par send kar sakte hain
                await conn.sendMessage(conn.user.id, { text: "MJ-PRO-BOT-SESSION;;;" + Buffer.from(session).toString('base64') });
                process.exit(0);
            }
        });

    } catch (err) {
        console.log(err);
        res.json({ error: "Server Error" });
    }
});

app.listen(PORT, () => console.log(`MJ-PRO Server running on port ${PORT}`));
    
