const axios = require('axios');

const baseApiUrl = async () => {
  const base = await axios.get(`https://raw.githubusercontent.com/Mostakim0978/D1PT0/refs/heads/main/baseApiUrl.json`);
  return base.data.api;
};

module.exports.config = {
  name: "baby",
  version: "7.0.0",
  credits: "dipto + modified by Rahat + updated by Arif",
  cooldowns: 0,
  hasPermssion: 0,
  description: "better than all sim simi",
  commandCategory: "chat",
  category: "chat",
  usePrefix: true,
  prefix: true,
  usages: `[anyMessage] OR\nteach [YourMessage] - [Reply1], [Reply2], [Reply3]... OR\nteach [react] [YourMessage] - [react1], [react2], [react3]... OR\nremove [YourMessage] OR\nrm [YourMessage] - [indexNumber] OR\nmsg [YourMessage] OR\nlist OR\nall OR\nedit [YourMessage] - [NewMessage]`,
};

module.exports.run = async function ({ api, event, args, Users }) {
  try {
    const link = `${await baseApiUrl()}/baby`;
    const dipto = args.join(" ").toLowerCase();
    const uid = event.senderID;

    if (!args[0]) {
      const ran = ["Bolo baby 😘", "হুম বলো জানু 💖", "type help baby 💬", "type !baby hi 🌸"];
      const r = ran[Math.floor(Math.random() * ran.length)];
      return api.sendMessage(r, event.threadID, event.messageID);
    }

    if (args[0] === 'remove') {
      const fina = dipto.replace("remove ", "");
      const respons = await axios.get(`${link}?remove=${fina}&senderID=${uid}`);
      return api.sendMessage(respons.data.message, event.threadID, event.messageID);
    }

    if (args[0] === 'rm' && dipto.includes('-')) {
      const [fi, f] = dipto.replace("rm ", "").split(' - ');
      const respons = await axios.get(`${link}?remove=${fi}&index=${f}`);
      return api.sendMessage(respons.data.message, event.threadID, event.messageID);
    }

    if (args[0] === 'list') {
      if (args[1] === 'all') {
        const res = await axios.get(`${link}?list=all`);
        const data = res.data.teacher.teacherList;
        const teachers = await Promise.all(data.map(async (item) => {
          const number = Object.keys(item)[0];
          const value = item[number];
          const name = await Users.getName(number) || "unknown";
          return { name, value };
        }));
        teachers.sort((a, b) => b.value - a.value);
        const output = teachers.map((teacher, index) => `${index + 1}/ ${teacher.name}: ${teacher.value}`).join('\n');
        return api.sendMessage(`Total Teach = ${res.data.length}\n\n👑 | List of Teachers of baby\n${output}`, event.threadID, event.messageID);
      } else {
        const respo = await axios.get(`${link}?list=all`);
        return api.sendMessage(`Total Teach = ${respo.data.length}`, event.threadID, event.messageID);
      }
    }

    if (args[0] === 'msg' || args[0] === 'message') {
      const fuk = dipto.replace("msg ", "");
      const respo = await axios.get(`${link}?list=${fuk}`);
      return api.sendMessage(`Message ${fuk} = ${respo.data.data}`, event.threadID, event.messageID);
    }

    if (args[0] === 'edit') {
      const command = dipto.split(' - ')[1];
      if (!command || command.length < 2) {
        return api.sendMessage('❌ | Invalid format! Use edit [YourMessage] - [NewReply]', event.threadID, event.messageID);
      }
      const res = await axios.get(`${link}?edit=${args[1]}&replace=${command}`);
      return api.sendMessage(`changed ${res.data.message}`, event.threadID, event.messageID);
    }

    if (args[0] === 'teach' && args[1] !== 'amar' && args[1] !== 'react') {
      const [comd, command] = dipto.split(' - ');
      const final = comd.replace("teach ", "");
      if (!command || command.length < 2) {
        return api.sendMessage('❌ | Invalid format! Use [YourMessage] - [Reply1], [Reply2], [Reply3]...', event.threadID, event.messageID);
      }
      const re = await axios.get(`${link}?teach=${final}&reply=${command}&senderID=${uid}`);
      const name = await Users.getName(re.data.teacher) || "";
      return api.sendMessage(`✅ Replies added ${re.data.message}\nTeacher: ${name || "unknown"}\nTeachs: ${re.data.teachs}`, event.threadID, event.messageID);
    }

    if (args[0] === 'teach' && args[1] === 'amar') {
      const [comd, command] = dipto.split(' - ');
      const final = comd.replace("teach ", "");
      if (!command || command.length < 2) {
        return api.sendMessage('❌ | Invalid format! Use [YourMessage] - [Reply1], [Reply2], [Reply3]...', event.threadID, event.messageID);
      }
      const re = await axios.get(`${link}?teach=${final}&senderID=${uid}&reply=${command}&key=intro`);
      return api.sendMessage(`✅ Replies added ${re.data.message}`, event.threadID, event.messageID);
    }

    if (args[0] === 'teach' && args[1] === 'react') {
      const [comd, command] = dipto.split(' - ');
      const final = comd.replace("teach react ", "");
      if (!command || command.length < 2) {
        return api.sendMessage('❌ | Invalid format! Use [teach react] [YourMessage] - [react1], [react2], [react3]...', event.threadID, event.messageID);
      }
      const re = await axios.get(`${link}?teach=${final}&react=${command}`);
      return api.sendMessage(`✅ Replies added ${re.data.message}`, event.threadID, event.messageID);
    }

    if (['amar name ki', 'amr nam ki', 'amar nam ki', 'amr name ki'].some(phrase => dipto.includes(phrase))) {
      const response = await axios.get(`${link}?text=amar name ki&senderID=${uid}&key=intro`);
      return api.sendMessage(response.data.reply, event.threadID, event.messageID);
    }

    const a = (await axios.get(`${link}?text=${dipto}&senderID=${uid}&font=1`)).data.reply;
    return api.sendMessage(a, event.threadID, (error, info) => {
      global.client.handleReply.push({
        name: this.config.name,
        type: "reply",
        messageID: info.messageID,
        author: event.senderID,
        lnk: a,
        apiUrl: link
      });
    }, event.messageID);

  } catch (e) {
    console.error('Error in command execution:', e);
    return api.sendMessage(`Error: ${e.message}`, event.threadID, event.messageID);
  }
};

