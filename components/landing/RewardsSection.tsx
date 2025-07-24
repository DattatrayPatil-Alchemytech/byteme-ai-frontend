'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useScrollAnimation, useScrollAnimationWithDelay } from '@/lib/scroll-animation';
import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';

export default function RewardsSection() {
  const { ref: titleRef, isVisible: titleVisible } = useScrollAnimation();
  const { ref: tiersRef, isVisible: tiersVisible } = useScrollAnimationWithDelay(200);

  const tiers = [
    {
      name: "Basic Tier",
      tokens: 1,
      description: "per 100 miles",
      gradient: "gradient-primary",
      textGradient: "text-gradient-primary",
      icon: "🥉",
    },
    {
      name: "Premium Tier",
      tokens: 2,
      description: "per 100 miles",
      gradient: "gradient-success",
      textGradient: "text-gradient-success",
      icon: "🥈",
    },
    {
      name: "Elite Tier",
      tokens: 3,
      description: "per 100 miles",
      gradient: "gradient-secondary",
      textGradient: "text-gradient-secondary",
      icon: "🥇",
    }
  ];

  return (
    <section id="rewards" className="relative z-10 px-6 py-20">
      <div className="max-w-7xl mx-auto">
        {/* Enhanced Title */}
        <motion.div
          ref={titleRef}
          initial={{ opacity: 0, y: 50 }}
          animate={titleVisible ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold text-gradient-sunset mb-4">
            Reward Structure
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Choose your tier and maximize your earnings with our innovative reward system
          </p>
        </motion.div>
        
        {/* Enhanced Tiers */}
        <motion.div
          ref={tiersRef}
          initial={{ opacity: 0, y: 50 }}
          animate={tiersVisible ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto"
        >
          {tiers.map((tier, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              animate={tiersVisible ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
              transition={{ duration: 0.6, delay: index * 0.2, ease: "easeOut" }}
              whileHover={{ 
                scale: 1.05, 
                y: -10,
                transition: { duration: 0.3 }
              }}
            >
              <Card className="hover-lift backdrop-blur-sm border-2 border-transparent hover:border-primary/20 overflow-hidden relative group h-full">
                {/* Gradient Background Overlay */}
                <div className={`absolute inset-0 ${tier.gradient} opacity-5 group-hover:opacity-10 transition-opacity duration-300`}></div>
                
                {/* Animated Border */}
                <div className="absolute inset-0 rounded-lg bg-gradient-to-r from-transparent via-primary/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                
                <CardHeader className="text-center relative z-10">
                  <motion.div 
                    className={`w-20 h-20 ${tier.gradient} rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg group-hover:shadow-xl transition-shadow duration-300`}
                    whileHover={{ rotate: 360 }}
                    transition={{ duration: 0.6 }}
                  >
                    <span className="text-3xl">{tier.icon}</span>
                  </motion.div>
                  
                  <CardTitle className="text-2xl font-bold text-black group-hover:text-green-600 transition-colors duration-300 mb-2">
                    {tier.name}
                  </CardTitle>
                  
                  {/* Animated Token Counter */}
                  <motion.div
                    className="text-5xl font-bold mb-2"
                    initial={{ scale: 0 }}
                    animate={tiersVisible ? { scale: 1 } : { scale: 0 }}
                    transition={{ duration: 0.5, delay: index * 0.3 }}
                  >
                    <AnimatedCounter 
                      from={0} 
                      to={tier.tokens} 
                      duration={2} 
                      delay={index * 0.3}
                      className="text-black group-hover:text-green-600 transition-colors duration-300"
                    />
                    <span className="text-black group-hover:text-green-600 transition-colors duration-300"> B3TR</span>
                  </motion.div>
                  
                  <p className="text-black group-hover:text-green-600 transition-colors duration-300 text-lg">{tier.description}</p>
                </CardHeader>
                
                <CardContent className="relative z-10">
                
                  
                  {/* CTA Button */}
                  <motion.button
                    className="w-full mt-6 py-3 px-6 btn-gradient-hover text-white font-semibold rounded-lg hover:shadow-lg"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    Choose {tier.name}
                  </motion.button>
                </CardContent>
                
                {/* Floating Particles Effect */}
                <div className="absolute inset-0 overflow-hidden opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                  <div className="absolute top-4 left-4 w-2 h-2 bg-primary/30 rounded-full animate-float" style={{ animationDelay: '0s' }}></div>
                  <div className="absolute top-8 right-6 w-1 h-1 bg-secondary/40 rounded-full animate-float" style={{ animationDelay: '1s' }}></div>
                  <div className="absolute bottom-6 left-8 w-1.5 h-1.5 bg-success/30 rounded-full animate-float" style={{ animationDelay: '2s' }}></div>
                </div>
              </Card>
            </motion.div>
          ))}
        </motion.div>
        
        {/* Additional Info */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={tiersVisible ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.8 }}
          transition={{ duration: 0.8, delay: 0.8, ease: "easeOut" }}
          className="mt-16 text-center"
        >
          <div className="inline-block p-6 gradient-cyber rounded-2xl backdrop-blur-sm">
            <h3 className="text-2xl font-bold text-white mb-2">
              💎 Upgrade Your Tier Anytime
            </h3>
            <p className="text-white/90">
              Start with Basic and upgrade as you earn more rewards
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

// Animated Counter Component
function AnimatedCounter({ from, to, duration, delay, className }: {
  from: number;
  to: number;
  duration: number;
  delay: number;
  className: string;
}) {
  const [count, setCount] = useState(from);

  useEffect(() => {
    const timer = setTimeout(() => {
      const startTime = Date.now();
      const animate = () => {
        const elapsed = Date.now() - startTime;
        const progress = Math.min(elapsed / (duration * 1000), 1);
        const currentCount = Math.floor(from + (to - from) * progress);
        setCount(currentCount);
        
        if (progress < 1) {
          requestAnimationFrame(animate);
        }
      };
      animate();
    }, delay * 1000);

    return () => clearTimeout(timer);
  }, [from, to, duration, delay]);

  return <span className={className}>{count}</span>;
} 