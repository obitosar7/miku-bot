let handler = async (m, { conn, text, participants }) => {
let member = participants.map(u => u.id)
if(!text) {
var sum = member.length
} else {
var sum = text} 
var total = 0
var sider = []
for(let i = 0; i < sum; i++) {
let users = m.isGroup ? participants.find(u => u.id == member[i]) : {}
if((typeof global.db.data.users[member[i]] == 'undefined' || global.db.data.users[member[i]].chat == 0) && !users.isAdmin && !users.isSuperAdmin) { 
if (typeof global.db.data.users[member[i]] !== 'undefined'){
if(global.db.data.users[member[i]].whitelist == false){
total++
sider.push(member[i])}
}else {
total++
sider.push(member[i])}}}
if(total == 0) return conn.reply(m.chat, `*🌸╎❯ هـذه الـمـجـمـوعـه نـشـطـه لـيـس فـيـهـا اشـبـاح*`, m) 
m.reply(`*[ *❗╎❯ الـأعـضـاء الـغـيـر مـتـفـاعـلـيـن* ]*\n\n*فـي الـجـروب:* ${await conn.getName(m.chat)}\n*الاعضاء:* ${sum}\n\n*[ *『 قـائـمـة ⊰👻⊱ الـاشـبـاح 』* ]*\n${sider.map(v => '  ❈↲ صحي نوم  @' + v.replace(/@.+/, '')).join('\n')}\n\n*ملحوظة : مش شرط ان البوت يكون صح 100% غير انه بيعد الرسايل وهو شغال بس او وقت ما دخل الجروب + الاشباح هنا المقصود بيهم ال دخلو الجروب ومتفاعلوش خالص*`, null, { mentions: sider })}
handler.command = /^(اشباح|الاشباح|نايمين|الأصنام|اصنام)$/i
handler.admin = true
handler.botAdmin = true
export default handler