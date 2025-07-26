"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  useScrollAnimation,
  useScrollAnimationWithDelay,
} from "@/lib/scroll-animation";
import { openModal } from "@/redux/modalSlice";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { useDispatch } from "react-redux";

export default function HeroSection() {
  const router = useRouter();
  const { ref: titleRef, isVisible: titleVisible } = useScrollAnimation();
  const { ref: subtitleRef, isVisible: subtitleVisible } =
    useScrollAnimationWithDelay(200);
  const { ref: buttonsRef, isVisible: buttonsVisible } =
    useScrollAnimationWithDelay(400);
  const { ref: statsRef, isVisible: statsVisible } =
    useScrollAnimationWithDelay(600);
  const dispatch = useDispatch();
  const formatOdometerNumber = (num: number): string => {
    return num.toString().padStart(6, "0");
  };

  return (
    <section className="relative z-10 px-6 py-20">
      <div className="max-w-7xl mx-auto text-center">
        {/* Enhanced Title with EV Green Gradient Text */}
        <motion.div
          ref={titleRef}
          initial={{ opacity: 0, y: 50 }}
          animate={titleVisible ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="mb-6"
        >
          <h1 className="text-5xl md:text-7xl font-bold">
            <span className="text-gradient-aurora">Drive Green,</span>
            <br />
            <span className="text-gradient-neon">Earn Rewards</span>
          </h1>
        </motion.div>

        {/* Enhanced Subtitle */}
        <motion.div
          ref={subtitleRef}
          initial={{ opacity: 0, y: 30 }}
          animate={
            subtitleVisible ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }
          }
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="mb-8"
        >
          <p className="text-xl md:text-2xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
            Upload your EV odometer photos and earn{" "}
            <span className="text-gradient-primary font-semibold">
              B3TR tokens
            </span>{" "}
            via{" "}
            <span className="text-gradient-success font-semibold">
              VeChain blockchain
            </span>
            . AI-powered verification for sustainable driving rewards.
          </p>
        </motion.div>

        {/* Enhanced Buttons with Hover Effects */}
        <motion.div
          ref={buttonsRef}
          initial={{ opacity: 0, y: 30 }}
          animate={
            buttonsVisible ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }
          }
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="flex flex-col sm:flex-row gap-4 justify-center mb-12"
        >
          <Button 
            variant="default" 
            size="xl"
            className="gradient-ev-green hover-lift hover-glow text-white font-semibold px-8 py-4 text-lg"
            onClick={() => router.push('/uploads')}
          >
            Start Earning Today
          </Button>
        </motion.div>

        {/* Enhanced Live Contract Stats with Odometer Display */}
        <motion.div
          ref={statsRef}
          initial={{ opacity: 0, y: 50 }}
          animate={statsVisible ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="max-w-6xl mx-auto"
        >
          {/* Odometer Display for Rewards Distributed */}
          <motion.div
            whileHover={{ scale: 1.02, y: -2 }}
            transition={{ duration: 0.2 }}
            className="mb-8"
          >
            <Card className="hover-lift gradient-ev-cream/10 border-warning/20 backdrop-blur-sm">
              <CardContent className="p-8 text-center">
                <h3 className="text-lg text-muted-foreground mb-4">
                  Rewards Distributed
                </h3>
                <div className="flex justify-center items-center space-x-2 mb-4">
                  {formatOdometerNumber(125000)
                    .split("")
                    .map((digit: string, index: number) => (
                      <div
                        key={index}
                        className="w-12 h-16 bg-black rounded-md flex items-center justify-center"
                      >
                        <span className="odometer-digit text-2xl font-mono">
                          {digit}
                        </span>
                      </div>
                    ))}
                </div>
                <p className="text-sm text-muted-foreground">
                  Total rewards distributed to our community
                </p>
              </CardContent>
            </Card>
          </motion.div>

          {/* Other Stats in Grid */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            <motion.div
              whileHover={{ scale: 1.02, y: -2 }}
              transition={{ duration: 0.2 }}
            >
              <Card className="hover-lift gradient-ev-green/10 border-primary/20 backdrop-blur-sm">
                <CardContent className="p-4 text-center">
                  <div className="text-2xl font-bold text-gradient-ev-green mb-1">
                    2.5M
                  </div>
                  <div className="text-xs text-muted-foreground">
                    Total Carbon Impact
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div
              whileHover={{ scale: 1.02, y: -2 }}
              transition={{ duration: 0.2, delay: 0.05 }}
            >
              <Card className="hover-lift gradient-ev-light/10 border-success/20 backdrop-blur-sm">
                <CardContent className="p-4 text-center">
                  <div className="text-2xl font-bold text-gradient-ev-light mb-1">
                    15.2K
                  </div>
                  <div className="text-xs text-muted-foreground">
                    EV Miles Tracked
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div
              whileHover={{ scale: 1.02, y: -2 }}
              transition={{ duration: 0.2, delay: 0.1 }}
            >
              <Card className="hover-lift gradient-ev-nature/10 border-success/20 backdrop-blur-sm">
                <CardContent className="p-4 text-center">
                  <div className="text-2xl font-bold text-gradient-ev-light mb-1">
                    8.7K
                  </div>
                  <div className="text-xs text-muted-foreground">
                    Users Joined
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div
              whileHover={{ scale: 1.02, y: -2 }}
              transition={{ duration: 0.2, delay: 0.2 }}
            >
              <Card className="hover-lift gradient-ev-eco/10 border-cyan-500/20 backdrop-blur-sm">
                <CardContent className="p-4 text-center">
                  <div className="text-2xl font-bold text-gradient-ev-green mb-1">
                    45.3K
                  </div>
                  <div className="text-xs text-muted-foreground">
                    Submissions
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
