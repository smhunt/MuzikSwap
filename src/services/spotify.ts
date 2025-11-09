import axios from 'axios';
import { Song } from './ai';

const SPOTIFY_AUTH_URL = 'https://accounts.spotify.com/authorize';
const SPOTIFY_API_BASE = 'https://api.spotify.com/v1';

const SCOPES = [
  'playlist-modify-public',
  'playlist-modify-private',
  'user-read-private',
  'user-read-email',
].join(' ');

export function getSpotifyAuthUrl(): string {
  const params = new URLSearchParams({
    client_id: import.meta.env.VITE_SPOTIFY_CLIENT_ID,
    response_type: 'token',
    redirect_uri: import.meta.env.VITE_SPOTIFY_REDIRECT_URI,
    scope: SCOPES,
  });

  return `${SPOTIFY_AUTH_URL}?${params.toString()}`;
}

export async function searchTrack(
  accessToken: string,
  song: Song
): Promise<string | null> {
  try {
    const query = `track:${song.title} artist:${song.artist}`;
    const response = await axios.get(`${SPOTIFY_API_BASE}/search`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
      params: {
        q: query,
        type: 'track',
        limit: 1,
      },
    });

    const tracks = response.data.tracks.items;
    if (tracks.length > 0) {
      return tracks[0].uri;
    }

    return null;
  } catch (error) {
    console.error('Error searching track:', error);
    return null;
  }
}

export async function createPlaylist(
  accessToken: string,
  userId: string,
  name: string,
  description: string,
  songs: Song[]
): Promise<string> {
  try {
    // Create playlist
    const createResponse = await axios.post(
      `${SPOTIFY_API_BASE}/users/${userId}/playlists`,
      {
        name,
        description,
        public: false,
      },
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
      }
    );

    const playlistId = createResponse.data.id;

    // Search for tracks and collect URIs
    const trackUris: string[] = [];
    for (const song of songs) {
      const uri = await searchTrack(accessToken, song);
      if (uri) {
        trackUris.push(uri);
      }
    }

    // Add tracks to playlist
    if (trackUris.length > 0) {
      await axios.post(
        `${SPOTIFY_API_BASE}/playlists/${playlistId}/tracks`,
        {
          uris: trackUris,
        },
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
            'Content-Type': 'application/json',
          },
        }
      );
    }

    return playlistId;
  } catch (error) {
    console.error('Error creating playlist:', error);
    throw new Error('Failed to create Spotify playlist');
  }
}

export async function getCurrentUser(accessToken: string): Promise<any> {
  const response = await axios.get(`${SPOTIFY_API_BASE}/me`, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });
  return response.data;
}
