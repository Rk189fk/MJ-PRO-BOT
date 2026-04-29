const fs = require('fs');
if (fs.existsSync('config.env')) require('dotenv').config({ path: './config.env' });

function convertToBool(text, fault = 'true') {
    return text === fault ? true : false;
}

module.exports = {
    SESSION_ID: process.env.SESSION_ID || "PASTE_YOUR_SESSION_HERE",
    OWNER_NUMBER: process.env.OWNER_NUMBER || "918167514965", 
    MODE: process.env.MODE || "public",
    AUTO_VOICE: convertToBool(process.env.AUTO_VOICE, 'true'),
    AUTO_STICKER: convertToBool(process.env.AUTO_STICKER, 'false'),
    AUTO_REPLY: convertToBool(process.env.AUTO_REPLY, 'false'),
    AUTO_READ_STATUS: convertToBool(process.env.AUTO_READ_STATUS, 'true'),
};
