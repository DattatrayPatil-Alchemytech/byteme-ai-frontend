'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { useScrollAnimation, useScrollAnimationWithDelay } from '@/lib/scroll-animation';
import { motion, AnimatePresence } from 'framer-motion';

export default function FAQSection() {
  const [openFAQ, setOpenFAQ] = useState<number | null>(null);
  const { ref: titleRef, isVisible: titleVisible } = useScrollAnimation();
  const { ref: faqsRef, isVisible: faqsVisible } = useScrollAnimationWithDelay(200);

  const faqs = [
    {
      question: "How does the AI verification work?",
      answer: "Our advanced AI system analyzes your odometer photos to extract mileage readings with 99.9% accuracy. The system validates the reading and prevents duplicate or regressive submissions.",
      icon: "🤖"
    },
    {
      question: "What is B3TR and how do I earn it?",
      answer: "B3TR is our platform's reward token built on the VeChain blockchain. You earn tokens by uploading verified odometer readings from your electric vehicle. The more sustainable miles you drive, the more tokens you earn.",
      icon: "💰"
    },
    {
      question: "Which vehicles are supported?",
      answer: "We support all electric vehicles (EVs), plug-in hybrids (PHEVs), and hybrid vehicles. This includes Tesla, Nissan Leaf, Chevrolet Bolt, Ford Mustang Mach-E, and many more.",
      icon: "🚗"
    },
    {
      question: "How do I connect my VeChain wallet?",
      answer: "Simply click 'Connect Wallet' and choose your preferred VeChain wallet (VeWorld, Sync2, or WalletConnect). Your tokens will be automatically transferred to your connected wallet.",
      icon: "🔗"
    },
    {
      question: "What can I do with my B3TR tokens?",
      answer: "You can redeem B3TR tokens for eco-friendly products in our store, participate in challenges, or hold them for future value. All products are carefully selected for their environmental impact.",
      icon: "🛍️"
    },
    {
      question: "How often can I upload odometer readings?",
      answer: "You can upload readings as often as you drive, but we recommend weekly submissions. The system prevents duplicate submissions and ensures each reading represents new mileage.",
      icon: "📸"
    },
    {
      question: "Is my data secure and private?",
      answer: "Yes, we prioritize your privacy and security. Odometer images are processed securely and deleted after 30 days. We only store essential data for token distribution and platform functionality.",
      icon: "🔒"
    },
    {
      question: "How do challenges and leaderboards work?",
      answer: "Join weekly and monthly challenges to compete with other drivers. Earn bonus tokens for achieving milestones and climbing the leaderboards. Challenges include mileage goals, eco-driving scores, and sustainability streaks.",
      icon: "🏆"
    },
    {
      question: "What are badges and achievements?",
      answer: "Badges are digital achievements you unlock by reaching milestones like 100km driven, maintaining eco-driving scores, or completing challenges. Share your badges on social media to showcase your sustainable driving commitment.",
      icon: "🏅"
    },
    {
      question: "How do I calculate my environmental impact?",
      answer: "Our platform automatically tracks your CO₂ savings based on your electric miles. Use our impact calculator to see your personal contribution to environmental sustainability and potential token earnings.",
      icon: "🌱"
    }
  ];

  const toggleFAQ = (index: number) => {
    setOpenFAQ(openFAQ === index ? null : index);
  };

  return (
    <section id="faq" className="relative z-10 px-6 py-20">
      <div className="max-w-4xl mx-auto">
        {/* Enhanced Title */}
        <motion.div
          ref={titleRef}
          initial={{ opacity: 0, y: 50 }}
          animate={titleVisible ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold text-gradient-aurora mb-4">
            Frequently Asked Questions
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Everything you need to know about earning B3TR tokens and driving sustainably.
          </p>
        </motion.div>
        
        {/* Enhanced FAQ Items */}
        <motion.div
          ref={faqsRef}
          initial={{ opacity: 0, y: 50 }}
          animate={faqsVisible ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="space-y-4"
        >
          {faqs.map((faq, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={faqsVisible ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
              transition={{ duration: 0.6, delay: index * 0.1, ease: "easeOut" }}
              whileHover={{ 
                scale: 1.02,
                transition: { duration: 0.2 }
              }}
            >
              <Card className="overflow-hidden hover-lift backdrop-blur-sm border-2 border-transparent hover:border-primary/20 group">
                {/* Gradient Background Overlay */}
                <div className="absolute inset-0 gradient-primary opacity-5 group-hover:opacity-10 transition-opacity duration-300"></div>
                
                <CardHeader className="pb-0 relative z-10">
                  <button
                    onClick={() => toggleFAQ(index)}
                    className="w-full text-left flex items-center justify-between hover:bg-muted/50 transition-all duration-300 cursor-pointer p-0 group"
                  >
                    <div className="flex items-center gap-4">
                      <motion.div
                        className="w-10 h-10 gradient-primary rounded-full flex items-center justify-center text-white text-lg"
                        whileHover={{ rotate: 360 }}
                        transition={{ duration: 0.6 }}
                      >
                        {faq.icon}
                      </motion.div>
                      <CardTitle className="text-lg pr-4 group-hover:text-gradient-primary transition-all duration-300">
                        {faq.question}
                      </CardTitle>
                    </div>
                    <motion.span 
                      className="text-2xl transition-all duration-300 text-muted-foreground group-hover:text-primary"
                      animate={{ 
                        rotate: openFAQ === index ? 45 : 0,
                        scale: openFAQ === index ? 1.2 : 1
                      }}
                    >
                      {openFAQ === index ? '×' : '+'}
                    </motion.span>
                  </button>
                </CardHeader>
                
                <AnimatePresence>
                  {openFAQ === index && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3, ease: "easeInOut" }}
                    >
                      <CardContent className="pt-4 relative z-10">
                        <Separator className="mb-4" />
                        <motion.p 
                          className="text-muted-foreground leading-relaxed"
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.3, delay: 0.1 }}
                        >
                          {faq.answer}
                        </motion.p>
                      </CardContent>
                    </motion.div>
                  )}
                </AnimatePresence>
              </Card>
            </motion.div>
          ))}
        </motion.div>

        {/* Enhanced Support Section */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={faqsVisible ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.8 }}
          transition={{ duration: 0.8, delay: 0.8, ease: "easeOut" }}
          className="text-center mt-16"
        >
          <Card className="max-w-2xl mx-auto hover-lift backdrop-blur-sm border-2 border-transparent hover:border-primary/20 overflow-hidden relative group">
            {/* Gradient Background */}
            <div className="absolute inset-0 gradient-ocean opacity-10 group-hover:opacity-20 transition-opacity duration-300"></div>
            
            <CardContent className="p-8 relative z-10">
              <motion.div
                className="w-16 h-16 gradient-ocean rounded-full flex items-center justify-center mx-auto mb-4"
                whileHover={{ rotate: 360 }}
                transition={{ duration: 0.6 }}
              >
                <span className="text-2xl text-white">💬</span>
              </motion.div>
              
              <CardTitle className="text-2xl mb-4 text-gradient-ocean">Still Have Questions?</CardTitle>
              <p className="text-muted-foreground mb-6">
                Our support team is here to help you get started and make the most of your sustainable driving journey.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <Button 
                    variant="default" 
                    size="lg"
                    className="gradient-primary hover-glow"
                  >
                    Contact Support
                  </Button>
                </motion.div>
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <Button 
                    variant="outline" 
                    size="lg"
                    className="hover-lift hover-scale"
                  >
                    Read Documentation
                  </Button>
                </motion.div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </section>
  );
} 