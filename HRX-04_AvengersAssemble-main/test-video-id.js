const axios = require('axios');

const YOUTUBE_API_KEY = 'AIzaSyCnoYFJplPauyPDWiFy7WUt5-7CP4Wl8ZU';
const videoId = '4b5d3mu3y4E';

async function checkVideoExists() {
  try {
    console.log(`Checking if video ${videoId} exists and is embeddable...`);
    
    const response = await axios.get(
      'https://www.googleapis.com/youtube/v3/videos',
      {
        params: {
          part: 'status,contentDetails',
          id: videoId,
          key: YOUTUBE_API_KEY,
        }
      }
    );

    if (response.data.items && response.data.items.length > 0) {
      const video = response.data.items[0];
      console.log('\n✅ Video exists!');
      console.log('Embeddable:', video.status.embeddable);
      console.log('Public:', video.status.privacyStatus);
      console.log('URL:', `https://www.youtube.com/watch?v=${videoId}`);
    } else {
      console.log('\n❌ Video not found or unavailable');
    }
  } catch (error) {
    console.error('\n❌ Error:', error.message);
    if (error.response) {
      console.error('Response:', JSON.stringify(error.response.data, null, 2));
    }
  }
}

checkVideoExists();
