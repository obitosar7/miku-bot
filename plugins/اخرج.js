let handler = async (m, { conn }) => {
  await m.reply('📤 تم إصدار أمر من مطوري بخروجي من هذا الجروب...\n👋🏼 السلام عليكم');
  await conn.groupLeave(m.chat);
};

handler.help = ['اخرج'];
handler.tags = ['group'];
handler.command = ['اخرج'];
handler.group = true;
handler.owner = true;
handler.botAdmin = true;

export default handler;