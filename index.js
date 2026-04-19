const { default: makeWASocket, useMultiFileAuthState, fetchLatestBaileysVersion } = require('@whiskeysockets/baileys');
const pino = require('pino');
const os = require("os");
const moment = require("moment-timezone");
const fs = require('fs');

async function startMJPro() {
    const { state, saveCreds } = await useMultiFileAuthState('session_mj');
    const conn = makeWASocket({
        logger: pino({ level: 'silent' }),
        auth: state,
        printQRInTerminal: true,
        browser: ["Ubuntu", "Chrome", "20.0.04"]
    });

    conn.ev.on('creds.update', saveCreds);

    conn.ev.on('messages.upsert', async m => {
        const msg = m.messages[0];
        if (!msg.message || msg.key.fromMe) return;
        const from = msg.key.remoteJid;
        const body = msg.message.conversation || msg.message.extendedTextMessage?.text || "";

        if (body.startsWith('.menu')) {
            let time = moment().tz("Asia/Kolkata").format("HH:mm:ss");
            let date = moment().tz("Asia/Kolkata").format("DD/MM/YYYY");
            let thumb = fs.existsSync('./mj.jpg') ? fs.readFileSync('./mj.jpg') : null;

            // --- TUMHARA ORIGINAL PROFESSIONAL MENU ---
            let menu = `
╔═══〔 👑 𝙈𝙅-𝙋𝙍𝙊 𝙑𝙄𝙋 𝘽𝙊𝙏 👑 〕═══╗
║ 👤 User: S　A　N　J　O　Y　ツ
║ 💎 Status: Premium 👑
║ 📊 Level: 3
║ ⚡ XP: 1200
║ 🎟️ Limit: 100
║ 🌐 Users: 1
║ 🕒 ${time} | 📅 ${date}
╚═══════════════════════════╝

╔═〔 🤖 MAIN MENU 〕═╗
║ ➤ ⚡ .alive
║ ➤ 🚀 .ping
║ ➤ ⏳ .runtime
║ ➤ 📜 .script
╚═══════════════╝

╔═〔 📥 DOWNLOAD MENU 〕═╗
║ ➤ 🎵 .play
║ ➤ 🎧 .ytmp3
║ ➤ 🎬 .ytmp4
║ ➤ 📸 .instagram
║ ➤ 🎥 .tiktok
╚═══════════════╝

╔═〔 🤖 AUTO FEATURES 〕═╗
║ ➤ 👀 .autostatus on/off
║ ➤ 🧩 .autosticker on/off
║ ➤ 💬 .autoreply on/off
╚═══════════════╝

╔═〔 🖼️ EDIT MENU 〕═╗
║ ➤ 🧩 .sticker
║ ➤ 🖼️ .toimg
║ ➤ ✨ .hd
╚═══════════════╝

╔═〔 👥 GROUP CONTROL 〕═╗
║ ➤ 👢 .kick
║ ➤ ➕ .add
║ ➤ 👑 .promote
║ ➤ 📢 .tagall
╚═══════════════╝

╔═══〔 ⚙️ SYSTEM INFO 〕═══╗
║ 🖥️ OS: ${os.platform()}
║ ⚙️ CPU: ${os.cpus().length} Core
║ 💾 RAM: ${(process.memoryUsage().heapUsed / 1024 / 1024).toFixed(2)} MB
╚═══════════════════════════╝

✨ 𝙈𝙅-𝙋𝙍𝙊 𝙑𝙄𝙋 𝙎𝙔𝙎𝙏𝙀𝙈 ✨
`;

            await conn.sendMessage(from, {
                text: menu,
                contextInfo: {
                    externalAdReply: {
                        title: "👑 MJ-PRO VIP BOT",
                        body: "Ultimate Professional WhatsApp Bot",
                        thumbnail: thumb,
                        sourceUrl: "https://github.com",
                        mediaType: 1,
                        renderLargerThumbnail: true
                    }
                }
            }, { quoted: msg });
        }
    });
}
startMJPro();
            
