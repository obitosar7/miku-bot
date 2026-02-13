import axios from "axios";
import yts from "yt-search";

const fcontact = (m) => ({
  key: {
    fromMe: false,
    participant: `0@s.whatsapp.net`,
    remoteJid: "status@broadcast",
  },
  message: {
    contactMessage: {
      displayName: `${m.pushName || "User"}`,
      vcard: `BEGIN:VCARD\nVERSION:3.0\nN:;${m.pushName || "User"};;;\nFN:${m.pushName || "User"}\nitem1.TEL;waid=${
        m.sender.split("@")[0]
      }:${m.sender.split("@")[0]}\nitem1.X-ABLabel:Ponsel\nEND:VCARD`,
    },
  },
});

// ✅ API الجديد
const API_KEY = "xshadowzax"; // غيّره لو عندك مفتاح مختلف
const CAVIROX_API = (q) =>
  `https://apix.cavirox.com/api/download/yt?q=${encodeURIComponent(q)}&apikey=${encodeURIComponent(
    API_KEY
  )}`;

async function getDownloadFromCavirox(queryOrUrl) {
  const res = await axios.get(CAVIROX_API(queryOrUrl), {
    timeout: 30_000,
    validateStatus: () => true,
  });

  // شكل الرد حسب المثال:
  // { status: true, title, duration, url, thumbnail, downloads: { mp3, mp4 } }
  const data = res?.data;

  if (!data || data.status !== true) {
    // حاول استخراج رسالة لو موجودة، وإلا رسالة عامة
    throw new Error(data?.message || "فشل API في جلب بيانات التحميل");
  }

  const mp3 = data?.downloads?.mp3;
  if (!mp3) throw new Error("لم يتم العثور على رابط mp3 داخل API");

  return {
    dlurl: mp3,
    title: data.title || "audio",
    thumbnail: { high: data.thumbnail },
    url: data.url, // رابط اليوتيوب (مفيد للكرت)
    duration: data.duration,
    views: data.views,
  };
}

let handler = async (m, { conn, args, text }) => {
  if (!text)
    return m.reply(
      "❗ من فضلك اكتب رابط الفيديو أو اسم الأغنية بعد الأمر.\n💡 مثال:\n.اغنيه عمرو دياب"
    );

  try {
    await conn.sendMessage(m.chat, { react: { text: "🔎", key: m.key } });

    // نجلب معلومات فيديو للعرض (اختياري) من yt-search
    let videoInfo = {};
    let ytUrl = null;

    if (text.includes("youtube.com") || text.includes("youtu.be")) {
      ytUrl = text;
      const vid = await yts({ videoId: getVideoId(text) });
      videoInfo = {
        title: vid?.title,
        thumbnail: vid?.thumbnail,
        timestamp: vid?.timestamp,
      };
    } else {
      const search = await yts(text);
      if (!search.videos || !search.videos.length)
        return m.reply("❌ لم يتم العثور على نتائج.");
      const video = search.videos[0];
      ytUrl = video.url;
      videoInfo = {
        title: video.title,
        thumbnail: video.thumbnail,
        timestamp: video.timestamp,
      };
    }

    await conn.sendMessage(m.chat, { react: { text: "⏳", key: m.key } });

    // ✅ نستخدم API الجديد: الأفضل نرسل له "العنوان" أو "النص" لأنه يقبل q
    const q = videoInfo.title || text;
    const downloadData = await getDownloadFromCavirox(q);

    const { dlurl, title, thumbnail, url } = downloadData;

    const audioBuffer = (
      await axios.get(dlurl, { responseType: "arraybuffer", timeout: 60_000 })
    ).data;

    await conn.sendMessage(
      m.chat,
      {
        audio: Buffer.from(audioBuffer),
        mimetype: "audio/mpeg",
        ptt: false,
        fileName: `${title}.mp3`,
        contextInfo: {
          mentionedJid: [m.sender],
          externalAdReply: {
            title: `📄 العنوان: ${title}`,
            body: "أنا لا أتحمل ذنب ما تشاهده أو تسمعه",
            thumbnailUrl: thumbnail?.high || videoInfo.thumbnail,
            mediaUrl: url || ytUrl,
            sourceUrl: url || ytUrl,
            renderLargerThumbnail: true,
          },
        },
      },
      { quoted: fcontact(m) }
    );

    await conn.sendMessage(m.chat, { react: { text: "✅", key: m.key } });
  } catch (err) {
    console.error(err);
    m.reply(`⚠️ خطأ أثناء التحميل: ${err.message}`);
  }
};

// دالة مساعدة لاستخراج ID من رابط يوتيوب
function getVideoId(url) {
  const match = url.match(
    /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/
  );
  return match ? match[1] : null;
}

handler.help = ["اغنيه"];
handler.tags = ["main"];
handler.command = ["اغنيه", "اغنية"];

export default handler;
