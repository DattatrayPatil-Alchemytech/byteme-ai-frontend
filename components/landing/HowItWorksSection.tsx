"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  useScrollAnimation,
  useScrollAnimationWithDelay,
} from "@/lib/scroll-animation";
import { motion } from "framer-motion";

export default function HowItWorksSection() {
  const { ref: titleRef, isVisible: titleVisible } = useScrollAnimation();
  const { ref: stepsRef, isVisible: stepsVisible } =
    useScrollAnimationWithDelay(200);

  const steps = [
    {
      number: "1",
      title: "Connect Wallet",
      description: "Link your VeChain wallet to start earning rewards",
      gradient: "gradient-primary",
      textGradient: "text-gradient-primary",
      icon: "🔗",
    },
    {
      number: "2",
      title: "Upload Photo",
      description: "Take a clear photo of your EV odometer",
      gradient: "gradient-success",
      textGradient: "text-gradient-success",
      icon: "📸",
    },
    {
      number: "3",
      title: "AI Verification",
      description: "Our AI instantly verifies the mileage reading",
      gradient: "gradient-secondary",
      textGradient: "text-gradient-secondary",
      icon: "🤖",
    },
    {
      number: "4",
      title: "Earn Tokens",
      description: "Receive B3TR tokens directly to your wallet",
      gradient: "gradient-warning",
      textGradient: "text-gradient-warning",
      icon: "💰",
    },
  ];

  return (
    <section id="how-it-works" className="relative z-10 px-6 py-20">
      <div className="max-w-7xl mx-auto">
        {/* Enhanced Title */}
        <motion.div
          ref={titleRef}
          initial={{ opacity: 0, y: 50 }}
          animate={titleVisible ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold text-gradient-neon mb-4">
            How It Works
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Get started in just 4 simple steps and begin earning rewards for
            your sustainable driving
          </p>
        </motion.div>

        {/* Enhanced Steps with Connecting Lines */}
        <motion.div
          ref={stepsRef}
          initial={{ opacity: 0, y: 50 }}
          animate={stepsVisible ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="relative"
        >
          {/* Connecting Lines */}
          <div className="hidden md:block absolute top-1/2 left-0 right-0 h-0.5 gradient-aurora opacity-30 transform -translate-y-1/2 z-0"></div>

          <div className="grid md:grid-cols-4 gap-8 relative z-10">
            {steps.map((step, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                animate={
                  stepsVisible ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }
                }
                transition={{
                  duration: 0.6,
                  delay: index * 0.2,
                  ease: "easeOut",
                }}
                whileHover={{
                  scale: 1.05,
                  y: -10,
                  transition: { duration: 0.3 },
                }}
                className="relative"
              >
                {/* Connecting Arrow (except for last item) */}
                {index < steps.length - 1 && (
                  <div className="hidden md:block absolute top-1/2 -right-4 w-8 h-8 transform -translate-y-1/2 z-20">
                    <motion.div
                      className="w-full h-full gradient-aurora rounded-full flex items-center justify-center"
                      animate={{
                        scale: [1, 1.2, 1],
                        opacity: [0.5, 1, 0.5],
                      }}
                      transition={{
                        duration: 2,
                        repeat: Infinity,
                        delay: index * 0.5,
                      }}
                    >
                      <span className="text-white text-sm">→</span>
                    </motion.div>
                  </div>
                )}

                <Card className="hover-lift backdrop-blur-sm border-2 border-transparent hover:border-primary/20 overflow-hidden relative group">
                  {/* Gradient Background Overlay */}
                  <div
                    className={`absolute inset-0 ${step.gradient} opacity-5 group-hover:opacity-10 transition-opacity duration-300`}
                  ></div>

                  {/* Animated Border */}
                  <div className="absolute inset-0 rounded-lg bg-gradient-to-r from-transparent via-primary/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

                  <CardHeader className="text-center relative z-10">
                    <motion.div
                      className={`w-24 h-24 ${step.gradient} rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg group-hover:shadow-xl transition-shadow duration-300 relative`}
                      whileHover={{ rotate: 360 }}
                      transition={{ duration: 0.6 }}
                    >
                      {/* Step Number */}
                      <span className="text-3xl font-bold text-white drop-shadow-lg absolute">
                        {step.number}
                      </span>

                      {/* Floating Icon */}
                      <motion.div
                        className="absolute inset-0 flex items-center justify-center"
                        animate={{
                          y: [0, -5, 0],
                          opacity: [0.7, 1, 0.7],
                        }}
                        transition={{
                          duration: 2,
                          repeat: Infinity,
                          delay: index * 0.3,
                        }}
                      >
                        <span className="text-2xl">{step.icon}</span>
                      </motion.div>
                    </motion.div>

                    <CardTitle
                      className={`text-xl font-bold ${step.textGradient}`}
                    >
                      {step.title}
                    </CardTitle>
                  </CardHeader>

                  <CardContent className="relative z-10">
                    <p className="text-muted-foreground text-center leading-relaxed">
                      {step.description}
                    </p>
                  </CardContent>

                  {/* Floating Particles Effect */}
                  <div className="absolute inset-0 overflow-hidden opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                    <div
                      className="absolute top-4 left-4 w-2 h-2 bg-primary/30 rounded-full animate-float"
                      style={{ animationDelay: "0s" }}
                    ></div>
                    <div
                      className="absolute top-8 right-6 w-1 h-1 bg-secondary/40 rounded-full animate-float"
                      style={{ animationDelay: "1s" }}
                    ></div>
                    <div
                      className="absolute bottom-6 left-8 w-1.5 h-1.5 bg-success/30 rounded-full animate-float"
                      style={{ animationDelay: "2s" }}
                    ></div>
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Call to Action */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={
            stepsVisible ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.8 }
          }
          transition={{ duration: 0.8, delay: 1, ease: "easeOut" }}
          className="mt-16 text-center"
        >
          <div className="inline-block p-8 gradient-ocean rounded-3xl backdrop-blur-sm shadow-2xl">
                              <h3 className="text-3xl font-bold text-foreground mb-4">
              🎯 Ready to Get Started?
            </h3>
                          <p className="text-foreground/90 text-lg mb-6 max-w-md">
              Join the revolution of sustainable driving and start earning
              rewards today
            </p>
            <motion.button
                              className="px-8 py-4 bg-card/20 backdrop-blur-sm rounded-full text-foreground font-semibold hover:bg-card/30 transition-all duration-300 border border-border/30"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Connect Your Wallet Now
            </motion.button>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
