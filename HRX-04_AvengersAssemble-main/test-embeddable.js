const axios = require('axios');

const YOUTUBE_API_KEY = 'AIzaSyCnoYFJplPauyPDWiFy7WUt5-7CP4Wl8ZU';
const videoIds = ['0j3m7p4-W0k', 'x31x06G-f5s', '4g-z24s3gC4'];

async function checkVideos() {
  for (const videoId of videoIds) {
    try {
      console.log(`\n🔍 Checking: https://www.youtube.com/watch?v=${videoId}`);
      
      const response = await axios.get(
        'https://www.googleapis.com/youtube/v3/videos',
        {
          params: {
            part: 'status,snippet',
            id: videoId,
            key: YOUTUBE_API_KEY,
          }
        }
      );

      if (response.data.items && response.data.items.length > 0) {
        const video = response.data.items[0];
        console.log('Title:', video.snippet.title);
        console.log('Embeddable:', video.status.embeddable);
        console.log('Privacy:', video.status.privacyStatus);
        console.log('Status:', video.status.embeddable ? '✅ Can embed' : '❌ Cannot embed');
      } else {
        console.log('❌ Video not found');
      }
    } catch (error) {
      console.error('Error:', error.message);
    }
  }
}

checkVideos();
