"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { motion } from "framer-motion";
import Link from "next/link";
import { Upload, Wallet, Trophy, Leaf, Users, BarChart3, Shield, Zap, Globe } from "lucide-react";

export default function DocumentationPage() {
  
  const features = [
    {
      icon: <Upload className="w-8 h-8" />,
      title: "Odometer Upload System",
      description:
        "Upload your EV odometer photos to track mileage and earn rewards",
      details: [
        "AI-powered odometer reading verification",
        "Photo upload with instant processing",
        "Multiple vehicle support",
        "Upload history and tracking",
      ],
    },
    {
      icon: <Wallet className="w-8 h-8" />,
      title: "VeChain Wallet Integration",
      description: "Connect your VeChain wallet to receive B3TR tokens",
      details: [
        "Secure wallet connection",
        "Automatic token distribution",
        "Transaction history tracking",
        "B3TR token balance management",
      ],
    },
    {
      icon: <Trophy className="w-8 h-8" />,
      title: "Rewards & Badges",
      description: "Earn B3TR tokens and unlock achievement badges",
      details: [
        "B3TR tokens for each upload",
        "Achievement badges for milestones",
        "Leaderboard rankings",
        "Community challenges",
      ],
    },
    {
      icon: <Leaf className="w-8 h-8" />,
      title: "Carbon Impact Tracking",
      description: "Monitor your environmental impact and contributions",
      details: [
        "Real-time carbon savings calculation",
        "Environmental impact reports",
        "Community contribution tracking",
        "Sustainability metrics",
      ],
    },
  ];

  const howItWorks = [
    {
      step: 1,
      title: "Connect Your Wallet",
      description:
        "Connect your VeChain wallet to start earning B3TR tokens",
      icon: <Wallet className="w-6 h-6" />,
    },
    {
      step: 2,
      title: "Upload Odometer",
      description: "Take a photo of your EV odometer and upload it",
      icon: <Upload className="w-6 h-6" />,
    },
    {
      step: 3,
      title: "Earn B3TR Tokens",
      description: "Receive B3TR tokens automatically to your wallet",
      icon: <Trophy className="w-6 h-6" />,
    },
    {
      step: 4,
      title: "Track Impact",
      description:
        "Monitor your carbon savings and environmental contribution",
      icon: <Leaf className="w-6 h-6" />,
    },
  ];

  const benefits = [
    {
      category: "Easy Upload Process",
      items: [
        "Simple photo upload of your odometer",
        "AI-powered automatic reading verification",
        "Instant processing and confirmation",
        "Upload history and progress tracking",
      ],
    },
    {
      category: "Secure Token Rewards",
      items: [
        "B3TR tokens sent directly to your VeChain wallet",
        "Transparent blockchain-based distribution",
        "Real-time transaction confirmation",
        "Secure wallet integration",
      ],
    },
    {
      category: "Environmental Impact",
      items: [
        "Track your carbon savings contribution",
        "Monitor environmental impact metrics",
        "Join the sustainable transportation movement",
        "Contribute to collective environmental goals",
      ],
    },
    {
      category: "Community Features",
      items: [
        "Achievement badges and milestones",
        "Leaderboard rankings and challenges",
        "Community of EV enthusiasts",
        "Share your sustainability journey",
      ],
    },
  ];

  const faqs = [
    {
      question: "How do I upload my odometer reading?",
      answer:
        "Navigate to the Uploads page, take a clear photo of your EV odometer showing the current mileage, and submit. Our AI will automatically verify the reading.",
    },
    {
      question: "How do I connect my VeChain wallet?",
      answer:
        "Click the 'Connect Wallet' button in the header and follow the prompts to securely connect your VeChain wallet to receive B3TR tokens.",
    },
    {
      question: "When do I receive my B3TR tokens?",
      answer:
        "B3TR tokens are automatically sent to your connected VeChain wallet after successful odometer verification, usually within 24 hours of upload.",
    },
    {
      question: "What if my upload is rejected?",
      answer:
        "If your upload is rejected, check the reason provided and ensure your photo is clear and shows the full odometer reading. You can re-upload anytime.",
    },
    {
      question: "How is my carbon impact calculated?",
      answer:
        "We calculate your carbon savings based on your EV miles compared to equivalent gasoline vehicle emissions using industry-standard conversion factors.",
    },
    {
      question: "Is my data and wallet connection secure?",
      answer:
        "Yes, we use enterprise-grade encryption and secure wallet integration. Your personal data and wallet connection are protected with strict security protocols.",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Header */}
      <div className="bg-white/80 backdrop-blur-xl border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-6 py-8">
          <div className="text-center">
            <h1 className="text-5xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent mb-4">
              ByteMe AI Documentation
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Your complete guide to the ByteMe AI platform - revolutionizing
              sustainable transportation through blockchain rewards and
              environmental impact tracking.
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-12">
        {/* System Overview */}
        <section className="mb-16">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              System Overview
            </h2>
            <p className="text-lg text-gray-600 max-w-4xl mx-auto">
              ByteMe AI is a revolutionary platform that incentivizes
              sustainable transportation by rewarding electric vehicle drivers
              with B3TR tokens. Our system combines blockchain technology,
              environmental tracking, and gamification to create a comprehensive
              ecosystem for eco-conscious drivers.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <Card
                key={index}
                className="bg-white/80 backdrop-blur-sm border-0 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
              >
                <CardHeader className="text-center">
                  <div className="flex justify-center mb-4 text-green-600">
                    {feature.icon}
                  </div>
                  <CardTitle className="text-xl text-gray-900">
                    {feature.title}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600 mb-4">{feature.description}</p>
                  <ul className="space-y-2">
                    {feature.details.map((detail, idx) => (
                      <li key={idx} className="flex items-start space-x-2">
                        <span className="text-green-500 mt-1">•</span>
                        <span className="text-sm text-gray-700">{detail}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* How It Works */}
        <section className="mb-16">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              How It Works
            </h2>
            <p className="text-lg text-gray-600">
              Get started with ByteMe AI in four simple steps
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {howItWorks.map((step, index) => (
              <div key={index} className="relative">
                <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg text-center">
                  <CardHeader>
                    <div className="w-16 h-16 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full flex items-center justify-center mx-auto mb-4">
                      <div className="text-white">
                        {step.icon}
                      </div>
                    </div>
                    <div className="absolute -top-3 -right-3 w-8 h-8 bg-blue-500 text-white rounded-full flex items-center justify-center text-sm font-bold">
                      {step.step}
                    </div>
                    <CardTitle className="text-lg text-gray-900">
                      {step.title}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-600">{step.description}</p>
                  </CardContent>
                </Card>
              </div>
            ))}
          </div>
        </section>

        {/* Benefits */}
        <section className="mb-16">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Platform Benefits
            </h2>
            <p className="text-lg text-gray-600">
              Discover the advantages of joining the ByteMe AI ecosystem
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {benefits.map((benefit, index) => (
              <Card
                key={index}
                className="bg-white/80 backdrop-blur-sm border-0 shadow-lg"
              >
                <CardHeader>
                  <CardTitle className="text-xl text-gray-900 flex items-center">
                    <span className="text-2xl mr-3">
                      {index === 0
                        ? "🌱"
                        : index === 1
                        ? "💰"
                        : index === 2
                        ? "👥"
                        : "📊"}
                    </span>
                    {benefit.category}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-3">
                    {benefit.items.map((item, idx) => (
                      <li key={idx} className="flex items-start space-x-3">
                        <span className="text-green-500 mt-1">✓</span>
                        <span className="text-gray-700">{item}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* User Guide */}
        <section className="mb-16">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Getting Started Guide
            </h2>
            <p className="text-lg text-gray-600">
              Follow these simple steps to start earning B3TR tokens
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="text-xl text-gray-900 flex items-center">
                  <Shield className="w-6 h-6 mr-3 text-green-600" />
                  Step 1: Connect Wallet
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm text-gray-700">
                  <li>• Click &quot;Connect Wallet&quot; in header</li>
                  <li>• Choose your VeChain wallet</li>
                  <li>• Approve the connection</li>
                  <li>• Verify wallet address</li>
                  <li>• Ready to receive tokens</li>
                </ul>
              </CardContent>
            </Card>

            <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="text-xl text-gray-900 flex items-center">
                  <Upload className="w-6 h-6 mr-3 text-blue-600" />
                  Step 2: Upload Odometer
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm text-gray-700">
                  <li>• Go to Uploads page</li>
                  <li>• Take clear odometer photo</li>
                  <li>• Ensure reading is visible</li>
                  <li>• Submit for verification</li>
                  <li>• Wait for AI processing</li>
                </ul>
              </CardContent>
            </Card>

            <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="text-xl text-gray-900 flex items-center">
                  <Trophy className="w-6 h-6 mr-3 text-yellow-600" />
                  Step 3: Earn Rewards
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm text-gray-700">
                  <li>• Receive B3TR tokens</li>
                  <li>• Check wallet balance</li>
                  <li>• View transaction history</li>
                  <li>• Track carbon savings</li>
                  <li>• Unlock achievements</li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* FAQ */}
        <section className="mb-16">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Frequently Asked Questions
            </h2>
            <p className="text-lg text-gray-600">
              Find answers to common questions about ByteMe AI
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {faqs.map((faq, index) => (
              <Card
                key={index}
                className="bg-white/80 backdrop-blur-sm border-0 shadow-lg"
              >
                <CardHeader>
                  <CardTitle className="text-lg text-gray-900">
                    {faq.question}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600">{faq.answer}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* Call to Action */}
        <section className="text-center">
          <Card className="bg-gradient-to-r from-green-500 to-emerald-500 border-0 shadow-xl">
            <CardContent className="p-12">
              <h2 className="text-3xl font-bold text-white mb-4">
                Ready to Start Your Sustainable Journey?
              </h2>
              <p className="text-green-100 text-lg mb-8 max-w-2xl mx-auto">
                Join thousands of EV drivers who are already earning rewards
                while making a positive environmental impact.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link href="/uploads">
                  <Button
                    size="lg"
                    className="bg-white text-green-600 hover:bg-gray-100 px-8 py-3"
                  >
                    Get Started Now
                  </Button>
                </Link>
                <Link href="/">
                  <Button
                    size="lg"
                    variant="outline"
                    className="bg-white text-green-600 hover:bg-gray-100 px-8 py-3"
                  >
                    View Dashboard
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </section>
      </div>
    </div>
  );
}
