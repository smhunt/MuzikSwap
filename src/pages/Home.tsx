import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Music, Upload, Type, Sparkles } from 'lucide-react';
import { motion } from 'framer-motion';
import UploadZone from '../components/UploadZone';
import TextInput from '../components/TextInput';
import PlaylistPreview from '../components/PlaylistPreview';
import { analyzeScreenshot, analyzeText, Song } from '../services/ai';
import { toast } from 'sonner';
import { useAuth } from '../contexts/AuthContext';

export default function Home() {
  const [mode, setMode] = useState<'upload' | 'text'>('upload');
  const [songs, setSongs] = useState<Song[]>([]);
  const [loading, setLoading] = useState(false);
  const { user, signInWithGoogle } = useAuth();
  const navigate = useNavigate();

  const handleImageUpload = async (imageBase64: string) => {
    setLoading(true);
    try {
      const extractedSongs = await analyzeScreenshot(imageBase64);
      setSongs(extractedSongs);
      toast.success(`Found ${extractedSongs.length} songs!`);
    } catch (error) {
      toast.error('Failed to analyze image. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleTextSubmit = async (text: string) => {
    setLoading(true);
    try {
      const extractedSongs = await analyzeText(text);
      setSongs(extractedSongs);
      toast.success(`Found ${extractedSongs.length} songs!`);
    } catch (error) {
      toast.error('Failed to analyze text. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleCreatePlaylist = () => {
    if (!user) {
      toast.error('Please sign in to create playlists');
      return;
    }
    navigate('/dashboard', { state: { songs } });
  };

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
              {user ? (
                <button
                  onClick={() => navigate('/dashboard')}
                  className="btn-primary"
                >
                  Dashboard
                </button>
              ) : (
                <button onClick={signInWithGoogle} className="btn-primary">
                  Sign In
                </button>
              )}
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h1 className="text-5xl md:text-7xl font-bold mb-6">
            <span className="bg-gradient-to-r from-purple-400 via-pink-400 to-purple-400 bg-clip-text text-transparent">
              Turn Screenshots into Playlists
            </span>
          </h1>
          <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
            Upload a festival lineup, setlist, or any music screenshot. Our AI
            instantly creates a playlist on Spotify, Apple Music, or YouTube.
          </p>
          <div className="flex items-center justify-center space-x-2 text-purple-300">
            <Sparkles className="w-5 h-5" />
            <span>Powered by AI • $1/month for unlimited playlists</span>
          </div>
        </motion.div>

        {/* Mode Selector */}
        <div className="flex justify-center mb-8">
          <div className="glass rounded-lg p-1 inline-flex">
            <button
              onClick={() => setMode('upload')}
              className={`flex items-center space-x-2 px-6 py-3 rounded-md transition-all ${
                mode === 'upload'
                  ? 'bg-purple-600 text-white'
                  : 'text-gray-300 hover:text-white'
              }`}
            >
              <Upload className="w-5 h-5" />
              <span>Upload Screenshot</span>
            </button>
            <button
              onClick={() => setMode('text')}
              className={`flex items-center space-x-2 px-6 py-3 rounded-md transition-all ${
                mode === 'text'
                  ? 'bg-purple-600 text-white'
                  : 'text-gray-300 hover:text-white'
              }`}
            >
              <Type className="w-5 h-5" />
              <span>Paste Text</span>
            </button>
          </div>
        </div>

        {/* Upload/Input Area */}
        <div className="max-w-3xl mx-auto mb-12">
          {mode === 'upload' ? (
            <UploadZone onUpload={handleImageUpload} loading={loading} />
          ) : (
            <TextInput onSubmit={handleTextSubmit} loading={loading} />
          )}
        </div>

        {/* Playlist Preview */}
        {songs.length > 0 && (
          <PlaylistPreview
            songs={songs}
            onCreatePlaylist={handleCreatePlaylist}
          />
        )}
      </div>
    </div>
  );
}
