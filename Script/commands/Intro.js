const axios = require("axios");
const request = require("request");
const fs = require("fs-extra");
const moment = require("moment-timezone");

module.exports.config = {
 name: "intro",
 version: "1.0.0",
 hasPermssion: 0,
 credits: "⏳𝕊𝕚𝕪𝕒𝕞 -ℍ𝕒𝕤𝕒𝕟⏳",
 description: "Show  Info",
 commandCategory: "info",
 usages: "info",
 cooldowns: 2
};

module.exports.run = async function({ api, event }) {
 const time = moment().tz("Asia/Dhaka").format("DD/MM/YYYY hh:mm:ss A");

 const callback = () => api.sendMessage({
 body: `
╔═══════════════✦🌟✦═══════════════╗
║        🌟 𝐎𝐖𝐍𝐄𝐑 𝐏𝐑𝐎𝐅𝐈𝐋𝐄 🌟        ║
╠═══════════════✦🌟✦═══════════════╣
║ 👑 𝐍𝐀𝐌𝐄      : 𝕌𝕕𝕒𝕪 ℍ𝕒𝕤𝕒𝕟 𝕊𝕚𝕪𝕒𝕞
║ 🤖 𝐁𝐎𝐓 𝐍𝐀𝐌𝐄  : 𝐒𝐢𝐲𝐚𝐦 𝐇𝐚𝐬𝐚𝐧 𝐂𝐡𝐚𝐭 𝐁𝐨𝐭
║ 🚹 𝐆𝐄𝐍𝐃𝐄𝐑    : 𝐌𝐀𝐋𝐄
║ 🎂 𝐀𝐆𝐄       : 16+
║ 🕌 𝐑𝐄𝐋𝐈𝐆𝐈𝐎𝐍 : 𝐈𝐒𝐋𝐀𝐌
║ 🏫 𝐄𝐃𝐔𝐂𝐀𝐓𝐈𝐎𝐍 : Dhaka High School
║ 🏡 𝐀𝐃𝐃𝐑𝐄𝐒𝐒 : Kishoreganj
╠═══════════════✦🌟✦═══════════════╣
║ 🌐 𝐅𝐀𝐂𝐄𝐁𝐎𝐎𝐊 : [👉 https://www.facebook.com/profile.php?id=61568411310748
║ 💬 𝐖𝐇𝐀𝐓𝐒𝐀𝐏𝐏 : [👉 +8801789138157]
║ 🎵 𝐓𝐈𝐊𝐓𝐎𝐊   : [👉 tiktok.com/@siyam0178913
║ 📡 𝐓𝐄𝐋𝐄𝐆𝐑𝐀𝐌 : [👉 +8801789138157]
╠═══════════════✦🌟✦═══════════════╣
║ ⚙️ 𝐏𝐑𝐄𝐅𝐈𝐗    : [ / ] (!) {⏳}
║ 🕒 𝐔𝐏𝐃𝐀𝐓𝐄𝐃  : ${time}
╚═══════════════✦🌟✦═══════════════╝`,
 attachment: fs.createReadStream(__dirname + "/cache/owner.jpg")
 }, event.threadID, () => fs.unlinkSync(__dirname + "/cache/owner.jpg"));

 return request("https://i.imgur.com/FJI61jS.jpeg")
 .pipe(fs.createWriteStream(__dirname + '/cache/owner.jpg'))
 .on('close', () => callback());
};
