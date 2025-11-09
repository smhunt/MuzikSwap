import { useState } from 'react';
import { Send } from 'lucide-react';
import { motion } from 'framer-motion';

interface TextInputProps {
  onSubmit: (text: string) => void;
  loading: boolean;
}

export default function TextInput({ onSubmit, loading }: TextInputProps) {
  const [text, setText] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (text.trim()) {
      onSubmit(text);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="glass rounded-2xl p-8"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Paste your song list
          </label>
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            disabled={loading}
            className="w-full h-64 bg-white/5 border border-white/20 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none"
            placeholder={`Paste your songs here in any format:

Taylor Swift - Anti-Hero
The Weeknd - Blinding Lights
Drake

Or:
1. Anti-Hero by Taylor Swift
2. Blinding Lights - The Weeknd
3. Drake

Our AI will figure it out!`}
          />
        </div>
        <button
          type="submit"
          disabled={!text.trim() || loading}
          className="btn-primary w-full flex items-center justify-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? (
            <>
              <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent" />
              <span>Analyzing...</span>
            </>
          ) : (
            <>
              <Send className="w-5 h-5" />
              <span>Create Playlist</span>
            </>
          )}
        </button>
      </form>
    </motion.div>
  );
}
