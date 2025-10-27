// Test Gemini API Key
const GEMINI_API_KEY = 'AIzaSyAdCNk20VR1j0nQ9Iigc8BQqReEyncYRGY';

console.log('Testing Gemini API Key...');
console.log('API Key (first 20 chars):', GEMINI_API_KEY?.substring(0, 20) + '...');

async function testGemini() {
  try {
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-lite:generateContent?key=${GEMINI_API_KEY}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [{ 
            parts: [{ 
              text: "Say hello in one word" 
            }] 
          }],
        }),
      }
    );

    console.log('Response Status:', response.status);
    console.log('Response Status Text:', response.statusText);

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Error Response:', errorText);
      throw new Error(`Gemini API error: ${response.status}`);
    }

    const result = await response.json();
    console.log('✅ Success! Gemini API is working!');
    console.log('Response:', result.candidates?.[0]?.content?.parts?.[0]?.text);
  } catch (error) {
    console.error('❌ Error:', error.message);
    console.error('\nPossible issues:');
    console.error('1. API key is invalid or expired');
    console.error('2. API key has restrictions (check Google Cloud Console)');
    console.error('3. Gemini API is not enabled for this project');
    console.error('\n👉 Generate a new API key at: https://aistudio.google.com/app/apikey');
  }
}

testGemini();
