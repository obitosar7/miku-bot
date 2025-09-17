let handler = async (m, { conn, text, participants, groupMetadata }) => {
    const groupAdmins = participants.filter(p => p.admin);
    const owner = groupMetadata.owner || groupAdmins.find(p => p.admin === 'superadmin')?.id || m.chat.split`-`[0] + '@s.whatsapp.net';
    const users = participants.map(u => u.id).filter(v => v !== conn.user.jid);

    const adminList = groupAdmins.map(v => '🌸 @' + v.id.split('@')[0]).join(', ');
    const memberCount = participants.length;

    // جلب بيانات المستخدم من قاعدة البيانات
    let user = global.db.data.users[m.sender];
    if (!user) {
        user = global.db.data.users[m.sender] = {};
    }

    let currentTime = new Date().getTime();
    let lastUsedTime = user.lastMention || 0;
    let timeDifference = currentTime - lastUsedTime;
    let cooldown = 600000; // عشر دقائق بالميلي ثانية

    if (timeDifference < cooldown) {
        let timeRemaining = msToTime(cooldown - timeDifference);
        throw `*⏰╎❯ إنـتـظـر ${timeRemaining}    لـلـاسـتـخـدام مـرة أخـرى*`;
    }

    // تحديث وقت الاستخدام الأخير
    user.lastMention = currentTime;

    m.reply(`${text ? `${text}\n` : ''}
✠═ • ═ •༺⊱╣🌸╣⊰༻• ═ • ═✠
*『 الـمـنـشـن ⊰🪷⊱ الـجـمـاعـي 』*
*👑╎❯ الـمـؤسـس:* @${owner.split('@')[0]}
*🌸╎❯ الـمـشـرفـيـن:* ${adminList || 'لا يوجد مشرفين'}
*👥╎❯ عدد الأعضاء:* ${memberCount} *عـضـو*
\n` + users.map(v => '│◦❈↲ 🌸 @' + v.replace(/@.+/, '')).join`\n` + '\n*✠═ • ═ •༺⊱╣🌸╣⊰༻• ═ • ═✠*', null, {
        mentions: [owner, ...groupAdmins.map(v => v.id), ...users]
    });
}

handler.help = ['منشن']
handler.tags = ['group']
handler.command = ['منشن']
handler.admin = true
handler.group = true

export default handler;

function msToTime(duration) {
    var milliseconds = parseInt((duration % 1000) / 100),
        seconds = Math.floor((duration / 1000) % 60),
        minutes = Math.floor((duration / (1000 * 60)) % 60),
        hours = Math.floor((duration / (1000 * 60 * 60)) % 24);

    hours = (hours < 10) ? "0" + hours : hours;
    minutes = (minutes < 10) ? "0" + minutes : minutes;
    seconds = (seconds < 10) ? "0" + seconds : seconds;

    return minutes + " دقيقة " + seconds + " ثانية";
}