"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/router";

export default function DocumentationPage() {
    const router = useRouter();
  
  const features = [
    {
      icon: "🚗",
      title: "Electric Vehicle Tracking",
      description:
        "Track your EV miles and earn rewards for sustainable driving",
      details: [
        "Automatic odometer reading uploads",
        "Real-time mileage tracking",
        "Carbon footprint calculation",
        "Vehicle model recognition",
      ],
    },
    {
      icon: "⚡",
      title: "B3TR Token System",
      description: "Earn and spend B3TR tokens for sustainable actions",
      details: [
        "0.5 B3TR per mile driven",
        "Bonus tokens for consistent driving",
        "Token marketplace for eco-friendly products",
        "Referral rewards system",
      ],
    },
    {
      icon: "🏆",
      title: "Achievement Badges",
      description: "Unlock badges for milestones and achievements",
      details: [
        "Eco Warrior - 100+ miles",
        "Mile Master - 500+ miles",
        "Early Adopter - First month user",
        "Consistent Driver - 7-day streak",
      ],
    },
    {
      icon: "🌱",
      title: "Carbon Offset Tracking",
      description: "Monitor your environmental impact and contributions",
      details: [
        "Real-time CO2 savings calculation",
        "Monthly environmental reports",
        "Carbon offset verification",
        "Community impact metrics",
      ],
    },
  ];

  const howItWorks = [
    {
      step: 1,
      title: "Connect Your Vehicle",
      description:
        "Link your electric vehicle to start tracking your sustainable miles",
      icon: "🔗",
    },
    {
      step: 2,
      title: "Drive & Upload",
      description: "Drive your EV and upload odometer readings to earn tokens",
      icon: "📱",
    },
    {
      step: 3,
      title: "Earn Rewards",
      description: "Accumulate B3TR tokens and unlock achievement badges",
      icon: "💰",
    },
    {
      step: 4,
      title: "Redeem & Impact",
      description:
        "Spend tokens on eco-friendly products and track your carbon offset",
      icon: "🌍",
    },
  ];

  const benefits = [
    {
      category: "Environmental Impact",
      items: [
        "Reduce carbon footprint through EV adoption",
        "Track and verify environmental contributions",
        "Support sustainable transportation initiatives",
        "Join a community of eco-conscious drivers",
      ],
    },
    {
      category: "Financial Rewards",
      items: [
        "Earn B3TR tokens for every mile driven",
        "Access exclusive eco-friendly product discounts",
        "Participate in referral bonus programs",
        "Unlock premium features and services",
      ],
    },
    {
      category: "Community & Social",
      items: [
        "Connect with fellow EV enthusiasts",
        "Share achievements and milestones",
        "Participate in community challenges",
        "Contribute to collective environmental goals",
      ],
    },
    {
      category: "Data & Insights",
      items: [
        "Detailed driving analytics and reports",
        "Carbon offset impact visualization",
        "Personal sustainability metrics",
        "Historical performance tracking",
      ],
    },
  ];

  const faqs = [
    {
      question: "How do I earn B3TR tokens?",
      answer:
        "You earn 0.5 B3TR tokens for every mile driven in your electric vehicle. Additional bonuses are available for consistent driving, referrals, and special achievements.",
    },
    {
      question: "What can I do with my B3TR tokens?",
      answer:
        "B3TR tokens can be spent in our marketplace on eco-friendly products, donated to environmental causes, or used to unlock premium features and services.",
    },
    {
      question: "How is my carbon offset calculated?",
      answer:
        "We calculate carbon offset based on your EV miles compared to equivalent gasoline vehicle emissions, using industry-standard conversion factors.",
    },
    {
      question: "Can I connect multiple vehicles?",
      answer:
        "Yes, you can connect multiple electric vehicles to your account and track miles for each vehicle separately.",
    },
    {
      question: "How often should I upload odometer readings?",
      answer:
        "We recommend uploading odometer readings weekly for optimal tracking and reward calculation.",
    },
    {
      question: "Is my data secure?",
      answer:
        "Yes, we use enterprise-grade encryption and follow strict data privacy protocols to protect your personal information and driving data.",
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
                  <div className="text-4xl mb-4">{feature.icon}</div>
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
                      <span className="text-2xl">{step.icon}</span>
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

        {/* Technical Architecture */}
        <section className="mb-16">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Technical Architecture
            </h2>
            <p className="text-lg text-gray-600">
              Built with cutting-edge technology for security, scalability, and
              performance
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="text-xl text-gray-900 flex items-center">
                  <span className="text-2xl mr-3">🔐</span>
                  Security & Privacy
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm text-gray-700">
                  <li>• End-to-end encryption</li>
                  <li>• GDPR compliance</li>
                  <li>• Secure blockchain transactions</li>
                  <li>• Multi-factor authentication</li>
                  <li>• Regular security audits</li>
                </ul>
              </CardContent>
            </Card>

            <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="text-xl text-gray-900 flex items-center">
                  <span className="text-2xl mr-3">⚡</span>
                  Performance
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm text-gray-700">
                  <li>• Real-time data processing</li>
                  <li>• 99.9% uptime guarantee</li>
                  <li>• Global CDN distribution</li>
                  <li>• Optimized mobile experience</li>
                  <li>• Instant token transactions</li>
                </ul>
              </CardContent>
            </Card>

            <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="text-xl text-gray-900 flex items-center">
                  <span className="text-2xl mr-3">🔗</span>
                  Blockchain Integration
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm text-gray-700">
                  <li>• Ethereum-based smart contracts</li>
                  <li>• Transparent token distribution</li>
                  <li>• Immutable transaction history</li>
                  <li>• Decentralized governance</li>
                  <li>• Cross-chain compatibility</li>
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
                <Button
                  size="lg"
                  className="bg-white text-green-600 hover:bg-gray-100 px-8 py-3"
                  onClick={() => router.push("/uploads")}
                >
                  Get Started Now
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  className="bg-white text-green-600 hover:bg-gray-100 px-8 py-3"
                  onClick={() => (window.location.href = "/")}
                >
                  View Dashboard
                </Button>
              </div>
            </CardContent>
          </Card>
        </section>
      </div>
    </div>
  );
}
