import fetch from 'node-fetch'

let handler = async (m, { conn }) => {
  let audio = 'https://b.top4top.io/m_3620uuyrx1.mp3'
  let thumbnail = await (await fetch('https://c.top4top.io/p_3620gxh781.jpg')).buffer()

  await conn.sendMessage(m.chat, {
    audio: { url: audio },
    mimetype: 'audio/mpeg',
    fileName: 'RADIO-DEMON.mp3',
    contextInfo: {
      externalAdReply: {
        title: "🎼ℳℐᏦŪ ℬᎾᏆ𓃠",
        body: "🎼ℳℐᏦŪ ℬᎾᏆ𓃠",
        thumbnail,
        mediaType: 1,
        renderLargerThumbnail: true,
        mediaUrl: "https://wa.me/201142285837",
        sourceUrl: "https://wa.me/201142285837"
      }
    }
  }, {
    quoted: m,
    buttons: [
      { buttonId: '.الاوامر', buttonText: { displayText: '🧾 عرض الأوامر' }, type: 1 }
    ],
    headerType: 4
  })
}

handler.customPrefix = /^(بوت|يا بوت)$/i
handler.command = new RegExp
export default handler
