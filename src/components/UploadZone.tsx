import { useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { Upload, Image as ImageIcon } from 'lucide-react';
import { motion } from 'framer-motion';

interface UploadZoneProps {
  onUpload: (imageBase64: string) => void;
  loading: boolean;
}

export default function UploadZone({ onUpload, loading }: UploadZoneProps) {
  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      const file = acceptedFiles[0];
      if (!file) return;

      const reader = new FileReader();
      reader.onload = () => {
        const base64 = reader.result?.toString().split(',')[1];
        if (base64) {
          onUpload(base64);
        }
      };
      reader.readAsDataURL(file);
    },
    [onUpload]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.png', '.jpg', '.jpeg', '.webp'],
    },
    maxFiles: 1,
    disabled: loading,
  });

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      {...getRootProps()}
      className={`glass rounded-2xl p-12 border-2 border-dashed transition-all cursor-pointer ${
        isDragActive
          ? 'border-purple-500 bg-purple-500/10'
          : 'border-white/20 hover:border-purple-400/50'
      } ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
    >
      <input {...getInputProps()} />
      <div className="flex flex-col items-center justify-center space-y-4">
        {loading ? (
          <>
            <div className="animate-spin rounded-full h-16 w-16 border-4 border-purple-500 border-t-transparent" />
            <p className="text-xl text-gray-300">Analyzing image...</p>
          </>
        ) : isDragActive ? (
          <>
            <ImageIcon className="w-16 h-16 text-purple-400" />
            <p className="text-xl text-purple-300">Drop it here!</p>
          </>
        ) : (
          <>
            <Upload className="w-16 h-16 text-gray-400" />
            <div className="text-center">
              <p className="text-xl text-gray-300 mb-2">
                Drag & drop a screenshot here
              </p>
              <p className="text-gray-400">or click to browse</p>
            </div>
            <div className="flex flex-wrap gap-2 justify-center text-sm text-gray-500">
              <span>✓ Festival lineups</span>
              <span>✓ Concert setlists</span>
              <span>✓ Playlist screenshots</span>
              <span>✓ Album tracklists</span>
            </div>
          </>
        )}
      </div>
    </motion.div>
  );
}
