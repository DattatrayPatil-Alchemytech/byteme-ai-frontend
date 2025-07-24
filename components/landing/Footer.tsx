'use client';

import { Separator } from '@/components/ui/separator';

export default function Footer() {
  return (
    <footer className="relative z-10 px-6 py-12 bg-muted/50 backdrop-blur-lg border-t border-border">
      <div className="max-w-7xl mx-auto">
        <div className="grid md:grid-cols-4 gap-8 mb-8">
          <div>
            <div className="flex items-center space-x-2 mb-4">
              <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                <span className="text-primary-foreground font-bold text-sm">⚡</span>
              </div>
              <span className="text-foreground font-bold text-lg">
                EV Rewards
              </span>
            </div>
            <p className="text-muted-foreground text-sm">
              Empowering electric vehicle owners to earn rewards while driving sustainably.
            </p>
          </div>
          
          <div>
            <h3 className="text-foreground font-semibold mb-4">Platform</h3>
            <ul className="space-y-2 text-sm">
              <li><a href="#features" className="text-muted-foreground hover:text-foreground transition-colors">Features</a></li>
              <li><a href="#how-it-works" className="text-muted-foreground hover:text-foreground transition-colors">How it Works</a></li>
              <li><a href="#rewards" className="text-muted-foreground hover:text-foreground transition-colors">Rewards</a></li>
              <li><a href="#faq" className="text-muted-foreground hover:text-foreground transition-colors">FAQ</a></li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-foreground font-semibold mb-4">Support</h3>
            <ul className="space-y-2 text-sm">
              <li><a href="#" className="text-muted-foreground hover:text-foreground transition-colors">Documentation</a></li>
              <li><a href="#" className="text-muted-foreground hover:text-foreground transition-colors">Contact Support</a></li>
              <li><a href="#" className="text-muted-foreground hover:text-foreground transition-colors">Privacy Policy</a></li>
              <li><a href="#" className="text-muted-foreground hover:text-foreground transition-colors">Terms of Service</a></li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-foreground font-semibold mb-4">Connect</h3>
            <ul className="space-y-2 text-sm">
              <li><a href="#" className="text-muted-foreground hover:text-foreground transition-colors">Twitter</a></li>
              <li><a href="#" className="text-muted-foreground hover:text-foreground transition-colors">Discord</a></li>
              <li><a href="#" className="text-muted-foreground hover:text-foreground transition-colors">Telegram</a></li>
              <li><a href="#" className="text-muted-foreground hover:text-foreground transition-colors">GitHub</a></li>
            </ul>
          </div>
        </div>
        
        <Separator className="mb-8" />
        
        <div className="flex flex-col md:flex-row justify-between items-center text-sm text-muted-foreground">
          <p>&copy; 2024 EV Rewards. All rights reserved.</p>
          <p>Built on VeChain blockchain for sustainable driving rewards.</p>
        </div>
      </div>
    </footer>
  );
} 