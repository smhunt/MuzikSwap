import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: import.meta.env.VITE_OPENAI_API_KEY,
  dangerouslyAllowBrowser: true, // For development - move to backend in production
});

export interface Song {
  title: string;
  artist: string;
}

export async function analyzeScreenshot(imageBase64: string): Promise<Song[]> {
  try {
    const response = await openai.chat.completions.create({
      model: 'gpt-4-vision-preview',
      messages: [
        {
          role: 'user',
          content: [
            {
              type: 'text',
              text: `Analyze this image and extract all songs and artists mentioned. This could be:
- A festival lineup poster
- A concert setlist
- A screenshot of a playlist
- A list of songs/artists
- Album artwork with tracklist

Return ONLY a JSON array of objects with "title" and "artist" fields.
If you only see artist names (like on a festival lineup), use the artist name as the title.
Format: [{"title": "song or artist name", "artist": "artist name"}]

IMPORTANT: Return ONLY the JSON array, no other text.`,
            },
            {
              type: 'image_url',
              image_url: {
                url: `data:image/jpeg;base64,${imageBase64}`,
              },
            },
          ],
        },
      ],
      max_tokens: 1000,
    });

    const content = response.choices[0]?.message?.content;
    if (!content) {
      throw new Error('No response from AI');
    }

    // Parse the JSON response
    const songs = JSON.parse(content) as Song[];
    return songs;
  } catch (error) {
    console.error('Error analyzing screenshot:', error);
    throw new Error('Failed to analyze screenshot. Please try again.');
  }
}

export async function analyzeText(text: string): Promise<Song[]> {
  try {
    const response = await openai.chat.completions.create({
      model: 'gpt-4-turbo-preview',
      messages: [
        {
          role: 'user',
          content: `Extract all songs and artists from this text:

${text}

Return ONLY a JSON array of objects with "title" and "artist" fields.
If you only see artist names, use the artist name as the title.
Handle various formats: "Artist - Song", "Song by Artist", plain lists, etc.
Format: [{"title": "song or artist name", "artist": "artist name"}]

IMPORTANT: Return ONLY the JSON array, no other text.`,
        },
      ],
      max_tokens: 1000,
    });

    const content = response.choices[0]?.message?.content;
    if (!content) {
      throw new Error('No response from AI');
    }

    const songs = JSON.parse(content) as Song[];
    return songs;
  } catch (error) {
    console.error('Error analyzing text:', error);
    throw new Error('Failed to analyze text. Please try again.');
  }
}
