'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { useScrollAnimation } from '@/lib/scroll-animation';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';

export default function CTASection() {
  const router = useRouter();
  const { ref: ctaRef, isVisible: ctaVisible } = useScrollAnimation();

  return (
    <section className="relative z-10 px-6 py-20">
      {/* Background Gradient */}
      <div className="absolute inset-0 gradient-cosmic opacity-20"></div>
      
      <div className="max-w-4xl mx-auto text-center relative z-10">
        <motion.div
          ref={ctaRef}
          initial={{ opacity: 0, y: 50 }}
          animate={ctaVisible ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          {/* Enhanced Title */}
          <motion.h2 
            className="text-4xl md:text-6xl font-bold mb-8 text-gradient-neon"
            initial={{ scale: 0.8 }}
            animate={ctaVisible ? { scale: 1 } : { scale: 0.8 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            Ready to Start Earning?
          </motion.h2>
          
          {/* Enhanced Subtitle */}
          <motion.p 
            className="text-xl md:text-2xl text-muted-foreground mb-8 max-w-2xl mx-auto leading-relaxed"
            initial={{ opacity: 0, y: 20 }}
            animate={ctaVisible ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            Join thousands of EV drivers already earning{' '}
            <span className="text-gradient-primary font-semibold">B3TR tokens</span> for sustainable driving.
          </motion.p>
          
          
          
          {/* Additional Features */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={ctaVisible ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
            transition={{ duration: 0.8, delay: 0.8 }}
            className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6"
          >
            <motion.div
              className="p-4 rounded-lg backdrop-blur-sm border border-primary/10"
              whileHover={{ scale: 1.05, y: -5 }}
              transition={{ duration: 0.3 }}
            >
              <div className="text-2xl mb-2">⚡</div>
              <h3 className="font-semibold mb-1">Instant Setup</h3>
              <p className="text-sm text-muted-foreground">Get started in under 2 minutes</p>
            </motion.div>
            
            <motion.div
              className="p-4 rounded-lg backdrop-blur-sm border border-primary/10"
              whileHover={{ scale: 1.05, y: -5 }}
              transition={{ duration: 0.3, delay: 0.1 }}
            >
              <div className="text-2xl mb-2">🔒</div>
              <h3 className="font-semibold mb-1">Secure & Private</h3>
              <p className="text-sm text-muted-foreground">Your data is always protected</p>
            </motion.div>
            
            <motion.div
              className="p-4 rounded-lg backdrop-blur-sm border border-primary/10"
              whileHover={{ scale: 1.05, y: -5 }}
              transition={{ duration: 0.3, delay: 0.2 }}
            >
              <div className="text-2xl mb-2">🌱</div>
              <h3 className="font-semibold mb-1">Eco-Friendly</h3>
              <p className="text-sm text-muted-foreground">Drive green, earn rewards</p>
            </motion.div>
          </motion.div>
          
          {/* Floating Elements */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <motion.div
              className="absolute top-10 left-10 w-4 h-4 bg-primary/30 rounded-full"
              animate={{ 
                y: [0, -20, 0],
                opacity: [0.3, 0.8, 0.3]
              }}
              transition={{ 
                duration: 3, 
                repeat: Infinity,
                delay: 0
              }}
            />
            <motion.div
              className="absolute top-20 right-20 w-3 h-3 bg-success/40 rounded-full"
              animate={{ 
                y: [0, -15, 0],
                opacity: [0.4, 0.9, 0.4]
              }}
              transition={{ 
                duration: 2.5, 
                repeat: Infinity,
                delay: 1
              }}
            />
            <motion.div
              className="absolute bottom-20 left-20 w-2 h-2 bg-secondary/50 rounded-full"
              animate={{ 
                y: [0, -10, 0],
                opacity: [0.5, 1, 0.5]
              }}
              transition={{ 
                duration: 2, 
                repeat: Infinity,
                delay: 2
              }}
            />
          </div>
        </motion.div>
      </div>
    </section>
  );
} 