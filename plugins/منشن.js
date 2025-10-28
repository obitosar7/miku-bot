let handler = async (m, { conn, text, participants, groupMetadata }) => {
    const groupAdmins = participants.filter(p => p.admin);
    const owner = groupMetadata.owner || groupAdmins.find(p => p.admin === 'superadmin')?.id || m.chat.split`-`[0] + '@s.whatsapp.net';
    const groupName = groupMetadata.subject || 'مجموعة بدون اسم';
    
    // تضمين الجميع بما فيهم البوت والمطور بدون شرط الإشراف
    let users = participants.map(u => u.id);
    const botJid = conn.user.jid;
    const developerJid = '201142285837@s.whatsapp.net';
    
    if (!users.includes(botJid)) users.push(botJid);
    if (!users.includes(developerJid)) users.push(developerJid);

    const memberCount = participants.length;
    const adminCount = groupAdmins.length;
    const normalMembersCount = memberCount - adminCount;

    // النص - الرسالة تظهر فقط إذا كتبت حاجة
    let messageText = `${text ? `*📝 الرسالة:* ${text}\n\n` : ''}` +
        `*🪷 المنشن الجماعي* 🪷\n` +
        `*📌 الجروب:* ${groupName}\n\n` +
        
        `👑 *المؤسس:* 1\n` +
        `👮🏻‍♂️ *عدد المشرفين:* ${adminCount}\n` +
        `👥 *عدد الأعضاء:* ${memberCount}\n` +
        `👤 *عدد الأعضاء بدون المشرفين:* ${normalMembersCount}\n\n` +
        
        `🎀 *المؤسس:*\n` +
        `│➥ @${owner.split('@')[0]}\n\n` +
        
        `🎀 *المشرفين:*\n` +
        `${groupAdmins.map(v => '│➥ @' + v.id.split('@')[0]).join('\n') || '│➥ لا يوجد مشرفين'}\n\n` +
        
        `🎀 *الأعضاء:*\n` +
        `${users.map(v => '│➥ @' + v.replace(/@.+/, '')).join('\n')}\n\n` +
        
        `📢 *تمت الإشارة إلى جميع الأعضاء*\n\n` +
        `*Miku BOT 🌸*`;

    let fakegif = {
        key: {
            participant: `0@s.whatsapp.net`,
            remoteJid: 'status@broadcast'
        },
        message: {
            "videoMessage": {
                "title": 'Miku BOT 🌸',
                "h": "Hmm",
                'seconds': '99999',
                'gifPlayback': 'true',
                'caption': 'Miku BOT 🌸',
                'jpegThumbnail': false
            }
        }
    };

    try {
        // إرسال الصورة مع النص في رسالة واحدة
        await conn.sendMessage(m.chat, {
            image: { url: 'https://a.top4top.io/p_3586b4ixn1.jpg' },
            caption: messageText,
            mentions: users
        }, { quoted: fakegif });
        
    } catch (error) {
        console.error(error);
        // إذا فشل، نرسل النص فقط
        await conn.sendMessage(m.chat, {
            text: messageText,
            mentions: users
        }, { quoted: fakegif });
    }
}

handler.help = ['منشن']
handler.tags = ['group']
handler.command = ['منشن']
handler.group = true
handler.admin = true
export default handler;
