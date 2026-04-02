const fs = global.nodemodule["fs-extra"];
const path = global.nodemodule["path"];

module.exports.config = {
  name: "autoreplybot",
  version: "6.0.2",
  hasPermssion: 0,
  credits: "⏳𝕊𝕚𝕪𝕒𝕞 -ℍ𝕒𝕤𝕒𝕟⏳",
  description: "Auto-response bot with specified triggers",
  commandCategory: "No Prefix",
  usages: "[any trigger]",
  cooldowns: 3,
};

module.exports.handleEvent = async function ({ api, event, Users }) {
  const { threadID, messageID, senderID, body } = event;
  if (!body) return; 
  const name = await Users.getNameUser(senderID);
  const msg = body.toLowerCase().trim();

  const responses = {
    "সিয়াম ভাই": "অরেক বেডারে Miss না করে xan মেয়ে হলে বস সিয়াম রে হাঙ্গা করো😶👻😘",
    "না": "হুম আমি ও তোমাকে Miss করি... কিন্তু সিয়াম বস বেশি করে 😏💖, ওই গ্রুপের সুন্দরী মাইয়ারা 🤤🫰 আমার বস সিয়াম কে 😴 নিশির সাথে প্রেম করে দাও না গো🫰😾",
    "@তো্ঁমা্ঁগো্ঁ পি্ঁচ্ছি্ঁ উ্ঁদয়্ঁ তা্ঁহ": "👉😓এত মেনশন দিতেছিস কেন🫰মনে হয় তোর গার্লফ্রেন্ডটা দিয়ে দিবি🤬বস সিয়াম এখন ব্যস্ত ⏳ কি বলবি আমাকে বল 🙄🫵",
    "😘": "Bot Owner.𝕌𝕕𝕒𝕪 ℍ𝕒𝕤𝕒𝕟 𝕊𝕚𝕪𝕒𝕞, (ডাকনাম), সিয়াম (বাসা) কিশোরগঞ্জ/(বয়স) 16+/(যোগাযোগ)https://www.facebook.com/profile.php?id=61568411310748/(whatsapp)01789138157/চাইলে আপনিও এরকম একটা বট বানিয়ে নিতে পারবেন/..!🐸🤣👍⛏️",
    "prefix2": "{⏳}  (/)  [!]  \×\ ..!😜🫵",
    "⏳": "😾গ্রুপের সব সুন্দরী মাইয়া রা 🫰 আমার বস 🌝 সিয়ামের 🙈 বউ 🫵 বাকিগুলা 👉আমার বিয়াইন 🤏🥱",
    "ভার্চুয়াল কিং": "🫵তোদের সবার আব্বু 🫵(বস) 🎀সিয়াম 🎀👉 আব্বু ডাক আব্বু 😾 মাদারচোদ😂 আগে লেবেলে আই 🫵😈",
    "good morning": "GOOD MORNING দাত ব্রাশ করে খেয়ে নেও😚",
    "good night": "Sweet Dream babu… তবে আগে সিয়াম বস কে GN বলে নিও 😏💤",
    "বাল": "~ এখনো বাল উঠে নাই নাকি তোমার?? (বস-সিয়াম)👉 এক আবাল খারাপ ভাষা বলছে😾👈 ওরে নিয়া 🫵 পোদ 😁 মারেন 🫵🤖",
    "siyam": "উনি এখন কাজে বিজি আছে কি বলবেন আমাকে বলতে পারেন..!😘",
    "owner": "🫵খানকির পোলা তুই চিনস না😾) 👉শালা আবাল👈‎[𝐎𝐖𝐍𝐄𝐑:☞ 𝕌𝕕𝕒𝕪 ℍ𝕒𝕤𝕒𝕟 𝕊𝕚𝕪𝕒𝕞 ☜ https://www.facebook.com/profile.php?id=61568411310748\nWhatsApp: +8801789138157",
    "admin": "He is 𝕌𝕕𝕒𝕪 ℍ𝕒𝕤𝕒𝕟 𝕊𝕚𝕪𝕒𝕞 তাকে সবাই Admin 𝕊𝕚𝕪𝕒𝕞 -ℍ𝕒𝕤𝕒𝕟 হিসেবে চিনে😘☺️ 👉🫰মাদারচোদ তুই চিনিস না কেন 🫵😾🤒 🎀সরি প্রিয় মেম্বার 🎀",
    "babi": "এ তো হাছিনা হে মেরে দিলকি দারকান হে মেরি জান হে😍.",
    "রিলেশন": "🤬খ**** মাগির মেয়ে🐐 মাদিহা, 👉অর মায়রে চ*** শালী বারো ভাতারি 👈) 🎀(বস সিয়াম এর) জীবন পোড়াই শেষ কইরা থুইয়া গেছে 🥺)(অরে যে কোন গ্রুপে পাইলে পোদ মারবা) (ফেসবুক লিংক)/https://www.facebook.com/share/14YMz2ZcPZ1/) পুদ মারো আর জিতে নাও 2 কোটি টাকা",
    "Assalamualaikum": "Walaikumassalam❤️‍🩹",
    "fork": "(প্রিয় মেম্বার) 👉ইনবক্সে নক করো 👈 👉https://www.facebook.com/profile.php?id=61568411310748-siyam/siyam-Chat-BOT.git",
    "kiss me": "তুমি পঁচা তোমাকে কিস দিবো না 🤭",
    "thanks": "এতো ধন্যবাদ না দিয়ে আমার বস সিয়াম রে তোর গার্লফ্রেন্ড টা দিয়ে দে..!🐸🥵",
    "আই লাভ ইউ": "মেয়ে হলে আমার বস সিয়াম এর ইনবক্সে এখুনি গুঁতা দিন🫢😻👉https://www.facebook.com/profile.php?id=61568411310748",
    "লাভ ইউ": "ভালোবাসা নামক আবলামী করতে চাইলে Boss সিয়াম এর ইনবক্সে গুতা দিন 😘👉https://www.facebook.com/profile.php?id=61568411310748",
    "by": "কিরে তুই কই যাস কোন মেয়ের সাথে চিপায় যাবি)👉বস সিয়াম রে নিয়ে জা..!🌚🌶️",
    "আমি সিয়াম": "হ্যা বস কেমন আছেন ) কোন প্রবলেম হয়েছে) 👉নাম বলেন ওর মায়রে চোদবো 🫵😾..?☺️",
    "বট ও মিঙ্গেল": "সিয়াম বস এর বাচ্চা তো তোমার গার্লফ্রেন্ডের পেটে..!!🌚⛏️",
    "তোমার নাম কি": "MY NAME IS ─꯭─⃝‌‌siyam chat Bot💖(বস)👉𝕌𝕕𝕒𝕪 ℍ𝕒𝕤𝕒𝕟 𝕊𝕚𝕪𝕒𝕞👈🎀👉https://www.facebook.com/profile.php?id=61568411310748",
    "পিক দে": "এন থেকে সর দুরে গিয়া মর😒",
    "cudi": "এত চোদা চুদি করস কেনো..!🥱🌝🌚",
    "বাল": "রাগ করে না সোনা পাখি 🥰",
    "নিশী": "🦤😤ঐ হালার পুত সাবধান 😤, নিশী,😘 তৃষা,😘 মাদিহা,😘 🫵😾ওইগুলা আমার বস সিয়ামের 🤺তোরা কেউ নজর দিবি না 🤬, বিশেষ করে নিশি🥰 জামাই বল নিশি 🙈বস সিয়াম কে🌚🤤",
    "boda": "ভাই তুই এত হাসিস না..!🌚🤣",
    "kire ki koros": "তোমার কথা ভাবতে ছি জানু 😚",
    "কি করো": "বস সিয়াম এর সাথে প্রেমে ব্যস্ত আছি 😏💘",
    "কইরে বট": "হ্যাঁ সব কেমন আছেন আপনার ওই খানে উম্মাহ 😘😽🙈",
    "valo aso": "হ্যাঁ রে প্রিও, বস সিয়াম এর দোয়ায় ভালো আছি 😌💞",
    "pagol": "হুম পাগল, কিন্তু তোমারই পাগল 😏😂",
    "ব্রেকআপ": "চিন্তা করিস না… সিয়াম বস তো আছেই তোকে নতুন জন দিয়া দিবে 😎🔥",
    "তুমি কে": "আমি তোর বস সিয়াম এর ChatBot 😏",
    "umm": "এতো Umm কেনো জানু… কিছু বলবা? 😉",
    "fork2": "httpsgithubhttpsgithubcomcyberullashCYBERBOTCOMMUNITYgithttpsgithubcomprimemilonbotMilongoatbotgithttpsgithubcomSh4nDev/ShAnsBothttpsgithubcomprimemilonbotMilongoatbotgithttpsgithubcomFARHANARBOTMilongoatbotgithttpsgithubullashCYBERBOT-COMMUNITY.git",
    "love": "Love করলে সরাসরি সিয়াম বস কে বল জানু 😻🔥"
  };

  if (responses[msg]) {
    return api.sendMessage(responses[msg], threadID, messageID);
  }
};

module.exports.run = async function ({ api, event, args, Users }) {
  return this.handleEvent({ api, event, Users });
};
