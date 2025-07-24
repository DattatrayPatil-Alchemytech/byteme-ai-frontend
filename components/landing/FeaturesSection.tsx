'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useScrollAnimation, useScrollAnimationWithDelay } from '@/lib/scroll-animation';
import { motion } from 'framer-motion';

export default function FeaturesSection() {
  const { ref: titleRef, isVisible: titleVisible } = useScrollAnimation();
  const { ref: featuresRef, isVisible: featuresVisible } = useScrollAnimationWithDelay(200);

  const features = [
    {
      icon: "📸",
      title: "AI-Powered Verification",
      description: "Advanced image recognition technology automatically verifies your odometer readings with 99.9% accuracy.",
      gradient: "gradient-primary",
      textGradient: "text-gradient-primary"
    },
    {
      icon: "💰",
      title: "Instant B3TR Rewards",
      description: "Earn B3TR tokens instantly on the VeChain blockchain for every verified mile you drive sustainably.",
      gradient: "gradient-success",
      textGradient: "text-gradient-success"
    },
    {
      icon: "🌱",
      title: "Environmental Impact",
      description: "Track your carbon footprint reduction and contribute to a greener future while earning rewards.",
      gradient: "gradient-secondary",
      textGradient: "text-gradient-secondary"
    }
  ];

  return (
    <section id="features" className="relative z-10 px-6 py-20">
      <div className="max-w-7xl mx-auto">
        {/* Enhanced Title with Gradient */}
        <motion.div
          ref={titleRef}
          initial={{ opacity: 0, y: 50 }}
          animate={titleVisible ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold text-gradient-aurora mb-4">
            Why Choose EV Rewards?
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Experience the future of sustainable driving with cutting-edge technology and instant rewards
          </p>
        </motion.div>
        
        {/* Enhanced Features Grid */}
        <motion.div
          ref={featuresRef}
          initial={{ opacity: 0, y: 50 }}
          animate={featuresVisible ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="grid md:grid-cols-3 gap-8"
        >
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              animate={featuresVisible ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
              transition={{ duration: 0.6, delay: index * 0.2, ease: "easeOut" }}
              whileHover={{ 
                scale: 1.05, 
                y: -10,
                transition: { duration: 0.3 }
              }}
            >
              <Card className="hover-lift backdrop-blur-sm border-2 border-transparent hover:border-primary/20 overflow-hidden relative group">
                {/* Gradient Background Overlay */}
                <div className={`absolute inset-0 ${feature.gradient} opacity-5 group-hover:opacity-10 transition-opacity duration-300`}></div>
                
                {/* Animated Border */}
                <div className="absolute inset-0 rounded-lg bg-gradient-to-r from-transparent via-primary/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                
                <CardHeader className="text-center relative z-10">
                  <motion.div 
                    className={`w-20 h-20 ${feature.gradient} rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg group-hover:shadow-xl transition-shadow duration-300`}
                    whileHover={{ rotate: 360 }}
                    transition={{ duration: 0.6 }}
                  >
                    <span className="text-3xl text-white drop-shadow-lg">{feature.icon}</span>
                  </motion.div>
                  <CardTitle className={`text-xl font-bold ${feature.textGradient}`}>
                    {feature.title}
                  </CardTitle>
                </CardHeader>
                <CardContent className="relative z-10">
                  <p className="text-muted-foreground text-center leading-relaxed">
                    {feature.description}
                  </p>
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
        
        {/* Additional Feature Highlight */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={featuresVisible ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.8 }}
          transition={{ duration: 0.8, delay: 0.8, ease: "easeOut" }}
          className="mt-16 text-center"
        >
          <div className="inline-block p-6 gradient-cyber rounded-2xl backdrop-blur-sm">
            <h3 className="text-2xl font-bold text-white mb-2">
              🚀 Ready to Start Your Green Journey?
            </h3>
            <p className="text-white/90">
              Join thousands of EV drivers already earning rewards while saving the planet
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  );
} 