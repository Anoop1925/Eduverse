const axios = require('axios');

const YOUTUBE_API_KEY = 'AIzaSyCnoYFJplPauyPDWiFy7WUt5-7CP4Wl8ZU';

async function testYouTubeAPI() {
  try {
    console.log('Testing YouTube Data API v3...');
    console.log('API Key (first 20 chars):', YOUTUBE_API_KEY.substring(0, 20) + '...');
    
    const searchQuery = 'Introduction to Machine Learning tutorial';
    console.log(`\nSearch Query: "${searchQuery}"`);
    
    const response = await axios.get(
      'https://www.googleapis.com/youtube/v3/search',
      {
        params: {
          part: 'snippet',
          maxResults: 1,
          q: searchQuery,
          type: 'video',
          key: YOUTUBE_API_KEY,
        }
      }
    );

    console.log('\n✅ Response Status:', response.status);
    
    if (response.data.items && response.data.items.length > 0) {
      const video = response.data.items[0];
      const videoId = video.id.videoId;
      const videoUrl = `https://www.youtube.com/watch?v=${videoId}`;
      const title = video.snippet.title;
      
      console.log('\n📹 Video Found:');
      console.log('Title:', title);
      console.log('URL:', videoUrl);
      console.log('\n✅ YouTube API is working correctly!');
    } else {
      console.log('\n⚠️ No videos found');
    }
  } catch (error) {
    console.error('\n❌ Error:', error.message);
    if (error.response) {
      console.error('Response Status:', error.response.status);
      console.error('Response Data:', JSON.stringify(error.response.data, null, 2));
    }
  }
}

testYouTubeAPI();
