'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { motion } from 'framer-motion';
import { Mail, MessageCircle, Clock, Send, CheckCircle } from 'lucide-react';
import Link from 'next/link';

export default function ContactSupportPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
    category: 'general'
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    setIsSubmitting(false);
    setIsSubmitted(true);
    
    // Reset form after 3 seconds
    setTimeout(() => {
      setIsSubmitted(false);
      setFormData({
        name: '',
        email: '',
        subject: '',
        message: '',
        category: 'general'
      });
    }, 3000);
  };

  const supportCategories = [
    { value: 'general', label: 'General Inquiry', icon: '💬' },
    { value: 'technical', label: 'Technical Support', icon: '🔧' },
    { value: 'billing', label: 'Billing & Payments', icon: '💳' },
    { value: 'rewards', label: 'Rewards & Tokens', icon: '🎁' },
    { value: 'upload', label: 'Upload Issues', icon: '📤' },
    { value: 'wallet', label: 'Wallet Connection', icon: '🔗' }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900">
      <div className="max-w-7xl mx-auto px-6 py-20">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h1 className="text-4xl md:text-6xl font-bold mb-6">
            <span className="bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
              Contact Support
            </span>
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Need help with ByteMe AI? Our support team is here to assist you with any questions or issues you may have.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Contact Information */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="lg:col-span-1"
          >
            <Card className="bg-white/90 dark:bg-slate-900/90 backdrop-blur-xl border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="text-2xl font-bold text-center">Get in Touch</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Contact Methods */}
                <div className="space-y-4">
                  <div className="flex items-center space-x-3 p-3 rounded-lg bg-green-50 dark:bg-green-900/20">
                    <Mail className="w-5 h-5 text-green-600" />
                    <div>
                      <p className="font-semibold text-sm">Email Support</p>
                      <p className="text-sm text-muted-foreground">support@byteme.ai</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-3 p-3 rounded-lg bg-blue-50 dark:bg-blue-900/20">
                    <MessageCircle className="w-5 h-5 text-blue-600" />
                    <div>
                      <p className="font-semibold text-sm">Live Chat</p>
                      <p className="text-sm text-muted-foreground">Available 24/7</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-3 p-3 rounded-lg bg-purple-50 dark:bg-purple-900/20">
                    <Clock className="w-5 h-5 text-purple-600" />
                    <div>
                      <p className="font-semibold text-sm">Response Time</p>
                      <p className="text-sm text-muted-foreground">Within 24 hours</p>
                    </div>
                  </div>
                </div>

                {/* Quick Links */}
                <div className="pt-6 border-t border-border">
                  <h3 className="font-semibold mb-3">Quick Help</h3>
                  <div className="space-y-2">
                    <Link href="/documentation" className="block text-sm text-green-600 hover:text-green-700 dark:text-green-400 dark:hover:text-green-300 transition-colors">
                      📚 Documentation
                    </Link>
                    <Link href="/#faq" className="block text-sm text-green-600 hover:text-green-700 dark:text-green-400 dark:hover:text-green-300 transition-colors">
                      ❓ FAQ
                    </Link>
                    <Link href="/uploads" className="block text-sm text-green-600 hover:text-green-700 dark:text-green-400 dark:hover:text-green-300 transition-colors">
                      📤 Upload Guide
                    </Link>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Contact Form */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="lg:col-span-2"
          >
            <Card className="bg-white/90 dark:bg-slate-900/90 backdrop-blur-xl border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="text-2xl font-bold">Send us a Message</CardTitle>
                <p className="text-muted-foreground">Fill out the form below and we&apos;ll get back to you as soon as possible.</p>
              </CardHeader>
              <CardContent>
                {isSubmitted ? (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="text-center py-12"
                  >
                    <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
                    <h3 className="text-xl font-semibold mb-2">Message Sent!</h3>
                    <p className="text-muted-foreground">Thank you for contacting us. We&apos;ll respond within 24 hours.</p>
                  </motion.div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Category Selection */}
                    <div>
                      <label className="block text-sm font-medium mb-3">Category</label>
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                        {supportCategories.map((category) => (
                          <button
                            key={category.value}
                            type="button"
                            onClick={() => setFormData({ ...formData, category: category.value })}
                            className={`p-3 rounded-lg border-2 transition-all duration-200 text-left ${
                              formData.category === category.value
                                ? 'border-green-500 bg-green-50 dark:bg-green-900/20'
                                : 'border-border hover:border-green-300'
                            }`}
                          >
                            <div className="text-lg mb-1">{category.icon}</div>
                            <div className="text-sm font-medium">{category.label}</div>
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Name and Email */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label htmlFor="name" className="block text-sm font-medium mb-2">
                          Full Name *
                        </label>
                        <Input
                          id="name"
                          name="name"
                          type="text"
                          value={formData.name}
                          onChange={handleInputChange}
                          required
                          className="w-full"
                          placeholder="Enter your full name"
                        />
                      </div>
                      <div>
                        <label htmlFor="email" className="block text-sm font-medium mb-2">
                          Email Address *
                        </label>
                        <Input
                          id="email"
                          name="email"
                          type="email"
                          value={formData.email}
                          onChange={handleInputChange}
                          required
                          className="w-full"
                          placeholder="Enter your email"
                        />
                      </div>
                    </div>

                    {/* Subject */}
                    <div>
                      <label htmlFor="subject" className="block text-sm font-medium mb-2">
                        Subject *
                      </label>
                      <Input
                        id="subject"
                        name="subject"
                        type="text"
                        value={formData.subject}
                        onChange={handleInputChange}
                        required
                        className="w-full"
                        placeholder="Brief description of your issue"
                      />
                    </div>

                    {/* Message */}
                    <div>
                      <label htmlFor="message" className="block text-sm font-medium mb-2">
                        Message *
                      </label>
                      <Textarea
                        id="message"
                        name="message"
                        value={formData.message}
                        onChange={handleInputChange}
                        required
                        rows={6}
                        className="w-full resize-none"
                        placeholder="Please provide detailed information about your issue or question..."
                      />
                    </div>

                    {/* Submit Button */}
                    <Button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white font-semibold py-3 rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 disabled:opacity-50"
                    >
                      {isSubmitting ? (
                        <div className="flex items-center justify-center space-x-2">
                          <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                          <span>Sending Message...</span>
                        </div>
                      ) : (
                        <div className="flex items-center justify-center space-x-2">
                          <Send className="w-5 h-5" />
                          <span>Send Message</span>
                        </div>
                      )}
                    </Button>
                  </form>
                )}
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* FAQ Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="mt-20"
        >
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Frequently Asked Questions</h2>
            <p className="text-muted-foreground">Quick answers to common questions</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card className="bg-white/90 dark:bg-slate-900/90 backdrop-blur-xl border-0 shadow-lg">
              <CardContent className="p-6">
                <h3 className="font-semibold mb-2">How do I upload my odometer?</h3>
                <p className="text-sm text-muted-foreground">
                  Navigate to the Uploads page, take a clear photo of your odometer, and submit. Our AI will verify the reading automatically.
                </p>
              </CardContent>
            </Card>
            
            <Card className="bg-white/90 dark:bg-slate-900/90 backdrop-blur-xl border-0 shadow-lg">
              <CardContent className="p-6">
                <h3 className="font-semibold mb-2">How do I connect my wallet?</h3>
                <p className="text-sm text-muted-foreground">
                  Click the &quot;Connect Wallet&quot; button in the header and follow the prompts to connect your VeChain wallet securely.
                </p>
              </CardContent>
            </Card>
            
            <Card className="bg-white/90 dark:bg-slate-900/90 backdrop-blur-xl border-0 shadow-lg">
              <CardContent className="p-6">
                <h3 className="font-semibold mb-2">When do I receive my B3TR tokens?</h3>
                <p className="text-sm text-muted-foreground">
                  Tokens are distributed automatically after successful odometer verification, usually within 24 hours of upload.
                </p>
              </CardContent>
            </Card>
            
            <Card className="bg-white/90 dark:bg-slate-900/90 backdrop-blur-xl border-0 shadow-lg">
              <CardContent className="p-6">
                <h3 className="font-semibold mb-2">What if my upload is rejected?</h3>
                <p className="text-sm text-muted-foreground">
                  Check the rejection reason and ensure your photo is clear and shows the full odometer reading. You can re-upload anytime.
                </p>
              </CardContent>
            </Card>
          </div>
        </motion.div>
      </div>
    </div>
  );
} 