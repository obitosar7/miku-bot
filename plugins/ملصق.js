import { sticker } from '../lib/sticker.js';
import uploadFile from '../lib/uploadFile.js';
import uploadImage from '../lib/uploadImage.js';
import { webp2png } from '../lib/webp2mp4.js';

const handler = async (m, { conn, args, usedPrefix, command }) => {
  let stiker = false;
  try {
    const q = m.quoted ? m.quoted : m;
    const mime = (q.msg || q).mimetype || q.mediaType || '';
    const metadata = {
      isAiSticker: true
    };

    if (/webp|image|video/g.test(mime)) {
      const img = await q.download?.();
      if (!img) throw `*❗╎❯ يـجـب عـلـيـك أن تـرسـل صـوره او فـيـديـو لـتـحـويـلـها إلـي لـسـتـيـكـر*`;
      let out;
      try {
        stiker = await sticker(img, false, global.packname, global.author, ["✨"], metadata);
      } catch (e) {
        console.error(e);
      } finally {
        if (!stiker) {
          if (/webp/g.test(mime)) out = await webp2png(img);
          else if (/image/g.test(mime)) out = await uploadImage(img);
          else if (/video/g.test(mime)) out = await uploadFile(img);
          if (typeof out !== 'string') out = await uploadImage(img);
          stiker = await sticker(false, out, global.packname, global.author, ["✨"], metadata);
        }
      }
    } else if (args[0]) {
      if (isUrl(args[0])) stiker = await sticker(false, args[0], global.packname, global.author, ["✨"], metadata);
      else return m.reply(`*❗╎❯ يـجـب عـلـيـك أن تـرسـل صـوره او فـيـديـو لـتـحـويـلـها إلـي لـسـتـيـكـر*`);
    }
  } catch (e) {
    console.error(e);
    if (!stiker) stiker = e;
  } finally {
    if (stiker) conn.sendFile(m.chat, stiker, 'sticker.webp', '', m);
    else return m.reply(`*❗╎❯ يـجـب عـلـيـك أن تـرسـل صـوره او فـيـديـو لـتـحـويـلـها إلـي لـسـتـيـكـر*`);
  }
};

handler.help = ['sfull'];
handler.tags = ['sticker'];
handler.command = /^(ملصق|ستيك?ر|s)$/i;

export default handler;

const isUrl = (text) => {
  return text.match(new RegExp(/https?:\/\/(www\.)?[-a-zA-Z0-9@:%._+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_+.~#?&/=]*)(jpe?g|gif|png)/, 'gi'));
};