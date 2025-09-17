let handler = async (m, { conn, args, usedPrefix, command }) => {
  if (!args[0]) return m.reply(`*ارسل رابط فيديو من Pinterest*\n*~مـثـل ↧~*\n*${usedPrefix + command} https://pin.it/4CS5n5xsW*`);

  try {
    let url = args[0];
    let res = await fetch(`https://api.obito-sar.store/api/download/pin?url=${encodeURIComponent(url)}`);
    let data = await res.json();

let reactionMsg = await conn.sendMessage(m.chat, {
    react: { text: "⏳", key: m.key }
  });

    if (!data.status || !data.obitosar || !data.obitosar.video_url) {
      return m.reply("✦ حدث خطأ أثناء جلب الفيديو، تأكد من الرابط.");
    }

    await conn.sendMessage(m.chat, {
      video: { url: data.obitosar.video_url },
      caption: "*❮ ✅ ┇ تم تحميل الفيديو بنجاح ❯*\n> *أنا لا أتحمل ذنوب ما تشاهده أو تسمعه*"
    }, { quoted: m });

await conn.sendMessage(m.chat, {
        react: { text: "✅", key: m.key }
      });

  } catch (e) {
    console.error(e);
    m.reply("✦ حصل خطأ غير متوقع.");
  }
};

handler.help = ['pin'];
handler.tags = ['downloader'];
handler.command = /^بين-لنك$/i;

export default handler;