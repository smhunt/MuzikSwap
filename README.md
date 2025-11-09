# 🎵 MuzikSwap - AI Screenshot to Playlist Generator

Turn any screenshot or text into instant playlists on Spotify, Apple Music, and YouTube Music.

## ✨ Features

- **AI-Powered Analysis**: Upload festival lineups, setlists, or any music screenshot - our AI extracts all songs and artists
- **Text Input**: Paste any song list in any format - AI figures it out
- **Multiple Platforms**: Create playlists on Spotify, Apple Music (coming soon), and YouTube Music (coming soon)
- **$1/Month Subscription**: Unlimited playlists for just a dollar
- **Beautiful UI**: Modern, responsive design with smooth animations
- **Real-time Preview**: See extracted songs before creating playlists

## 🚀 Tech Stack

- **Frontend**: React 18 + TypeScript + Vite
- **Styling**: Tailwind CSS + Framer Motion
- **Authentication**: Firebase Auth
- **Database**: Firebase Firestore
- **AI**: OpenAI GPT-4 Vision API
- **Payment**: Stripe
- **Music APIs**: Spotify Web API, Apple MusicKit, YouTube Data API
- **Deployment**: Netlify

## 📦 Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/muzikswap.git
   cd muzikswap
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**

   Copy `.env.example` to `.env` and fill in your API keys:

   ```bash
   cp .env.example .env
   ```

   You'll need:
   - Firebase credentials (get from [Firebase Console](https://console.firebase.google.com/))
   - OpenAI API key (get from [OpenAI](https://platform.openai.com/api-keys))
   - Spotify Client ID & Secret (get from [Spotify Developer Dashboard](https://developer.spotify.com/dashboard))
   - Stripe keys (get from [Stripe Dashboard](https://dashboard.stripe.com/))

4. **Run development server**
   ```bash
   npm run dev
   ```

   Open [http://localhost:3000](http://localhost:3000)

## 🔑 API Setup Guide

### Firebase Setup
1. Create a project at [Firebase Console](https://console.firebase.google.com/)
2. Enable Authentication (Google provider)
3. Create a Firestore database
4. Enable Storage
5. Copy config values to `.env`

### OpenAI Setup
1. Get API key from [OpenAI Platform](https://platform.openai.com/api-keys)
2. Add to `.env` as `VITE_OPENAI_API_KEY`
3. **Note**: In production, move OpenAI calls to a backend to protect your API key

### Spotify Setup
1. Create app at [Spotify Developer Dashboard](https://developer.spotify.com/dashboard)
2. Add redirect URI: `http://localhost:3000/dashboard`
3. Copy Client ID to `.env`
4. Copy Client Secret to `.env`

### Stripe Setup
1. Create account at [Stripe](https://stripe.com)
2. Create a subscription product ($1/month)
3. Copy publishable key and price ID to `.env`
4. Set up webhook endpoint for subscription events

## 🏗️ Project Structure

```
muzikswap/
├── src/
│   ├── components/         # React components
│   │   ├── UploadZone.tsx  # Drag & drop upload
│   │   ├── TextInput.tsx   # Text paste input
│   │   └── PlaylistPreview.tsx
│   ├── pages/              # Page components
│   │   ├── Home.tsx        # Landing page
│   │   ├── Dashboard.tsx   # User dashboard
│   │   └── Pricing.tsx     # Subscription page
│   ├── services/           # API integrations
│   │   ├── ai.ts           # OpenAI integration
│   │   ├── spotify.ts      # Spotify API
│   │   └── firebase.ts     # Firebase config
│   ├── contexts/           # React contexts
│   │   └── AuthContext.tsx # Auth state
│   ├── App.tsx             # Main app component
│   └── main.tsx            # Entry point
├── public/                 # Static assets
├── index.html              # HTML template
└── package.json            # Dependencies
```

## 🚢 Deployment

### Deploy to Netlify

1. **Build the project**
   ```bash
   npm run build
   ```

2. **Deploy to Netlify**
   ```bash
   npm install -g netlify-cli
   netlify deploy --prod
   ```

   Or connect your GitHub repo to Netlify for automatic deployments.

3. **Set environment variables in Netlify**
   - Go to Site settings > Build & deploy > Environment
   - Add all your `VITE_*` environment variables

### Important Production Notes

⚠️ **Security**: The OpenAI API key is currently exposed in the browser (for demo purposes). For production:

1. Create a backend API (Node.js/Express, Netlify Functions, or Vercel Serverless)
2. Move OpenAI calls to the backend
3. Frontend calls your backend, backend calls OpenAI
4. Never expose API keys in frontend code

Example backend route:
```javascript
// api/analyze-screenshot.js (Netlify Function)
import OpenAI from 'openai';

export async function handler(event) {
  const { imageBase64 } = JSON.parse(event.body);
  const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

  const response = await openai.chat.completions.create({
    model: 'gpt-4-vision-preview',
    messages: [/* ... */],
  });

  return {
    statusCode: 200,
    body: JSON.stringify(response.choices[0].message.content),
  };
}
```

## 💰 Business Model

- **Free Tier**: 3 playlists/month
- **Pro Tier**: $1/month for unlimited playlists
- **Revenue**: Stripe subscription ($1/month × users)
- **Costs**:
  - OpenAI API: ~$0.01-0.03 per screenshot
  - Firebase: Free tier covers 50k reads/day
  - Netlify: Free tier or $19/month
  - Spotify/YouTube: Free APIs

**Break-even**: ~25-50 users

## 🎯 Features Roadmap

- [x] AI screenshot analysis
- [x] Text input mode
- [x] Spotify integration
- [x] Beautiful UI with animations
- [x] Firebase authentication
- [x] Stripe subscription setup
- [ ] Apple Music integration
- [ ] YouTube Music integration
- [ ] Playlist editing
- [ ] Save playlists history
- [ ] Share playlists
- [ ] Mobile app (React Native)

## 🤝 Contributing

Contributions welcome! Please open an issue or submit a PR.

## 📄 License

MIT License - feel free to use this for your own projects!

## 🙋 Support

Questions? Email support@muzikswap.com or open an issue.

---

Built with ❤️ using React, OpenAI, and Spotify API
