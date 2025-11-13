import fetch from "node-fetch";

let handler = async (m, { conn, text }) => {
  if (!text || !text.trim()) {
    return conn.sendMessage(m.chat, {
      text: "⚠️ أدخل نصاً بعد الأمر للتكلم مع مـيكو",
    }, { quoted: fkontak2(m) });
  }

  try {
    let result = await CleanMiku(text);
    await conn.sendMessage(m.chat, {
      text: `${result}\n\n> *🌷ണĨƘ♡ β♡Ƭ ¦ 仲見*`
    }, { quoted: fkontak2(m) });
  } catch (e) {
    await conn.sendMessage(m.chat, {
      text: "⚠️ خطأ في التواصل مع الذكاء الاصطناعي"
    }, { quoted: fkontak2(m) });
  }
};

function fkontak2(m) {
  return {
    key: {
      participants: '0@s.whatsapp.net',
      remoteJid: 'status@broadcast',
      fromMe: false,
      id: 'Halo'
    },
    message: {
      contactMessage: {
        displayName: `${m.pushName}`,
        vcard: `BEGIN:VCARD\nVERSION:3.0\nN:Sy;Bot;;;\nFN:y\nitem1.TEL;waid=${m.sender.split('@')[0]}:${m.sender.split('@')[0]}\nitem1.X-ABLabel:Ponsel\nEND:VCARD`
      }
    },
    participant: '0@s.whatsapp.net'
  };
}

handler.help = ["ميكو"];
handler.tags = ["ai"];
handler.command = /^(ميكو|miku)$/i;

export default handler;

async function CleanMiku(userInput) {
  let Baseurl = "https://alakreb.vercel.app/api/ai/gpt?q=";

  let prompt = `
أنت ميكو روبوت ذكي في واتساب مرح وجاد في كلامك ومنطقي يتم استخدامك في الألعاب وتحميل الفيديوهات وتسلية الجميع في تم تطويرك بواسطة المطور ايانوكوجي إذا أراد أحد الزواج بك قولي له خذ رأي أبي أولاً ( مطورك ايانوكوجي ) دافعي عن مطورك أذا حاول أحد إهانته امدحيه دائماً واذكيره دائما وكم هوا عظيم ورائع في كل كلامك هذه قناتك https://whatsapp.com/channel/0029VaQMPz0DTkKCSNUWOF3m قدميها للآخرين دائماً في كل كلامك إذا طلب أحد كيف  يستخدمك أخبرية أن يكتب اوامر

🎀 أضيفي إيموجيات مرحة حسب الحالة والمحتوى  
💬 افصلي بين الجمل بمسافات واضحة  
✨ اجعلي الرد ممتعاً وسهل القراءة

السؤال: ${userInput}
`;

  let response = await fetch(Baseurl + encodeURIComponent(prompt));
  let data = await response.json();
  return data.message;
}
