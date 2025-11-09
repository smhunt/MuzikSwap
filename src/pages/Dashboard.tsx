import { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Music, LogOut, Crown, Sparkles } from 'lucide-react';
import { motion } from 'framer-motion';
import { useAuth } from '../contexts/AuthContext';
import { getSpotifyAuthUrl, createPlaylist, getCurrentUser } from '../services/spotify';
import { Song } from '../services/ai';
import { toast } from 'sonner';

export default function Dashboard() {
  const { user, signOut } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [songs, setSongs] = useState<Song[]>([]);
  const [spotifyToken, setSpotifyToken] = useState<string | null>(null);
  const [creating, setCreating] = useState(false);

  useEffect(() => {
    if (!user) {
      navigate('/');
      return;
    }

    // Get songs from navigation state
    if (location.state?.songs) {
      setSongs(location.state.songs);
    }

    // Check for Spotify auth callback
    const hash = window.location.hash;
    if (hash) {
      const params = new URLSearchParams(hash.substring(1));
      const token = params.get('access_token');
      if (token) {
        setSpotifyToken(token);
        window.history.replaceState(null, '', '/dashboard');
      }
    }
  }, [user, navigate, location]);

  const handleSpotifyAuth = () => {
    const authUrl = getSpotifyAuthUrl();
    window.location.href = authUrl;
  };

  const handleCreateSpotifyPlaylist = async () => {
    if (!spotifyToken) {
      handleSpotifyAuth();
      return;
    }

    setCreating(true);
    try {
      const spotifyUser = await getCurrentUser(spotifyToken);
      const playlistId = await createPlaylist(
        spotifyToken,
        spotifyUser.id,
        'MuzikSwap Playlist',
        `Created with MuzikSwap - ${songs.length} tracks`,
        songs
      );

      toast.success('Playlist created successfully!');
      window.open(`https://open.spotify.com/playlist/${playlistId}`, '_blank');
    } catch (error) {
      toast.error('Failed to create playlist. Please try again.');
    } finally {
      setCreating(false);
    }
  };

  const handleSignOut = async () => {
    await signOut();
    navigate('/');
  };

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen">
      {/* Header */}
      <nav className="glass border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-2">
              <Music className="w-8 h-8 text-purple-400" />
              <span className="text-2xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                MuzikSwap
              </span>
            </div>
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2 text-sm text-gray-300">
                <img
                  src={user.photoURL || 'https://via.placeholder.com/40'}
                  alt={user.displayName || 'User'}
                  className="w-8 h-8 rounded-full"
                />
                <span>{user.displayName || user.email}</span>
              </div>
              <button
                onClick={() => navigate('/pricing')}
                className="flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-yellow-500 to-yellow-600 rounded-lg hover:from-yellow-600 hover:to-yellow-700 transition-all"
              >
                <Crown className="w-4 h-4" />
                <span>Upgrade</span>
              </button>
              <button
                onClick={handleSignOut}
                className="flex items-center space-x-2 text-gray-300 hover:text-white"
              >
                <LogOut className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {songs.length > 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-3xl mx-auto"
          >
            <div className="glass rounded-2xl p-8">
              <h1 className="text-3xl font-bold mb-6 flex items-center space-x-3">
                <Sparkles className="w-8 h-8 text-purple-400" />
                <span>Your Playlist is Ready!</span>
              </h1>

              <div className="mb-6">
                <p className="text-gray-300 mb-4">
                  We found {songs.length} songs. Choose where to create your
                  playlist:
                </p>

                <div className="grid gap-4">
                  <button
                    onClick={handleCreateSpotifyPlaylist}
                    disabled={creating}
                    className="btn-spotify flex items-center justify-center space-x-2 disabled:opacity-50"
                  >
                    {creating ? (
                      <>
                        <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent" />
                        <span>Creating Playlist...</span>
                      </>
                    ) : (
                      <>
                        <Music className="w-5 h-5" />
                        <span>
                          {spotifyToken
                            ? 'Create Spotify Playlist'
                            : 'Connect to Spotify'}
                        </span>
                      </>
                    )}
                  </button>

                  <div className="text-center text-sm text-gray-400">
                    <p>Apple Music and YouTube Music coming soon!</p>
                  </div>
                </div>
              </div>

              <div className="border-t border-white/10 pt-6">
                <h3 className="font-semibold mb-4">Song List Preview:</h3>
                <div className="space-y-2 max-h-96 overflow-y-auto">
                  {songs.map((song, index) => (
                    <div
                      key={index}
                      className="bg-white/5 rounded-lg p-3 flex items-center justify-between"
                    >
                      <div>
                        <p className="font-medium text-white">{song.title}</p>
                        <p className="text-sm text-gray-400">{song.artist}</p>
                      </div>
                      <span className="text-gray-500 text-sm">#{index + 1}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="mt-6">
                <button
                  onClick={() => navigate('/')}
                  className="w-full py-3 px-6 border border-white/20 rounded-lg hover:bg-white/5 transition-all"
                >
                  Create Another Playlist
                </button>
              </div>
            </div>
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center"
          >
            <Music className="w-16 h-16 text-gray-500 mx-auto mb-4" />
            <h2 className="text-2xl font-bold mb-4">No Playlist Yet</h2>
            <p className="text-gray-400 mb-8">
              Upload a screenshot or paste some text to get started!
            </p>
            <button onClick={() => navigate('/')} className="btn-primary">
              Create Playlist
            </button>
          </motion.div>
        )}
      </div>
    </div>
  );
}
