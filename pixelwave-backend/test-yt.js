const axios = require('axios');

async function test() {
  try {
    const videoId = 'dQw4w9WgXcQ';
    const noembedRes = await axios.get(`https://noembed.com/embed?url=https://www.youtube.com/watch?v=${videoId}`);
    const noembedData = noembedRes.data;

    const ytRes = await axios.get(`https://www.youtube.com/watch?v=${videoId}`);
    const ytHtml = ytRes.data;
    const durationMatch = ytHtml.match(/"lengthSeconds":"(\d+)"/);
    const durationMs = durationMatch ? parseInt(durationMatch[1]) * 1000 : 0;
    
    console.log(JSON.stringify({
      title: noembedData.title,
      durationMs
    }));
  } catch(e) {
    console.error(e);
  }
}
test();