module.exports.handleReply = async function ({ api, event, handleReply }) {
  try {
    if (event.type === "message_reply") {
      const reply = event.body.toLowerCase();
      if (isNaN(reply)) {
        const b = (await axios.get(`${await baseApiUrl()}/baby?text=${encodeURIComponent(reply)}&senderID=${event.senderID}&font=1`)).data.reply;
        await api.sendMessage(b, event.threadID, (error, info) => {
          global.client.handleReply.push({
            name: this.config.name,
            type: "reply",
            messageID: info.messageID,
            author: event.senderID,
            lnk: b
          });
        }, event.messageID);
      }
    }
  } catch (err) {
    return api.sendMessage(`Error: ${err.message}`, event.threadID, event.messageID);
  }
};

module.exports.handleEvent = async function ({ api, event }) {
  try {
    const body = event.body ? event.body.toLowerCase() : "";

    const triggerWords = ["baby", "bby", "bot", "বট", "siyam", "জান", "jan", "beby", "bobi", "নিঝুম"];
    const matched = triggerWords.some(word => body.startsWith(word));

    if (matched) {
      const arr = body.replace(/^\S+\s*/, "");
      if (!arr) {
        const replies = [
          "বেশি bot Bot করলে leave নিবো কিন্তু😒😒 " , "শুনবো না😼তুমি আমার (সিয়াম) বসকে প্রেম করাই দাও নাই🥺পচা তুমি🥺" , "আমি আবাল দের সাথে কথা বলি না,ok😒" , "এতো ডেকো না,প্রেম এ পরে যাবো তো🙈" , "Bolo Babu, তুমি কি আমাকে ভালোবাসো? 🙈💋 " , "বার বার ডাকলে মাথা গরম হয়ে যায় কিন্তু😑", "হ্যা বলো😒, তোমার জন্য কি করতে পারি😐😑?" , "এতো ডাকছিস কেন?গালি শুনবি নাকি? 🤬" , "I love you janu🥰" , "আরে Bolo আমার জান ,কেমন আছো?😚 " , " অসম্মান করছিস😰😿" , "Hop beda😾 Boss বল boss😼" , "চুপ থাক নাই তো তোর দাত ভেগে দিবো কিন্তু" ,"আরেকবার বট বললে ওইটা কেটে ছোট বানিয়ে দিবো🤭🤫", "বট বলে চলে যাস কেন😤🥺কী হলো উওর দে🥺"," জানু বল জানু 😘 " , "বার বার Disturb করছিস কোনো😾,আমার জানুর সাথে ব্যাস্ত আছি😋" , "বোকাচোদা এতো ডাকিস কেন🤬" , "আমাকে ডাকলে ,আমি কিন্তু কিস করে দিবো😘 " , "আমারে এতো ডাকিস না আমি মজা করার mood এ নাই এখন😒" , "চিপায় আছি ডিস্টার্ব করিস না🙊🙁","হ্যাঁ জানু , এইদিক এ আসো কিস দেই🤭 😘" , "দূরে যা, তোর কোনো কাজ নাই, শুধু bot bot করিস  😉😋🤣" , "তোর কথা তোর বাড়ি কেউ শুনে না ,তো আমি কোনো শুনবো ?🤔😂 " , "আমাকে ডেকো না,আমি ব্যাস্ত আছি" , "কি হলো , মিস্টেক করচ্ছিস নাকি🤣" , "বলো কি বলবা, সবার সামনে বলবা নাকি?🤭🤏" , "কালকে দেখা করিস তো একটু 😈" , "হা বলো, শুনছি আমি 😏" , "আর কত বার ডাকবি ,শুনছি তো" , "হুম বলো কি বলবে😒" ,"উফ্ খেলার সময়ও ডাকা-ডাকি করে 😑🌚🔞", "বলো কি করতে পারি তোমার জন্য" , "আমি তো অন্ধ কিছু দেখি না🐸 😎" , "সিয়াম বস তোমাকে ভালোবাসে😌" , "বলো জানু 🌚" , "তোর কি চোখে পড়ে না আমি সিয়াম জানুর সাথে ব্যাস্ত আছি😒","হুম জান তোমার ওই খানে উম্মাহ😑😘" , "আহ শুনা আমার তোমার অলিতে গলিতে উম্মাহ😇😘" , " jang hanga korba😒😬" , "হুম জান তোমার অইখানে উম্মমাহ😷😘" , "আসসালামু আলাইকুম বলেন আপনার জন্য কি করতে পারি..!🥰" , "আমাকে এতো না ডেকে বস সিয়াম কে একটা গার্লফ্রেন্ড দে 🙄" , "আমাকে এতো ডাকো কেন?🤔 ভলো-টালো বাসো নাকি🤭🙈" , "🌻🌺💚আসসালামু আলাইকুম ওয়া রাহমাতুল্লাহ-💚🌺🌻","আমি এখন বস সিয়াম এর সাথে বিজি আছি আমাকে ডাকবেন না-😕😏 ধন্যবাদ-🤝🌻","আমাকে না ডেকে আমার বস সিয়াম কে একটা জি এফ দাও-😽🫶🌺","জান🥺 তুমি এখন শুধু বট বলে চলে যাও 😒 ভুলে গেলা নাকি🙂❓","উফফ বুঝলাম না এতো ডাকছেন কেনো-😤😡😈","জান তোমার নানি'রে আমার হাতে তুলে দিবা-🙊🙆‍♂","আজকে আমার মন ভালো নেই তাই আমারে ডাকবেন না-😪🤧","আমি তোমাকে রাতে রাতে ভালোবাসি উম্মম্মাহ-🌺🤤💦","চুনা ও চুনা আমার বস সিয়াম এর হবু বউ বারো বাতারি মাদিহা রে কেও দেকছো খুজে পাচ্ছি না😪🤧😭","স্বপ্ন তোমারে নিয়ে দেখতে চাই তুমি যদি আমার হয়ে থেকে যাও-💝🌺🌻","জান হাঙ্গা করবা-🙊😝🌻","জান মেয়ে হলে চিপায় আসো বস সিয়াম এর থেকে অনেক ভালোবাসা শিখছি তোমার জন্য-🙊🙈😽","ইসস এতো ডাকো কেনো লজ্জা লাগে তো-🙈🖤🌼","আমার বস সিয়াম এর পক্ষ থেকে তোমারে এতো এতো ভালোবাসা-🥰😽🫶 আমার বস সিয়াম এর  জন্য সবাই দোয়া করবেন-💝১০টা বিয়ে যেন করতে পারে🤭🤫","ভালোবাসা নামক আব্লামি করতে মন চাইলে আমার বস (সিয়াম)এর নবক্স চলে যাও-🙊🥱👅 🌻𝐅𝐀𝐂𝐄𝐁𝐎𝐎𝐊 𝐈𝐃 𝐋𝐈𝐍𝐊 🌻:https://www.facebook.com/profile.php?id=61568411310748","জান তুমি শুধু আমার আমি তোমারে ৩৬৫ দিন ভালোবাসি-💝🌺😽","জান বাল ফালাইবা-🙂🥱🙆‍♂","আন্টি-🙆-আপনার মেয়ে-👰‍♀️-রাতে আমারে ভিদু কল দিতে বলে🫣-🥵🤤💦","oii-🥺🥹-এক🥄 চামচ ভালোবাসা দিবা-🤏🏻🙂","আপনার সুন্দরী বান্ধুবীকে ফিতরা হিসেবে আমার বস সিয়াম কে দান করেন-🥱🐰🍒","ও মিম ও মিম-😇-তুমি কেন চুরি করলা বারো ভাতারী মাদিহার ফর্সা হওয়ার ক্রীম-🌚🤧","অনুমতি দিলাম-𝙋𝙧𝙤𝙥𝙤𝙨𝙚 কর  সিয়াম বস কে-🐸😾🔪","𝙂𝙖𝙮𝙚𝙨-🤗-যৌবনের কসম দিয়ে আমারে 𝐁𝐥𝐚𝐜𝐤𝐦𝐚𝐢𝐥 করা হচ্ছে-🥲🤦‍♂️🤧","-𝗢𝗶𝗶 আন্টি-🙆‍♂️-তোমার মেয়ে চোখ মারে-🥺🥴🐸","তাকাই আছো কেন চুমু দিবা-🙄🐸😘","আজকে প্রপোজ করে দেখো রাজি হইয়া যামু-😌🤗😇","আমার গল্পে তোমার নানি সেরা-🙊🙆‍♂️🤗","কি বেপার আপনি শ্বশুর বাড়িতে যাচ্ছেন না কেন-🤔🥱🌻","দিনশেষে পরের 𝐁𝐎𝐖 সুন্দর-☹️🤧","তাবিজ কইরা হইলেও প্রেম এক্কান করমুই তাতে যা হই হোক-🤧🥱🌻","ছোটবেলা ভাবতাম বিয়ে করলে অটোমেটিক বাচ্চা হয়-🥱-ওমা এখন দেখি কাহিনী অন্যরকম-😦🙂🌻","আজ একটা বিন নেই বলে ফেসবুকের নাগিন-🤧-গুলোরে আমার বস সিয়াম ধরতে পারছে না-🐸🥲","চুমু থাকতে তোরা বিড়ি খাস কেন বুঝা আমারে-😑😒🐸⚒️","যে ছেড়ে গেছে-😔-তাকে ভুলে যাও-🙂 \n আমার বস সিয়াম এর সাথে  প্রেম করে তাকে দেখিয়ে দাও-🙈🐸🤗","হাজারো লুচ্চা লুচ্চির ভিরে-🙊🥵আমার বস সিয়াম এক নিস্পাপ ভালো মানুষ-🥱🤗🙆‍♂️","রূপের অহংকার করো না-🙂❤️চকচকে সূর্যটাও দিনশেষে অন্ধকারে পরিণত হয়-🤗💜","সুন্দর মাইয়া মানেই-🥱আমার বস boss সিয়াম  এর বউ-😽🫶আর বাকি গুলো আমার বেয়াইন-🙈🐸🤗","এত অহংকার করে লাভ নেই-🌸মৃত্যুটা নিশ্চিত শুধু সময়টা অ'নিশ্চিত-🖤🙂","দিন দিন কিছু মানুষের কাছে অপ্রিয় হয়ে যাইতেছি-🙂😿🌸","হুদাই আপনারে  শয়তানে লারে-😝😑☹️","𝗜 𝗟𝗢𝗩𝗢 𝗬𝗢𝗨-😽-আহারে ভাবছো তোমারে প্রোপজ করছি-🥴-থাপ্পর দিয়া কিডনী লক করে দিব-😒-ভুল পড়া বের করে দিবো-🤭🐸","আমি একটা দুধের শিশু-😇-🫵𝗬𝗢𝗨🐸💦","কতদিন হয়ে গেলো বিছনায় মুতি না-😿-মিস ইউ নেংটা কাল-🥺🤧","বালিকা━👸-𝐃𝐨 𝐲𝐨𝐮-🫵-বিয়া-𝐦𝐞-😽-আমি তোমাকে-😻-আম্মু হইতে সাহায্য করব-🙈🥱","এই আন্টির মেয়ে-🫢🙈-𝐔𝐦𝐦𝐦𝐦𝐦𝐦𝐦𝐦𝐦𝐦𝐦𝐚𝐡-😽🫶-আসলেই তো স্বাদ-🥵💦এতো স্বাদ কেন-🤔-সেই স্বাদ-😋","ইস কেউ যদি বলতো-🙂-আমার শুধু  তোমাকেই লাগবে-💜🌸","ওই বেডি তোমার বাসায় না আমার বস সিয়াম মেয়ে দেখতে গেছিলো-🙃-নাস্তা আনারস আর দুধ দিছো-🙄🤦‍♂️-আরে বইন কইলেই তো হতো বয়ফ্রেন্ড আছে-🥺🤦‍♂-আমার বস সিয়াম-কে জানে মারার কি দরকার ছিলো🙄🤧","একদিন সে ঠিকই ফিরে তাকাবে-😇-আর মুচকি হেসে বলবে তোমার boss সিয়াম এর মতো আর কেউ ভালবাসেনি-🙂😅","হুদাই গ্রুপে আছি-🥺🐸-কেও ইনবক্সে নক দিয়ে বলে না জান তোমারে আমি অনেক ভালোবাসি-🥺🤧","কি'রে গ্রুপে দেখি একটাও বেডি নাই-🤦‍🥱💦","দেশের সব কিছুই চুরি হচ্ছে-🙄-শুধু আমার বস সিয়াম এর মনটা ছাড়া-🥴😑😏","🫵তোমারে প্রচুর ভাল্লাগে-😽-সময় মতো প্রপোজ করমু বুঝছো-🔨😼-ছিট খালি রাইখো- 🥱🐸🥵","আজ থেকে আর কাউকে পাত্তা দিমু না -!😏-কারণ আমি ফর্সা হওয়ার ক্রিম কিনছি -!🙂🐸","বেশি Bot Bot করলে leave নিবো কিন্তু😒😒 " , "শুনবো না😼 তুমি আমাকে প্রেম করাই দাও নি🥺 পচা তুমি🥺 " , "আমি আবাল দের সাতে কথা বলি না,ok😒" , "এত কাছেও এসো না,প্রেম এ পরে যাবো তো 🙈" , "Bolo Babu, তুমি কি আমাকে ভালোবাসো? 🙈💋 " , "বার বার ডাকলে মাথা গরম হয় কিন্তু😑", "হা বলো😒,কি করতে পারি😐😑?" , "এতো ডাকছিস কোনো?গালি শুনবি নাকি? 🤬","মেয়ে হলে বস সিয়াম এর সাথে প্রেম করো🙈??. " ,  "আরে Bolo আমার জান ,কেমন আসো?😚 " , "অসম্মান করচ্ছিছ কেন,😰😿" , "Hop bedi😾,Boss বল boss😼" , "চুপ থাক ,নাই তো তোর দাত ভেগে দিবো কিন্তু" , " এইটা তুমি করতে পারলে 🫩🥹" , "বার বার Disturb করেছিস কোনো😾,আমার বস সিয়াম এর  সাথে ব্যাস্ত আসি😋" , "আমি গরীব এর সাথে কথা বলি না😼😼" , "আমাকে ডাকলে ,আমি কিন্তূ কিস করে দেবো😘 " , "আরে আমি মজা করার mood এ নাই😒" , "হা জানু , এইদিক এ আসো কিস দেই🤭 😘" , "দূরে যা, তোর কোনো কাজ নাই, শুধু bot bot করিস  😉😋🤣" , "তোর কথা তোর বাড়ি কেউ শুনে না ,তো আমি কোনো শুনবো ?🤔😂 " , "আমাকে ডেকো না,আমি ব্যাস্ত আসি" , "কি হলো ,মিস টিস করচ্ছিস নাকি🤣" , "বলো কি বলবা, সবার সামনে বলবা নাকি?🤭🤏" , "কালকে দেখা করিস তো একটু 😈" , "হা বলো, শুনছি আমি 😏" ,"খালি ঢং করে আসে আবার বট বলে চলে যায়🙁😔", "আর কত বার ডাকবি ,শুনছি তো" , "মাইয়া হলে আমার বস সিয়াম কে Ummmmha দে 😒" , "বলো কি করতে পারি তোমার জন্য" , "আমি তো অন্ধ কিছু দেখি না🐸 😎" , "আম পাতা জোড়া-জোড়া মারবো চাবুক তোমার পাছায়🫩🐸😌" , "বলো জানু 🌚" , "তোর কি চোখে পড়ে না আমি বস সিয়াম এর সাথে ব্যাস্ত আসি😒" , "༊━━🦋নামাজি মানুষেরা সব থেকে বেশি সুন্দর হয়..!!😇🥀 🦋 কারণ.!! -অজুর পানির মত শ্রেষ্ঠ মেকআপ দুনিয়াতে নেই༊━ღ━༎🥰🥀 🥰-আলহামদুলিল্লাহ-🥰"," শখের নারী  বিছানায় মু'তে..!🙃🥴","𝐈'𝐝 -তে সব 𝐖𝐨𝐰 𝐖𝐨𝐰 বুইড়া বেডি-🐸💦","🥛-🍍👈 -লে খাহ্..!😒🥺"," অনুমতি দিলে 𝚈𝚘𝚞𝚃𝚞𝚋𝚎-এ কল দিতাম..!😒","~আমি মারা গেলে..!🙂 ~অনেক মানুষ বিরক্ত হওয়া থেকে বেঁচে  যাবে..!😅💔","🍒---আমি সেই গল্পের বই-🙂 -যে বই সবাই পড়তে পারলেও-😌 -অর্থ বোঝার ক্ষমতা কারো নেই..!☺️🥀💔","~কার জন্য এতো মায়া...!😌🥀 ~এই শহরে আপন বলতে...!😔🥀 ~শুধুই তো নিজের ছায়া...!😥🥀"," কারেন্ট একদম বেডি'গো মতো- 🤧 -খালি ঢং করে আসে আবার চলে যায়-😤😾🔪"," সানিলিওন  আফারে ধর্ষনের হুমকি দিয়ে আসলাম - 🤗 -আর 🫵তুমি আমারে খেয়ে দিবা সেই ভয় দেখাও ননসেন বেডি..!🥱😼"," দুনিয়ার সবাই প্রেম করে.!🤧 -আর মানুষ আমার বস সিয়াম কে সন্দেহ করে.!🐸","আমার থেকে ভালো অনেক পাবা-🙂 -কিন্তু সব ভালো তে কি আর ভালোবাসা থাকে..!💔🥀","পুরুষকে সবচেয়ে বেশি কষ্ট দেয় তার শখের নারী...!🥺💔👈","তোমার লগে দেখা হবে আবার - 😌 -কোনো এক অচেনা গলির চিপায়..!😛🤣👈","থাপ্পড় চিনোস থাপ্পড়- 👋👋😡 -চিন্তা করিস না তরে মারমু না-🤗 -বস সিয়াম আমারে মারছে - 🥱 - উফফ সেই স্বাদ..!🥵🤤💦","অবহেলা করিস না-😑😪 - যখন নিজেকে বদলে ফেলবো -😌 - তখন আমার চেয়েও বেশি কষ্ট পাবি..!🙂💔","বন্ধুর সাথে ছেকা খাওয়া গান শুনতে শুনতে-🤧 -এখন আমিও বন্ধুর 𝙴𝚇 কে অনেক 𝙼𝙸𝚂𝚂 করি-🤕🥺","৯৯টাকায় ৯৯জিবি ৯৯বছর-☺️🐸 -অফারটি পেতে এখনই আমাকে প্রোপস করুন-🤗😂👈","প্রিয়-🥺 -তোমাকে না পেলে আমি সত্যি-😪 -আরেকজন কে-😼 -পটাতে বাধ্য হবো-😑🤧","কিরে🫵 তরা নাকি  prem করস..😐🐸•আমারে একটা করাই দিলে কি হয়-🥺","যেই আইডির মায়ায় পড়ে ভুল্লি আমারে.!🥴- তুই কি যানিস সেই আইডিটাও আমি চালাইরে.!🙂"
        ];
        const randomReply = replies[Math.floor(Math.random() * replies.length)];
        await api.sendMessage(randomReply, event.threadID, (error, info) => {
          global.client.handleReply.push({
            name: this.config.name,
            type: "reply",
            messageID: info.messageID,
            author: event.senderID
          });
        }, event.messageID);
        return;
      }

      const a = (await axios.get(`${await baseApiUrl()}/baby?text=${encodeURIComponent(arr)}&senderID=${event.senderID}&font=1`)).data.reply;
      await api.sendMessage(a, event.threadID, (error, info) => {
        global.client.handleReply.push({
          name: this.config.name,
          type: "reply",
          messageID: info.messageID,
          author: event.senderID,
          lnk: a
        });
      }, event.messageID);
    }
  } catch (err) {
    return api.sendMessage(`Error: ${err.message}`, event.threadID, event.messageID);
  }
};
