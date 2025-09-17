import axios from "axios";

const fcontact = (m) => ({
  key: {
    fromMe: false,
    participant: `0@s.whatsapp.net`,
    remoteJid: 'status@broadcast'
  },
  message: {
    contactMessage: {
      displayName: `${m.pushName || "User"}`,
      vcard: `BEGIN:VCARD\nVERSION:3.0\nN:;${m.pushName || "User"};;;\nFN:${m.pushName || "User"}\nitem1.TEL;waid=${m.sender.split('@')[0]}:${m.sender.split('@')[0]}\nitem1.X-ABLabel:Ponsel\nEND:VCARD`
    }
  }
});

const apiBaseUrl = "https://api.obito-sar.store/api/download/youtube";

let handler = async (m, { conn, args, text }) => {
  if (!text) return m.reply("⚠️ من فضلك اكتب رابط الفيديو بعد الأمر.\n💡 مثال: اغنيه https://youtu.be/XXXXX");

  try {
    await conn.sendMessage(m.chat, { react: { text: '🔎', key: m.key } });

    const url = text.includes("youtube.com") || text.includes("youtu.be") ? text : null;
    if (!url) return m.reply("❌ الرابط غير صالح.");

    await conn.sendMessage(m.chat, { react: { text: '⏳', key: m.key } });

    const { data } = await axios.get(`${apiBaseUrl}?url=${encodeURIComponent(url)}&format=audio`);

    if (!data.status || !data.data) return m.reply('⚠️ فشل الحصول على رابط التحميل.');

    const { dlurl, title, thumbnail } = data.data;

    await conn.sendMessage(m.chat, {
      audio: { url: dlurl },
      mimetype: 'audio/mpeg',
      ptt: true,
      contextInfo: {
        mentionedJid: [m.sender],
        externalAdReply: {
          title: `📄 العنوان: ${title}`,
          body: 'أنا لا أتحمل ذنب ما تشاهده أو تسمعه',
          thumbnail: Buffer.from(await (await fetch(thumbnail.high)).arrayBuffer()),
          mediaUrl: url,
          sourceUrl: url,
          mediaType: 2,
          renderLargerThumbnail: true,
        }
      }
    }, { quoted: fcontact(m) });

    await conn.sendMessage(m.chat, { react: { text: '✅', key: m.key } });

  } catch (err) {
    console.error(err);
    m.reply(`⚠️ خطأ أثناء التحميل: ${err.message}`);
  }
};

handler.help = ["اغنيه"];
handler.tags = ["main"];
handler.command = ["اغنيه", "اغنية"];

export default handler;