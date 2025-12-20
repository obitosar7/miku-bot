import { readdir, unlink, stat } from 'fs/promises';
import path from 'path';

async function displayLoadingScreen(conn, from) {
  const loadingStages = [
    "💬 [ # ] 10%,",
    "💬 [ ## ] 30%,",
    "💬 [ ### ] 60%,",
    "💬 [ #### ] 80%,",
    "💬 [ ###### ] 100%,",
    "♡✅╎ `تم تنظيف الجلسه بنجاح` ╎✅♡"
  ];

  try {
    const { key } = await conn.sendMessage(from, { text: '❤️ التحميل ❤️' });

    for (let i = 0; i < loadingStages.length; i++) {
      await conn.relayMessage(from, {
        protocolMessage: {
          key: key,
          type: 14,
          editedMessage: {
            conversation: loadingStages[i]
          }
        }
      }, {});
      await new Promise(resolve => setTimeout(resolve, 500)); 
    }
  } catch (error) {
    console.error('Error displaying loading screen:', error);
  }
}

const handler = async (m, { conn, usedPrefix, command }) => {
  const folderPath = './session/';
  const excludedFile = 'creds.json';
  let filesDeleted = 0;

  try {
    await displayLoadingScreen(conn, m.chat);
    await stat(folderPath);
    const files = await readdir(folderPath);
    
    for (const file of files) {
      const filePath = path.join(folderPath, file);
      const fileStat = await stat(filePath);

      if (!fileStat.isDirectory() && file !== excludedFile) {
        await unlink(filePath);
        filesDeleted++;
      }
    }

    if (filesDeleted === 0) {
      await conn.sendMessage(m.chat, {text: '*❌╎لم يتم العثور على ملفات أخرى لحذفها في الفولدر ${folderPath}*'}, {quoted: m});
    } else {
      await conn.sendMessage(m.chat, {text: `*🍧╎تمت عملية الحذف بنجاح. تم حذف [ ${filesDeleted} ] ملف من الفولدر ${folderPath} ما عدا ${excludedFile}*`}, {quoted: m});
    }
  } catch (err) {
    console.error('خطأ في قراءة أو حذف الملفات:', err);
    await conn.sendMessage(m.chat, {text: '*❗╎حدث خطأ أثناء محاولة حذف الملفات*'}, {quoted: m});
  }
};

handler.help = ['deleteallfiles'];
handler.tags = ['owner'];
handler.command = ['نظف'];
handler.owner = true;
export default handler;
