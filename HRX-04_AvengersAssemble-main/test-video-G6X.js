const axios = require('axios');

const YOUTUBE_API_KEY = 'AIzaSyCnoYFJplPauyPDWiFy7WUt5-7CP4Wl8ZU';
const videoId = 'G6X_rS_-f58';

async function checkVideo() {
  try {
    console.log(`Testing video: https://www.youtube.com/watch?v=${videoId}`);
    
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
      console.log('\n✅ Video found!');
      console.log('Title:', video.snippet.title);
      console.log('Embeddable:', video.status.embeddable);
      console.log('Privacy:', video.status.privacyStatus);
      console.log('License:', video.status.license);
    } else {
      console.log('\n❌ Video not found');
    }
  } catch (error) {
    console.error('Error:', error.message);
  }
}

checkVideo();
