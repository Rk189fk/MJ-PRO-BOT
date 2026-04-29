const { cmd, commands } = require('../command'); // Aapke bot ka command handler path

cmd({
    pattern: "menu",
    alias: ["panel", "list", "help"],
    desc: "Affiche le menu du bot",
    category: "main",
    filename: __filename
},
async (conn, mek, m, { from, quoted, body, isCmd, command, args, q, isGroup, sender, senderNumber, botNumber2, botNumber, pushname, isMe, isOwner, groupMetadata, groupName, participants, groupAdmins, isBotAdmins, isAdmins, reply }) => {
    try {
        // --- Menu Header Image (Optional) ---
        // const image_url = "https://your-image-url.jpg"; // Yahan apni eagle image ka link dalein

        let menuText = `╔════════════════════════╗
      🦅 ᴍᴊ-ᴘʀᴏ-ʙᴏᴛ ᴠ1.0 🦅
╚════════════════════════╝

   ◈ 👤 ᴅᴇᴠᴇʟᴏᴘᴇʀ: Sanjoy
   ◈ 🛰️ ᴘʀᴇғɪx: [ . ]
   ◈ 📈 ᴍᴏᴅᴇ: Public
   ◈ 🛡️ sʏsᴛᴇᴍ: Online 24/7

   "Focus on the goal, not the crowd."

┌───  〔 🤖 ᴀɪ & ᴄʜᴀᴛɢᴘᴛ 〕  ───
│ 
│ ✍︎ .ai (Ask anything)
│ ✍︎ .gpt4 (Latest AI)
│ ✍︎ .gemini (Google AI)
│ ✍︎ .dalle (Image Gen)
│ ✍︎ .remini (Enhance)
│ ✍︎ .brainly (Study help)
│
└──────────────────────────

┌───  〔 📥 ᴅᴏᴡɴʟᴏᴀᴅᴇʀ 〕  ───
│ 
│ ✍︎ .fb (Facebook Video)
│ ✍︎ .ig (Instagram Reel)
│ ✍︎ .ytmp3 (YouTube Music)
│ ✍︎ .ytmp4 (YouTube Video)
│ ✍︎ .tiktok (No Watermark)
│ ✍︎ .mediafire (Direct DL)
│ ✍︎ .gitclone (Repo DL)
│
└──────────────────────────

┌───  〔 👥 ɢʀᴏᴜᴘ ᴍᴀɴᴀɢᴇʀ 〕  ───
│ 
│ ✍︎ .kick (Remove User)
│ ✍︎ .add (Add User)
│ ✍︎ .promote (Make Admin)
│ ✍︎ .demote (Remove Admin)
│ ✍︎ .hidetag (Tag All)
│ ✍︎ .group (Open/Close)
│ ✍︎ .tagall (Emergency)
│
└──────────────────────────

┌───  〔 🎨 sᴛɪᴄᴋᴇʀ & ᴇᴅɪᴛ 〕  ───
│ 
│ ✍︎ .s / .sticker (Create)
│ ✍︎ .attp (Text Sticker)
│ ✍︎ .take (Change Pack)
│ ✍︎ .toimg (Sticker to Image)
│ ✍︎ .removebg (Cutout)
│
└──────────────────────────

┌───  〔 ⚙️ ᴜᴛɪʟɪᴛɪᴇs 〕  ───
│ 
│ ✍︎ .runtime (Uptime)
│ ✍︎ .ping (Speed)
│ ✍︎ .weather (City Info)
│ ✍︎ .owner (Contact Sanjoy)
│ ✍︎ .script (Bot Code)
│
└──────────────────────────

┌───  〔 👑 ᴏᴡɴᴇʀ ᴏɴʟʏ 〕  ───
│ 
│ ✍︎ .restart (Reboot Bot)
│ ✍︎ .broadcast (Msg All)
│ ✍︎ .setppbot (Change DP)
│ ✍︎ .eval (JS Code)
│
└──────────────────────────

   © ᴍᴊ-ᴘʀᴏ-ʙᴏᴛ | ᴘᴏᴡᴇʀᴇᴅ ʙʏ sᴀɴᴊᴏʏ`;

        // Bot message send karega
        return await conn.sendMessage(from, { 
            text: menuText,
            contextInfo: {
                externalAdReply: {
                    title: "MJ-PRO-BOT BY SANJOY",
                    body: "The King of WhatsApp Bots",
                    mediaType: 1,
                    sourceUrl: "https://github.com/MJ-PRO-BOT/MJ-PRO-BOT",
                    thumbnailUrl: "https://raw.githubusercontent.com/MJ-PRO-BOT/MJ-PRO-BOT/main/logo.jpg", // Logo link
                    renderLargerThumbnail: true,
                    showAdAttribution: true
                }
            }
        }, { quoted: mek });

    } catch (e) {
        console.log(e);
        reply(`${e}`);
    }
});
    
