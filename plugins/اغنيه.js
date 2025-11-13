import axios from "axios";
import yts from "yt-search";

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

// استخدام مصادر متعددة للتحميل
const APIS = {
  izumi: {
    byUrl: (url) => `https://izumiiiiiiii.dpdns.org/downloader/youtube?url=${encodeURIComponent(url)}&format=mp3`,
    byQuery: (query) => `https://izumiiiiiiii.dpdns.org/downloader/youtube-play?query=${encodeURIComponent(query)}`
  },
  okatsu: {
    byUrl: (url) => `https://okatsu-rolezapiiz.vercel.app/downloader/ytmp3?url=${encodeURIComponent(url)}`
  }
};

async function tryRequest(getter, attempts = 3) {
  let lastError;
  for (let attempt = 1; attempt <= attempts; attempt++) {
    try {
      return await getter();
    } catch (err) {
      lastError = err;
      if (attempt < attempts) {
        await new Promise(r => setTimeout(r, 1000 * attempt));
      }
    }
  }
  throw lastError;
}

async function getDownloadLink(youtubeUrl, query = null) {
  // المحاولة الأولى: Izumi بالرابط
  try {
    const res = await tryRequest(() => axios.get(APIS.izumi.byUrl(youtubeUrl)));
    if (res?.data?.result?.download) {
      return {
        dlurl: res.data.result.download,
        title: res.data.result.title,
        thumbnail: { high: res.data.result.thumbnail }
      };
    }
  } catch (e1) {
    // المحاولة الثانية: Izumi بالبحث
    if (query) {
      try {
        const res = await tryRequest(() => axios.get(APIS.izumi.byQuery(query)));
        if (res?.data?.result?.download) {
          return {
            dlurl: res.data.result.download,
            title: res.data.result.title,
            thumbnail: { high: res.data.result.thumbnail }
          };
        }
      } catch (e2) {
        // المحاولة الثالثة: Okatsu
        try {
          const res = await tryRequest(() => axios.get(APIS.okatsu.byUrl(youtubeUrl)));
          if (res?.data?.dl) {
            return {
              dlurl: res.data.dl,
              title: res.data.title,
              thumbnail: { high: res.data.thumb }
            };
          }
        } catch (e3) {
          throw new Error('جميع محاولات التحميل فشلت');
        }
      }
    }
  }
}

let handler = async (m, { conn, args, text }) => {
  if (!text) return m.reply("❗ من فضلك اكتب رابط الفيديو أو اسم الأغنية بعد الأمر.\n💡 مثال: \n.اغنيه عمرو دياب");

  try {
    await conn.sendMessage(m.chat, { react: { text: '🔎', key: m.key } });

    let url = null;
    let videoInfo = {};

    if (text.includes("youtube.com") || text.includes("youtu.be")) {
      url = text;
      // الحصول على معلومات الفيديو من الرابط
      const search = await yts({ videoId: getVideoId(url) });
      videoInfo = {
        title: search.title,
        thumbnail: search.thumbnail,
        timestamp: search.timestamp
      };
    } else {
      const search = await yts(text);
      if (!search.videos || !search.videos.length) return m.reply("❌ لم يتم العثور على نتائج.");
      const video = search.videos[0];
      url = video.url;
      videoInfo = {
        title: video.title,
        thumbnail: video.thumbnail,
        timestamp: video.timestamp
      };
    }

    await conn.sendMessage(m.chat, { react: { text: '⏳', key: m.key } });

    const downloadData = await getDownloadLink(url, videoInfo.title || text);

    if (!downloadData) return m.reply('⚠️ فشل الحصول على رابط التحميل.');

    const { dlurl, title, thumbnail } = downloadData;

    const audioBuffer = (await axios.get(dlurl, { responseType: "arraybuffer" })).data;

    await conn.sendMessage(m.chat, {
      audio: Buffer.from(audioBuffer),
      mimetype: 'audio/mpeg',
      ptt: false, 
      fileName: `${title}.mp3`,
      contextInfo: {
        mentionedJid: [m.sender],
        externalAdReply: {
          title: `📄 العنوان: ${title}`,
          body: 'أنا لا أتحمل ذنب ما تشاهده أو تسمعه',
          thumbnailUrl: thumbnail.high, 
          mediaUrl: url,
          sourceUrl: url,
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

// دالة مساعدة لاستخراج ID من رابط يوتيوب
function getVideoId(url) {
  const match = url.match(/(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/);
  return match ? match[1] : null;
}

handler.help = ["اغنيه"];
handler.tags = ["main"];
handler.command = ["اغنيه", "اغنية"];

export default handler;
