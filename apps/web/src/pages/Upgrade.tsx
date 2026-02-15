import { motion } from 'framer-motion';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { usePremium } from '../hooks/usePremium';
import { Check, ArrowLeft, Zap } from 'lucide-react';

export default function UpgradePage() {
  const navigate = useNavigate();
  const { profile } = useAuth();
  const { isPremium, getDaysUntilExpiry } = usePremium(profile?.uid || '');
  const [selectedPlan, setSelectedPlan] = useState<'monthly' | 'yearly'>('monthly');
  const [isProcessing, setIsProcessing] = useState(false);

  const handleUpgrade = async () => {
    setIsProcessing(true);
    // In a real app, this would redirect to Stripe checkout
    console.log(`Processing ${selectedPlan} subscription...`);
    setTimeout(() => {
      setIsProcessing(false);
      alert('In production, this would redirect to Stripe payment');
    }, 1000);
  };

  const plans = [
    {
      name: 'Free',
      price: '$0',
      period: 'forever',
      description: 'Perfect for getting started',
      features: [
        '✓ Basic workout logging',
        '✓ Mood tracking',
        '✓ Offline support',
        '✓ Consistency streaks',
      ],
      current: !isPremium,
      cta: isPremium ? 'Current Plan' : 'You\'re on this plan',
      ctaDisabled: true,
    },
    {
      name: 'Premium',
      price: selectedPlan === 'monthly' ? '$9.99' : '$99.99',
      period: selectedPlan === 'monthly' ? '/month' : '/year',
      description: 'Everything you need to succeed',
      features: [
        '✓ All Free features',
        '✓ Advanced workout programs',
        '✓ Nutrition guidance',
        '✓ Advanced analytics & insights',
        '✓ Personal progress reports',
        '✓ Priority support',
        '✓ Custom meal plans',
        '✓ Video coaching library',
      ],
      current: isPremium,
      cta: isPremium ? 'Current Plan' : 'Upgrade Now',
      ctaDisabled: isPremium,
    },
  ];

  return (
    <div className="min-h-screen bg-[#0A0A0A] text-white overflow-hidden">
      {/* Fixed Background */}
      <div className="fixed top-0 left-0 w-full h-full pointer-events-none">
        <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_50%_50%,rgba(0,100,255,0.08),transparent)]" />
        <div className="absolute top-[-20%] right-[-20%] w-96 h-96 bg-blue-500/20 rounded-full blur-3xl animate-glow-pulse" />
        <div className="absolute bottom-[-20%] left-[-20%] w-96 h-96 bg-emerald-500/20 rounded-full blur-3xl animate-glow-pulse" />
      </div>

      <div className="relative z-10 max-w-6xl mx-auto px-8 py-12">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="flex items-center gap-4 mb-12"
        >
          <button
            onClick={() => navigate('/dashboard')}
            className="p-2 rounded-lg hover:bg-white/5 transition-colors"
          >
            <ArrowLeft className="w-6 h-6" />
          </button>
          <div>
            <h1 className="text-4xl font-black text-gradient bg-gradient-to-r from-neon-red to-glow-yellow">
              Upgrade to Premium
            </h1>
            <p className="text-neutral-300 mt-2">Unlock advanced features and accelerate your fitness journey</p>
          </div>
        </motion.div>

        {/* Premium Status */}
        {isPremium && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="card-glass p-6 mb-8 border-glow-emerald/50"
          >
            <div className="flex items-center gap-3">
              <Zap className="w-6 h-6 text-glow-emerald" />
              <div>
                <p className="font-bold text-glow-emerald">Premium Member</p>
                <p className="text-sm text-neutral-400">
                  {getDaysUntilExpiry()} days remaining • Renews automatically
                </p>
              </div>
            </div>
          </motion.div>
        )}

        {/* Billing Period Toggle */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="flex justify-center mb-12"
        >
          <div className="inline-flex gap-4 p-2 bg-white/5 rounded-xl border border-white/10">
            <button
              onClick={() => setSelectedPlan('monthly')}
              className={`px-6 py-2 rounded-lg font-semibold transition-all duration-200 ${
                selectedPlan === 'monthly'
                  ? 'bg-neon-red text-white'
                  : 'text-neutral-400 hover:text-white'
              }`}
            >
              Monthly
            </button>
            <button
              onClick={() => setSelectedPlan('yearly')}
              className={`px-6 py-2 rounded-lg font-semibold transition-all duration-200 relative ${
                selectedPlan === 'yearly'
                  ? 'bg-neon-red text-white'
                  : 'text-neutral-400 hover:text-white'
              }`}
            >
              Yearly
              <span className="absolute -top-8 left-1/2 -translate-x-1/2 text-xs bg-glow-yellow/20 border border-glow-yellow/50 text-glow-yellow px-2 py-1 rounded whitespace-nowrap">
                Save 17%
              </span>
            </button>
          </div>
        </motion.div>

        {/* Pricing Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
          {plans.map((plan, i) => (
            <motion.div
              key={plan.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              viewport={{ once: true }}
              className={`card-glass p-8 space-y-6 relative overflow-hidden transition-all duration-300 ${
                plan.current ? 'border-neon-red/50 ring-2 ring-neon-red/20' : ''
              }`}
            >
              {plan.current && (
                <div className="absolute top-4 right-4 px-4 py-2 bg-neon-red/20 border border-neon-red/50 rounded-lg text-neon-red text-sm font-bold">
                  Current Plan
                </div>
              )}

              <div>
                <h3 className="text-2xl font-bold mb-2">{plan.name}</h3>
                <p className="text-neutral-400 text-sm mb-4">{plan.description}</p>
                <div className="space-y-1">
                  <div className="flex items-baseline gap-1">
                    <span className="text-4xl font-black text-neon-red">{plan.price}</span>
                    <span className="text-neutral-400 text-sm">{plan.period}</span>
                  </div>
                </div>
              </div>

              <div className="space-y-3">
                {plan.features.map((feature) => (
                  <div key={feature} className="flex items-center gap-3">
                    <Check className="w-5 h-5 text-glow-emerald flex-shrink-0" />
                    <span className="text-neutral-300">{feature}</span>
                  </div>
                ))}
              </div>

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleUpgrade}
                disabled={plan.ctaDisabled || isProcessing}
                className={`w-full py-3 px-4 rounded-xl font-semibold transition-all duration-200 ${
                  plan.ctaDisabled
                    ? 'bg-white/5 text-neutral-500 cursor-not-allowed'
                    : 'btn-glow-red'
                }`}
              >
                {isProcessing ? 'Processing...' : plan.cta}
              </motion.button>
            </motion.div>
          ))}
        </div>

        {/* FAQ */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="space-y-6"
        >
          <h2 className="text-2xl font-bold mb-8">Frequently Asked Questions</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[
              {
                q: 'Can I cancel anytime?',
                a: 'Yes! Cancel your subscription anytime, no questions asked. You\'ll keep access until the end of your billing period.',
              },
              {
                q: 'Is there a free trial?',
                a: 'We offer a 7-day free trial so you can experience all premium features before committing.',
              },
              {
                q: 'What payment methods do you accept?',
                a: 'We accept all major credit cards, PayPal, and Apple Pay for secure transactions.',
              },
              {
                q: 'Can I change my billing period?',
                a: 'Absolutely! You can switch between monthly and yearly plans at any time.',
              },
            ].map((faq, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                viewport={{ once: true }}
                className="card-glass p-6 space-y-2"
              >
                <h3 className="font-bold text-glow-blue">{faq.q}</h3>
                <p className="text-sm text-neutral-400">{faq.a}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Support */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-12 card-glass p-8 text-center space-y-4"
        >
          <h3 className="text-xl font-bold">Need Help?</h3>
          <p className="text-neutral-300">
            Contact our support team at support@fitlikeus.com or visit our help center for more information.
          </p>
        </motion.div>
      </div>
    </div>
  );
}
