import fetch from 'node-fetch'
import FormData from 'form-data'
import fs from 'fs'
import path from 'path'
import { fileTypeFromBuffer } from 'file-type'
import { generateWAMessageFromContent } from '@whiskeysockets/baileys'

let handler = async (m, { conn }) => {
  let filepath
  try {
    if (!m.quoted) {
      return conn.sendMessage(m.chat, { text: '❌ الرجاء الرد على أي وسائط لرفعها.' }, { quoted: m })
    }

    const mime = m.quoted.mimetype
    if (!mime) {
      return conn.sendMessage(m.chat, { text: '❌ الوسائط غير مدعومة أو غير موجودة.' }, { quoted: m })
    }

    const buffer = await m.quoted.download()
    if (!buffer) throw new Error('فشل تحميل الوسائط.')

    const type = await fileTypeFromBuffer(buffer)
    const ext = type?.ext || mime.split('/')[1] || 'bin'
    const fileType = mime.split('/')[0]
    const fullExt = `.${ext}`
    const fileName = `upload_${Date.now()}.${ext}`
    const fileSize = (buffer.length / 1024 / 1024).toFixed(2) + ' MB'

    filepath = path.join('/tmp', fileName)
    fs.writeFileSync(filepath, buffer)

    const form = new FormData()
    form.append('reqtype', 'fileupload')
    form.append('fileToUpload', fs.createReadStream(filepath))

    const res = await fetch('https://catbox.moe/user/api.php', {
      method: 'POST',
      body: form,
      headers: form.getHeaders()
    })

    const fileUrl = (await res.text()).trim()
    if (!res.ok || !fileUrl.startsWith('https')) throw new Error('فشل الرفع.')

    const infoText = `
*✓┊تـم رفـع الـوسـائـط بـنـجـاح*
*` + '`≼━┉─≼مـعـلـومـات الـمـلـف≽─┉━≽`' + `*
> *اسـم الـمـلـف:* ${fileName}
> *نـوع الـمـلـف:* ${fileType}
> *صـيـغـة الـمـلـف:* ${mime}
> *الـامـتـداد الـكـامـل لـلـمـلـف:* ${fullExt}
> *حـجـم الـمـلـف:* ${fileSize}
> *رابـط الـمـلـف:* ${fileUrl}
`.trim()

    const interactiveMessage = {
      body: { text: infoText },
      nativeFlowMessage: {
        buttons: [
          {
            name: 'cta_copy',
            buttonParamsJson: JSON.stringify({
              display_text: 'نـسـخ رابـط الـمـلـف',
              copy_code: fileUrl
            })
          }
        ],
        messageParamsJson: ''
      }
    }

    const msg = generateWAMessageFromContent(
      m.chat,
      {
        viewOnceMessage: {
          message: { interactiveMessage }
        }
      },
      { userJid: conn.user.jid, quoted: m }
    )

    await conn.relayMessage(m.chat, msg.message, { messageId: msg.key.id })

  } catch (e) {
    await conn.sendMessage(
      m.chat,
      { text: `❌ حدث خطأ أثناء الرفع:\n${e.message || e}` },
      { quoted: m }
    )
  } finally {
    if (filepath && fs.existsSync(filepath)) fs.unlinkSync(filepath)
  }
}

handler.command = ['للينك','لرابط']
handler.tags = ['tools']
export default handler
