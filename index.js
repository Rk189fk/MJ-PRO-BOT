const { default: makeWASocket, useMultiFileAuthState, DisconnectReason, jidDecode } = require('@whiskeysockets/baileys')
const pino = require('pino')
const { Boom } = require('@hapi/boom')
const config = require('./config')

async function connectToWA() {
    const { state, saveCreds } = await useMultiFileAuthState(__dirname + '/auth_info_baileys')
    
    const conn = makeWASocket({
        logger: pino({ level: 'silent' }),
        printQRInTerminal: true,
        auth: state
    })

    conn.ev.on('connection.update', (update) => {
        const { connection, lastDisconnect } = update
        if (connection === 'close') {
            const shouldReconnect = (lastDisconnect.error instanceof Boom)?.output?.statusCode !== DisconnectReason.loggedOut
            if (shouldReconnect) connectToWA()
        } else if (connection === 'open') {
            console.log('✅ MJ-PRO-BOT Connected Successfully!')
        }
    })

    conn.ev.on('creds.update', saveCreds)

    // --- AUTO STATUS SEEN & AUTO REACTION ---
    conn.ev.on('messages.upsert', async (chatUpdate) => {
        const mek = chatUpdate.messages[0]
        if (!mek.message) return
        const from = mek.key.remoteJid

        // 1. Auto Status Seen
        if (from === 'status@broadcast' && config.AUTO_READ_STATUS) {
            await conn.readMessages([mek.key])
        }

        // 2. Auto Reaction (Only for Public Mode)
        if (config.MODE === 'public' && !mek.key.fromMe) {
            const emojis = ["🦅", "💀", "🔥", "⚡" "🥷🏻", "🥂", "💸", "🥵", "☠️",]
            const randomEmoji = emojis[Math.floor(Math.random() * emojis.length)]
            await conn.sendMessage(from, { react: { text: randomEmoji, key: mek.key } })
        }
    })
}

// Live Time Bio Update (Every 30 Minutes)
setInterval(async () => {
    const time = new Date().toLocaleString('en-US', { timeZone: 'Asia/Kolkata', hour: '2-digit', minute: '2-digit' })
    // Note: Iske liye conn object handle karna hoga context ke hisab se
}, 1800000)

connectToWA()
            
