import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Check, Music, Crown, Zap } from 'lucide-react';
import { motion } from 'framer-motion';
import { loadStripe } from '@stripe/stripe-js';
import { useAuth } from '../contexts/AuthContext';
import { toast } from 'sonner';

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY);

export default function Pricing() {
  const { user, signInWithGoogle } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const handleSubscribe = async () => {
    if (!user) {
      toast.error('Please sign in first');
      await signInWithGoogle();
      return;
    }

    setLoading(true);
    try {
      // In production, you'd call your backend to create a Checkout Session
      // For now, this is a placeholder
      const stripe = await stripePromise;
      if (!stripe) throw new Error('Stripe failed to load');

      toast.info('Stripe integration coming soon!');
      // const { error } = await stripe.redirectToCheckout({
      //   lineItems: [{ price: import.meta.env.VITE_STRIPE_PRICE_ID, quantity: 1 }],
      //   mode: 'subscription',
      //   successUrl: `${window.location.origin}/dashboard?success=true`,
      //   cancelUrl: `${window.location.origin}/pricing`,
      // });

      // if (error) {
      //   toast.error(error.message);
      // }
    } catch (error) {
      toast.error('Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen">
      {/* Header */}
      <nav className="glass border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div
              onClick={() => navigate('/')}
              className="flex items-center space-x-2 cursor-pointer"
            >
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

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h1 className="text-5xl font-bold mb-4">
            <span className="bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
              Simple, Affordable Pricing
            </span>
          </h1>
          <p className="text-xl text-gray-300">
            One plan. Unlimited playlists. $1/month.
          </p>
        </motion.div>

        <div className="max-w-4xl mx-auto grid md:grid-cols-2 gap-8">
          {/* Free Plan */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="glass rounded-2xl p-8"
          >
            <div className="flex items-center space-x-3 mb-4">
              <Music className="w-8 h-8 text-gray-400" />
              <h2 className="text-2xl font-bold">Free</h2>
            </div>
            <div className="mb-6">
              <span className="text-5xl font-bold">$0</span>
              <span className="text-gray-400">/month</span>
            </div>
            <ul className="space-y-4 mb-8">
              <li className="flex items-start space-x-3">
                <Check className="w-5 h-5 text-green-400 mt-0.5" />
                <span className="text-gray-300">3 playlists per month</span>
              </li>
              <li className="flex items-start space-x-3">
                <Check className="w-5 h-5 text-green-400 mt-0.5" />
                <span className="text-gray-300">AI-powered analysis</span>
              </li>
              <li className="flex items-start space-x-3">
                <Check className="w-5 h-5 text-green-400 mt-0.5" />
                <span className="text-gray-300">Spotify integration</span>
              </li>
            </ul>
            <button
              onClick={() => navigate('/')}
              className="w-full py-3 px-6 border border-white/20 rounded-lg hover:bg-white/5 transition-all"
            >
              Get Started Free
            </button>
          </motion.div>

          {/* Pro Plan */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="glass rounded-2xl p-8 border-2 border-purple-500 relative overflow-hidden"
          >
            <div className="absolute top-0 right-0 bg-gradient-to-r from-purple-600 to-pink-600 text-white px-4 py-1 text-sm font-semibold">
              BEST VALUE
            </div>
            <div className="flex items-center space-x-3 mb-4 mt-4">
              <Crown className="w-8 h-8 text-yellow-400" />
              <h2 className="text-2xl font-bold">Pro</h2>
            </div>
            <div className="mb-6">
              <span className="text-5xl font-bold">$1</span>
              <span className="text-gray-400">/month</span>
            </div>
            <ul className="space-y-4 mb-8">
              <li className="flex items-start space-x-3">
                <Check className="w-5 h-5 text-green-400 mt-0.5" />
                <span className="text-white font-semibold">
                  Unlimited playlists
                </span>
              </li>
              <li className="flex items-start space-x-3">
                <Check className="w-5 h-5 text-green-400 mt-0.5" />
                <span className="text-white">Advanced AI analysis</span>
              </li>
              <li className="flex items-start space-x-3">
                <Check className="w-5 h-5 text-green-400 mt-0.5" />
                <span className="text-white">
                  Spotify, Apple Music, YouTube
                </span>
              </li>
              <li className="flex items-start space-x-3">
                <Check className="w-5 h-5 text-green-400 mt-0.5" />
                <span className="text-white">Priority support</span>
              </li>
              <li className="flex items-start space-x-3">
                <Zap className="w-5 h-5 text-yellow-400 mt-0.5" />
                <span className="text-white">Early access to new features</span>
              </li>
            </ul>
            <button
              onClick={handleSubscribe}
              disabled={loading}
              className="btn-primary w-full flex items-center justify-center space-x-2 disabled:opacity-50"
            >
              {loading ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent" />
                  <span>Processing...</span>
                </>
              ) : (
                <>
                  <Crown className="w-5 h-5" />
                  <span>Upgrade to Pro</span>
                </>
              )}
            </button>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="max-w-2xl mx-auto mt-12 text-center"
        >
          <p className="text-gray-400 mb-4">
            No hidden fees. Cancel anytime. Money-back guarantee within 30 days.
          </p>
          <div className="flex justify-center space-x-8 text-sm text-gray-500">
            <span>✓ Secure payment via Stripe</span>
            <span>✓ Cancel anytime</span>
            <span>✓ 30-day guarantee</span>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
