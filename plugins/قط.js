import fetch from 'node-fetch';
import { prepareWAMessageMedia, generateWAMessageFromContent } from '@whiskeysockets/baileys';

let handler = async (m, { conn, text }) => {
  try {
    let res = await fetch('https://cataas.com/cat');
    let img = await res.buffer();
    let caption = `*🌸╎❯ اضـغـط عـلـي الـزر لـأرسـال واحـده اخـري*\n\n> *🌷ണĨƘ♡ β♡Ƭ ¦ 仲見*`.trim();

    const media = await prepareWAMessageMedia({ image: img }, { upload: conn.waUploadToServer });

    const interactiveMessage = {
      body: { text: caption },
      header: {
        hasMediaAttachment: true,
        imageMessage: media.imageMessage,
      },
      nativeFlowMessage: {
        buttons: [
          {
            "name": "quick_reply",
            "buttonParamsJson": `{"display_text":"༺⊱الـتــالـي‌⊰༻","id":".قط"}`,
          },
          {
            "name": "cta_url",
            "buttonParamsJson": `{"display_text":"قٰཻــ͒͜ـًناة دِعـ๋͜‏ـۂمـٰ وُاخــ۫͜ـبـاࢪ","url":"https://whatsapp.com/channel/0029VaQMPz0DTkKCSNUWOF3m","merchant_url":"https://whatsapp.com/channel/0029VaQMPz0DTkKCSNUWOF3m"}`,
          }
        ],
        messageParamsJson: ''
      }
    };

    let msg = generateWAMessageFromContent(m.chat, {
      viewOnceMessage: {
        message: {
          interactiveMessage,
        },
      },
    }, { userJid: conn.user.jid, quoted: m });

    conn.relayMessage(m.chat, msg.message, { messageId: msg.key.id });

  } catch (e) {
    console.log(e);
    throw '*اسف حدث خطا!*';
  }
};

handler.help = ['cat'];
handler.tags = ['random'];
handler.command = /^قط|قطة|قطه$/i;
handler.fail = null;

export default handler;