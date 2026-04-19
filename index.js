const { default: makeWASocket, useMultiFileAuthState, DisconnectReason, fetchLatestBaileysVersion, makeCacheableSignalKeyStore, jidDecode } = require('@whiskeysockets/baileys');
const { Boom } = require('@hapi/boom');
const pino = require('pino');
const os = require('os');
const moment = require("moment-timezone");
const fs = require('fs-extra');

async function startMJPro() {
    const { state, saveCreds } = await useMultiFileAuthState('session_mj');
    
    const conn = makeWASocket({
        logger: pino({ level: 'silent' }),
        printQRInTerminal: false, // Pairing code use kar rahe hain isliye QR false
        auth: state,
        browser: ["MJ-PRO VIP", "Safari", "3.0.0"]
    });

    // --- PAIRING CODE LOGIC START ---
    if (!conn.authState.creds.registered) {
        const phoneNumber = "91XXXXXXXXXX"; // <--- APNA NUMBER YAHA DALO (Country code ke sath)
        setTimeout(async () => {
            let code = await conn.requestPairingCode(phoneNumber);
            code = code?.match(/.{1,4}/g)?.join("-") || code;
            console.log(`\n\n👑 MJ-PRO VIP PAIRING CODE: ${code}\n\n`);
        }, 3000);
    }
    // --- PAIRING CODE LOGIC END ---

    conn.ev.on('creds.update', saveCreds);

    conn.ev.on('messages.upsert', async m => {
        const msg = m.messages[0];
        if (!msg.message || msg.key.fromMe) return;

        const from = msg.key.remoteJid;
        const body = msg.message.conversation || msg.message.extendedTextMessage?.text || "";
        const prefix = ".";
        const command = body.startsWith(prefix) ? body.slice(1).trim().split(/ +/).shift().toLowerCase() : null;

        // Auto Status Seen
        if (from === 'status@broadcast') {
            await conn.readMessages([msg.key]);
            return;
        }

        if (command === "menu" || command === "help") {
            const time = moment().tz("Asia/Kolkata").format("HH:mm:ss");
            const date = moment().tz("Asia/Kolkata").format("DD/MM/YYYY");
            const runtime = process.uptime();
            const hours = Math.floor(runtime / 3600);
            const minutes = Math.floor((runtime % 3600) / 60);

            let menuText = `┏━━〔 👑 𝙈𝙅-𝙋𝙍𝙊 𝙑𝙄𝙋 𝘽𝙊𝙏 👑 〕━━┓
┃ 👤 *USER:* S　A　N　J　O　Y　ツ
┃ 💎 *STATUS:* PREMIUM 👑
┃ 📊 *LEVEL:* 3 | ⚡ *XP:* 1200
┃ 🎟️ *LIMIT:* 100 | 🌐 *USERS:* 240+
┃ 🕒 ${time}  ┃  📅 ${date}
┗━━━━━━━━━━━━━━━━━━━━━━┛

┏━━〔 🤖 *MAIN SYSTEM* 〕━━┓
┃ ➤ ⚡ .alive
┃ ➤ 🚀 .ping
┃ ➤ ⏳ .runtime
┃ ➤ 📜 .script
┗━━━━━━━━━━━━━━━━━━━━━━┛

┏━━〔 📥 *DOWNLOADER* 〕━━┓
┃ ➤ 🎵 .play
┃ ➤ 🎧 .ytmp3
┃ ➤ 🎬 .ytmp4
┃ ➤ 📸 .instagram
┃ ➤ 🎥 .tiktok
┗━━━━━━━━━━━━━━━━━━━━━━┛

┏━━〔 🤖 *AUTO ENGINE* 〕━━┓
┃ ➤ 👀 .autostatus (ON)
┃ ➤ 🧩 .autosticker (ON)
┃ ➤ 💬 .autoreply (ON)
┃ ➤ 📴 .autobio (ON)
┗━━━━━━━━━━━━━━━━━━━━━━┛

┏━━〔 🎨 *IMAGE & EDIT* 〕━━┓
┃ ➤ 🧩 .sticker
┃ ➤ 🖼️ .toimg
┃ ➤ ✨ .hd
┗━━━━━━━━━━━━━━━━━━━━━━┛

┏━━〔 👥 *GROUP MODS* 〕━━┓
┃ ➤ 👢 .kick
┃ ➤ ➕ .add
┃ ➤ 👑 .promote
┃ ➤ 📢 .tagall
┗━━━━━━━━━━━━━━━━━━━━━━┛

┏━━〔 ⚙️ *SERVER INFO* 〕━━┓
┃ 🖥️ *OS:* ${os.platform()}
┃ ⚙️ *CPU:* ${os.cpus().length} Core
┃ 💾 *RAM:* ${(process.memoryUsage().heapUsed / 1024 / 1024).toFixed(2)} MB
┃ ⏳ *UPTIME:* ${hours}h ${minutes}m
┗━━━━━━━━━━━━━━━━━━━━━━┛

  ✨ *𝕄𝕁-ℙℝ𝕆 𝕍𝕀ℙ 𝕊𝕐𝕊𝕋𝔼𝕄* ✨`;

            await conn.sendMessage(from, {
                text: menuText,
                contextInfo: {
                    externalAdReply: {
                        title: "𝕄𝕁-ℙℝ𝕆 𝕍𝕀ℙ 𝕊𝕐𝕊𝕋𝔼𝕄 𝕍𝟚",
                        body: "Elite Performance - Created by Sanjoy",
                        thumbnailUrl: "https://i.ibb.co/7Qk9YpD/bot.jpg", // Tumhari photo
                        sourceUrl: "https://github.com",
                        mediaType: 1,
                        renderLargerThumbnail: true
                    }
                }
            }, { quoted: msg });
        }
    });

    conn.ev.on('connection.update', (u) => {
        const { connection, lastDisconnect } = u;
        if (connection === 'open') console.log('✅ MJ-PRO IS LIVE!');
        if (connection === 'close') {
            let reason = new Boom(lastDisconnect?.error)?.output.statusCode;
            if (reason !== DisconnectReason.loggedOut) startMJPro();
        }
    });
}

startMJPro();
                
