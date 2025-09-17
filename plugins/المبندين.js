//import db from '../lib/database.js'

let handler = async (m, { conn, usedPrefix }) => {
    let chats = Object.entries(global.db.data.chats).filter(chat => chat[1].isBanned)
    let users = Object.entries(global.db.data.users).filter(user => user[1].banned)

    m.reply(`
≡ *المستخدمون المحظورون*

▢ الإجمالي: *${users.length}*

${users ? '\n' + users.map(([jid], i) => `
${i + 1}. ${conn.getName(jid) == undefined ? 'غير معروف' : conn.getName(jid)}
▢ ${jid}
`.trim()).join('\n') : ''}
`.trim())
}
handler.help = ['listban']
handler.tags = ['owner']
handler.command = ['المبندين']

handler.owner = true


export default handler
