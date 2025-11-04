import axios from 'axios';
import FormData from 'form-data';
import cheerio from 'cheerio';

const client = axios.create({
  baseURL: 'https://ezgif.com',
  headers: {
    'User-Agent': 'Mozilla/5.0 (Linux; Android 9; CPH1923 Build/PPR1.180610.011) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/138.0.7204.179 Mobile Safari/537.36',
    'Accept-Encoding': 'gzip, deflate, br, zstd',
    'sec-ch-ua-platform': '"Android"',
    'sec-ch-ua': '"Not)A;Brand";v="8", "Chromium";v="138", "Android WebView";v="138"',
    'sec-ch-ua-mobile': '?1',
    'origin': 'https://ezgif.com',
    'x-requested-with': 'mark.via.gp',
    'sec-fetch-site': 'same-origin',
    'sec-fetch-mode': 'cors',
    'sec-fetch-dest': 'empty',
    'accept-language': 'ar-EG,ar;q=0.9,en-US;q=0.8,en;q=0.7',
    'priority': 'u=1, i',
    'Cookie': 'stpdOrigin={"origin":"organic"}'
  }
});

async function convertWebpToMp4(input) {
  let data = new FormData();
  
  if (Buffer.isBuffer(input)) {
    data.append('new-image', input, {filename: 'input.webp'});
    data.append('new-image-url', '');
  } else {
    data.append('new-image', '');
    data.append('new-image-url', input);
  }

  let response1 = await client.post('/webp-to-mp4', data);
  let $ = cheerio.load(response1.data);
  let mp4Link = $('a[href*="/webp-to-mp4/"]').attr('href');
  let fileName = mp4Link.split('/')[2].replace('.html', '');

  let data2 = new FormData();
  data2.append('file', fileName);
  data2.append('ajax', 'true');

  let response2 = await client.post(`/webp-to-mp4/${fileName}?ajax=true`, data2);
  let $2 = cheerio.load(response2.data);
  let videoSrc = $2('video source').attr('src');
  let videoUrl = 'https:' + videoSrc;

  return videoUrl;
}

let handler = async (m, { conn, usedPrefix, command }) => {
if (!m.quoted) throw `*❗╎❯ يـجـب الـرد عـلـي مـلـصـق الـذي تـريـد تـحـويـلـه الـي لـفـيـديـو*`
let mime = m.quoted.mimetype || ''
if (!/webp/.test(mime)) throw `*❗╎❯ يـجـب الـرد عـلـي مـلـصـق الـذي تـريـد تـحـويـلـه الـي لـفـيـديـو*`
let media = await m.quoted.download()
let out = await convertWebpToMp4(media)
await conn.sendFile(m.chat, out, 'error.mp4', '*🌷ണĨƘ♡ β♡Ƭ ¦ 仲見*', m, 0, { thumbnail: out })
}
handler.help = ['tovideo']
handler.tags = ['sticker']
handler.command = ['لفديو', 'tomp4', 'لمقطع', 'لفيديو']
export default handler
