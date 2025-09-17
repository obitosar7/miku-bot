let toM = a => '@' + a.split('@')[0]
function handler(m, { groupMetadata }) {
let ps = groupMetadata.participants.map(v => v.id)
let a = ps.getRandom()
let b
do b = ps.getRandom()
while (b === a)
m.reply(`${toM(a)},  
${toM(b)}, *تم اختياركم للزواج غظب 😼*`, null, {
mentions: [a, b]
})}
handler.help = ['formarpareja']
handler.tags = ['main', 'fun']
handler.command = ['جواز','زواج']
handler.group = true
handler.limit = 4
handler.prem
export default handler