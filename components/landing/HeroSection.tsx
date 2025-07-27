"use client";

//Node Modules
import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import Link from "next/link";

//Components
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import WalletConnect from "../auth/WalletConnect";

//Redux
import { useDispatch } from "react-redux";

//Helpers
import {
  useScrollAnimation,
  useScrollAnimationWithDelay,
} from "@/lib/scroll-animation";

//API Helpers
import {
  DashboardStats,
  getDashboardStats,
} from "@/lib/apiHelpers/adminDashboard";

export default function HeroSection() {
  const { ref: titleRef, isVisible: titleVisible } = useScrollAnimation();
  const { ref: subtitleRef, isVisible: subtitleVisible } =
    useScrollAnimationWithDelay(200);
  const { ref: buttonsRef, isVisible: buttonsVisible } =
    useScrollAnimationWithDelay(400);
  const { ref: statsRef, isVisible: statsVisible } =
    useScrollAnimationWithDelay(600);
  // const dispatch = useDispatch(); // Removed unused variable

  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [animatedValue, setAnimatedValue] = useState(0);
  const animationRef = useRef<number | null>(null);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setIsLoading(true);
        const data = await getDashboardStats();
        setStats(data);
      } catch (error) {
        console.error("Failed to fetch public stats:", error);
        setStats({
          totalUsers: 0,
          activeUsers: 0,
          totalVehicles: 0,
          totalEvMiles: 0,
          totalCarbonSaved: 0,
          totalTokensDistributed: 0,
          weeklyRewardsDistributed: 0,
          totalUploads: 0,
          pendingUploads: 0,
          totalOrders: 0,
          pendingOrders: 0,
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchStats();
  }, []);

  const formatOdometerNumber = (num: number): string => {
    return num.toString().padStart(6, "0");
  };

  const formatNumber = (num: number): string => {
    if (num >= 1000000) {
      return (num / 1000000).toFixed(1) + "M";
    } else if (num >= 1000) {
      return (num / 1000).toFixed(1) + "K";
    }
    return num.toString();
  };

  // Animate counting from 0 to target value
  const animateCount = (targetValue: number, duration: number = 2000) => {
    if (animationRef.current) {
      cancelAnimationFrame(animationRef.current);
    }

    const startTime = performance.now();
    const startValue = 0;

    const updateCount = (currentTime: number) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);

      const easeOutQuart = 1 - Math.pow(1 - progress, 4);
      const currentValue = Math.floor(
        startValue + (targetValue - startValue) * easeOutQuart
      );

      setAnimatedValue(currentValue);

      if (progress < 1) {
        animationRef.current = requestAnimationFrame(updateCount);
      }
    };

    animationRef.current = requestAnimationFrame(updateCount);
  };

  // Start animation when stats are loaded and visible
  useEffect(() => {
    if (stats && statsVisible && !isLoading) {
      setAnimatedValue(0);
      setTimeout(() => {
        animateCount(stats.totalTokensDistributed || 0, 2000);
      }, 100);
    }
  }, [stats, statsVisible, isLoading]);

  // Cleanup animation on unmount
  useEffect(() => {
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, []);

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
          <Link href="/uploads">
            <Button
              variant="default"
              size="xl"
              className="gradient-ev-green hover-lift hover-glow text-white rounded-full font-semibold px-8 py-4 text-lg"
            >
              Start Earning Today
            </Button>
          </Link>

          {/* Connect Wallet - Mobile Only with Different Theme-Aware Styling */}
          <div className="sm:hidden">
            <WalletConnect className="px-8 py-4 bg-card/20 backdrop-blur-sm rounded-full text-foreground font-semibold hover:bg-card/30 transition-all duration-300 border border-success/20" />
          </div>
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
                {isLoading ? (
                  <div className="flex justify-center items-center space-x-2 mb-4">
                    {[...Array(6)].map((_, index) => (
                      <div
                        key={index}
                        className="w-12 h-16 bg-black rounded-md flex items-center justify-center animate-pulse"
                      >
                        <span className="text-2xl font-mono text-gray-400">
                          0
                        </span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="flex justify-center items-center space-x-2 mb-4">
                    {formatOdometerNumber(animatedValue)
                      .split("")
                      .map((digit: string, index: number) => (
                        <div
                          key={index}
                          className="w-12 h-16 bg-black rounded-md flex items-center justify-center"
                        >
                          <span className="odometer-digit text-2xl font-mono text-white">
                            {digit}
                          </span>
                        </div>
                      ))}
                  </div>
                )}
                <p className="text-sm text-muted-foreground">
                  Total B3TR tokens distributed to our community
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
                    {isLoading ? (
                      <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
                    ) : (
                      formatNumber(stats?.totalCarbonSaved || 0)
                    )}
                  </div>
                  <div className="text-xs text-muted-foreground">
                    Carbon Saved (kg)
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
                    {isLoading ? (
                      <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
                    ) : (
                      formatNumber(stats?.totalEvMiles || 0)
                    )}
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
                    {isLoading ? (
                      <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
                    ) : (
                      formatNumber(stats?.totalUsers || 0)
                    )}
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
                    {isLoading ? (
                      <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
                    ) : (
                      formatNumber(stats?.totalUploads || 0)
                    )}
                  </div>
                  <div className="text-xs text-muted-foreground">
                    Total Submissions
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
