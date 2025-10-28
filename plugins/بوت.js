import { prepareWAMessageMedia, generateWAMessageFromContent } from '@whiskeysockets/baileys';

const handler = async (m, { conn }) => {
    const imageUrl = "https://files.catbox.moe/x55za2.jpg"; // الصورة المصغرة
    const link1 = "https://wa.me/201287993468"; // رابط المطور (بدون مسافة)
    const link2 = "https://whatsapp.com/channel/0029VaQMPz0DTkKCSNUWOF3m"; // رابط القناة

    // تجهيز الصورة
    const media = await prepareWAMessageMedia(
        { image: { url: imageUrl } },
        { upload: conn.waUploadToServer }
    );

    // إنشاء الرسالة
    const interactiveMessage = {
        body: { text: "مـرحـبـا 👋\nاسـمـي *ميكو*  🎧\nاستخدم أمر (.اوامر) لطلب القائمة 🎶" },
        footer: { text: "｢🎼ℳℐᏦŪ ℬᎾᏆ 𓃠｣" },
        header: { 
            title: "*🎼ℳℐᏦŪ ℬᎾᏆ𓃠*", 
            hasMediaAttachment: true, 
            imageMessage: media.imageMessage 
        },
        nativeFlowMessage: {
            buttons: [
                {
                    name: "cta_url",
                    buttonParamsJson: JSON.stringify({
                        display_text: "｢🌸┊للمـطـور┊🌸｣",
                        url: link1
                    })
                },
                {
                    name: "cta_url",
                    buttonParamsJson: JSON.stringify({
                        display_text: "｢🎼┊القناة┊🎼｣",
                        url: link2
                    })
                },
                {
                    name: "quick_reply",
                    buttonParamsJson: JSON.stringify({
                        display_text: "⌈🎶✬⃝╎اوامر╎🎶✬⃝⌋",
                        id: ".اوامر"
                    })
                }
            ]
        }
    };

    // إرسال الرسالة
    const msg = generateWAMessageFromContent(
        m.chat,
        { viewOnceMessage: { message: { interactiveMessage } } },
        { userJid: conn.user.jid, quoted: m }
    );

    await conn.relayMessage(m.chat, msg.message, { messageId: msg.key.id });
};

handler.command = /^بوت$/i; // الأمر .بوت

export default handler;
