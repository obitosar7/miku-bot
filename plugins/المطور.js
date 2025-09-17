import baileys from '@whiskeysockets/baileys';
const { generateWAMessageFromContent, proto } = baileys;

let handler = async (m, { conn, command }) => {
  const watermark = 'り乇√!╎الـمـطــور';

  const devData = {
    dev1: {
      number: '994403343225',
      name: 'ᏫᏰᎥᎿᏫᏚᎯᎡ!╎الـمـطــور',
      thumbnailUrl: 'https://files.catbox.moe/mf9ifc.jpg'
    },
    dev2: {
      number: '201287993468',
      name: 'ᎯᎽᎯᏁᎯᏦᏫᎫᎥ!╎الـمـطــور',
      thumbnailUrl: 'https://telegra.ph/file/beb64ee07ac8b9a2af443.jpg'
    }
  };

  const getExternalAdReply = (key) => ({
    title: '𝑇𝛨𝛯 𝛩𝑊𝛮𝛯𝑅 ❤️‍🔥⛩️📛',
    body: watermark,
    sourceUrl: 'https://whatsapp.com/channel/0029VaQMPz0DTkKCSNUWOF3m',
    thumbnail: null,
    thumbnailUrl: devData[key]?.thumbnailUrl,
    mediaType: 1,
    showAdAttribution: true,
    renderLargerThumbnail: true,
    mentionedJid: [m.sender]
  });

  const fakeContact = {
    key: {
      participants: '0@s.whatsapp.net',
      remoteJid: 'status@broadcast',
      fromMe: false,
      id: watermark
    },
    message: {
      contactMessage: {
        vcard: 'BEGIN:VCARD\nVERSION:3.0\nN:Sy;Bot;;;\nFN:y\nitem1.TEL;waid=000:000\nitem1.X-ABLabel:Ponsel\nEND:VCARD'
      }
    },
    participant: '0@s.whatsapp.net'
  };

  if (['owner', 'المطور', 'مطور'].includes(command.toLowerCase())) {
    const msg = generateWAMessageFromContent(m.chat, {
      viewOnceMessage: {
        message: {
          messageContextInfo: {
            deviceListMetadata: {},
            deviceListMetadataVersion: 2
          },
          interactiveMessage: proto.Message.InteractiveMessage.create({
            body: proto.Message.InteractiveMessage.Body.create({
              text: `╭ ⋅ ⋅ ── ⋅ ⋅ ── ✩ ── ⋅ ⋅ ── ⋅ ⋅ ╮

🐉╎❯ هذا هم المطورين البوت التحدث معهم استفسار اي شيء & الاشتراك

╰⋅ ⋅ ── ⋅ ⋅ ── ✩ ── ⋅ ⋅ ── ⋅ ⋅ ╯`
            }),
            footer: proto.Message.InteractiveMessage.Footer.create({ text: "" }),
            header: proto.Message.InteractiveMessage.Header.create({
              hasMediaAttachment: false
            }),
            nativeFlowMessage: proto.Message.InteractiveMessage.NativeFlowMessage.create({
              buttons: [
                {
                  name: "quick_reply",
                  buttonParamsJson: JSON.stringify({
                    display_text: "𝛩𝑊𝛮𝛯𝑅 1",
                    id: ".dev1"
                  })
                },
                {
                  name: "quick_reply",
                  buttonParamsJson: JSON.stringify({
                    display_text: "𝛩𝑊𝛮𝛯𝑅 2",
                    id: ".dev2"
                  })
                }
              ]
            })
          })
        }
      }
    }, {
      quoted: m,
      contextInfo: {
        forwardingScore: 2023,
        isForwarded: false,
        externalAdReply: getExternalAdReply('dev2') // ثابتة لصورة العرض
      }
    });

    await conn.relayMessage(msg.key.remoteJid, msg.message, { messageId: msg.key.id });

  } else if (['dev1', 'dev2'].includes(command.toLowerCase())) {
    const dev = devData[command.toLowerCase()];
    await conn.sendContact(m.chat, [[dev.number, dev.name]], fakeContact, {
      contextInfo: {
        forwardingScore: 2025,
        isForwarded: false,
        externalAdReply: getExternalAdReply(command.toLowerCase())
      }
    }, { quoted: fakeContact });
  }
};

handler.help = ['owner', 'dev1', 'dev2'];
handler.tags = ['info'];
handler.command = ['owner', 'المطور', 'مطور', 'dev1', 'dev2'];

export default handler;