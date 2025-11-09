import { motion } from 'framer-motion';
import { Music2, ExternalLink } from 'lucide-react';
import { Song } from '../services/ai';

interface PlaylistPreviewProps {
  songs: Song[];
  onCreatePlaylist: () => void;
}

export default function PlaylistPreview({
  songs,
  onCreatePlaylist,
}: PlaylistPreviewProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-3xl mx-auto"
    >
      <div className="glass rounded-2xl p-8">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-3">
            <Music2 className="w-6 h-6 text-purple-400" />
            <h2 className="text-2xl font-bold">Found {songs.length} Songs</h2>
          </div>
        </div>

        <div className="space-y-2 mb-6 max-h-96 overflow-y-auto">
          {songs.map((song, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.05 }}
              className="bg-white/5 rounded-lg p-4 hover:bg-white/10 transition-all"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-semibold text-white">{song.title}</p>
                  <p className="text-sm text-gray-400">{song.artist}</p>
                </div>
                <Music2 className="w-5 h-5 text-purple-400" />
              </div>
            </motion.div>
          ))}
        </div>

        <div className="border-t border-white/10 pt-6">
          <p className="text-center text-gray-400 mb-4">
            Choose where to create your playlist:
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <button
              onClick={onCreatePlaylist}
              className="btn-spotify flex items-center justify-center space-x-2"
            >
              <span>Create on Spotify</span>
              <ExternalLink className="w-4 h-4" />
            </button>
            <button
              onClick={onCreatePlaylist}
              className="btn-apple flex items-center justify-center space-x-2"
            >
              <span>Create on Apple Music</span>
              <ExternalLink className="w-4 h-4" />
            </button>
            <button
              onClick={onCreatePlaylist}
              className="btn-youtube flex items-center justify-center space-x-2"
            >
              <span>Create on YouTube</span>
              <ExternalLink className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
