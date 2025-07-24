import Navigation from '@/components/landing/Navigation';
import HeroSection from '@/components/landing/HeroSection';
import FeaturesSection from '@/components/landing/FeaturesSection';
import HowItWorksSection from '@/components/landing/HowItWorksSection';
import RewardsSection from '@/components/landing/RewardsSection';
import FAQSection from '@/components/landing/FAQSection';
import CTASection from '@/components/landing/CTASection';
import Footer from '@/components/landing/Footer';

export default function Home() {
  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      {/* Enhanced Background Elements with Blinking Animation */}
      <div className="absolute inset-0 overflow-hidden">
        {/* Main background gradients - Simplified */}
        <div className="absolute -top-40 -right-40 w-80 h-80 gradient-aurora rounded-full blur-3xl opacity-20"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 gradient-neon rounded-full blur-3xl opacity-20"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 gradient-cosmic rounded-full blur-3xl opacity-15"></div>
        
        {/* Reduced floating elements for better performance */}
        <div className="absolute top-1/4 right-1/4 w-32 h-32 gradient-ocean rounded-full blur-2xl opacity-30 animate-float" style={{ animationDelay: '0.5s' }}></div>
        <div className="absolute bottom-1/4 left-1/4 w-24 h-24 gradient-sunset rounded-full blur-2xl opacity-25 animate-float" style={{ animationDelay: '1.5s' }}></div>
        
        {/* Dashboard-Style EV Background Elements */}
        
        {/* Large Speedometer Gauges */}
        <div className="dashboard-gauge animate-dashboard-pulse" style={{ top: '10%', left: '5%' }}></div>
        <div className="dashboard-gauge animate-dashboard-pulse" style={{ top: '15%', right: '10%', animationDelay: '1s' }}></div>
        <div className="dashboard-gauge animate-dashboard-pulse" style={{ bottom: '20%', left: '5%', width: '150px', height: '150px', animationDelay: '2s' }}></div>
        <div className="dashboard-gauge animate-dashboard-pulse" style={{ bottom: '15%', right: '5%', width: '120px', height: '120px', animationDelay: '1.5s' }}></div>
        

        
        {/* Data Streams - Blurred Text */}
        <div className="dashboard-data animate-data-stream" style={{ top: '45%', left: '15%', filter: 'blur(1px)' }}>
          SPEED: 65 MPH
        </div>
        <div className="dashboard-data animate-data-stream" style={{ top: '50%', right: '20%', animationDelay: '0.5s', filter: 'blur(1.2px)' }}>
          BATTERY: 87%
        </div>
        <div className="dashboard-data animate-data-stream" style={{ top: '55%', left: '70%', animationDelay: '1s', filter: 'blur(0.8px)' }}>
          RANGE: 245 MI
        </div>
        <div className="dashboard-data animate-data-stream" style={{ top: '60%', left: '10%', animationDelay: '1.5s', filter: 'blur(1.5px)' }}>
          TEMP: 72°F
        </div>
        <div className="dashboard-data animate-data-stream" style={{ bottom: '30%', left: '25%', animationDelay: '0.3s', filter: 'blur(1.1px)' }}>
          EFFICIENCY: 94%
        </div>
        <div className="dashboard-data animate-data-stream" style={{ bottom: '25%', right: '30%', animationDelay: '0.8s', filter: 'blur(0.9px)' }}>
          POWER: 85 kW
        </div>
        <div className="dashboard-data animate-data-stream" style={{ bottom: '20%', left: '60%', animationDelay: '1.2s', filter: 'blur(1.3px)' }}>
          CHARGE: 3.2 kW
        </div>
        
        {/* Additional Animated Elements */}
        
        {/* Floating Energy Particles */}
        <div className="absolute w-2 h-2 bg-green-400 rounded-full animate-pulse" style={{ top: '20%', left: '40%', animationDelay: '0s' }}></div>
        <div className="absolute w-1 h-1 bg-cyan-400 rounded-full animate-pulse" style={{ top: '25%', right: '35%', animationDelay: '1s' }}></div>
        <div className="absolute w-3 h-3 bg-emerald-400 rounded-full animate-pulse" style={{ top: '30%', left: '80%', animationDelay: '2s' }}></div>
        <div className="absolute w-2 h-2 bg-teal-400 rounded-full animate-pulse" style={{ bottom: '30%', left: '45%', animationDelay: '0.5s' }}></div>
        <div className="absolute w-1 h-1 bg-green-300 rounded-full animate-pulse" style={{ bottom: '25%', right: '45%', animationDelay: '1.5s' }}></div>
        
        {/* Rotating Rings */}
        <div className="absolute w-16 h-16 border-2 border-green-400/30 rounded-full animate-spin" style={{ top: '35%', left: '25%', animationDuration: '8s' }}></div>
        <div className="absolute w-12 h-12 border-2 border-cyan-400/30 rounded-full animate-spin" style={{ bottom: '40%', right: '25%', animationDuration: '12s', animationDirection: 'reverse' }}></div>
        <div className="absolute w-20 h-20 border-2 border-emerald-400/30 rounded-full animate-spin" style={{ top: '65%', left: '15%', animationDuration: '15s' }}></div>
        
        {/* Pulsing Hexagons */}
        <div className="absolute w-8 h-8 bg-gradient-to-r from-green-400/20 to-cyan-400/20 transform rotate-45 animate-pulse" style={{ top: '40%', right: '10%', animationDelay: '0.3s' }}></div>
        <div className="absolute w-6 h-6 bg-gradient-to-r from-emerald-400/20 to-teal-400/20 transform rotate-45 animate-pulse" style={{ bottom: '35%', left: '10%', animationDelay: '1.2s' }}></div>
        <div className="absolute w-10 h-10 bg-gradient-to-r from-green-300/20 to-cyan-300/20 transform rotate-45 animate-pulse" style={{ top: '75%', right: '5%', animationDelay: '0.8s' }}></div>
        
        {/* Glowing Orbs */}
        <div className="absolute w-4 h-4 bg-green-400/40 rounded-full animate-ping" style={{ top: '50%', left: '5%', animationDelay: '0s' }}></div>
        <div className="absolute w-3 h-3 bg-cyan-400/40 rounded-full animate-ping" style={{ top: '55%', right: '5%', animationDelay: '2s' }}></div>
        <div className="absolute w-5 h-5 bg-emerald-400/40 rounded-full animate-ping" style={{ bottom: '50%', left: '5%', animationDelay: '1s' }}></div>
        <div className="absolute w-2 h-2 bg-teal-400/40 rounded-full animate-ping" style={{ bottom: '45%', right: '5%', animationDelay: '3s' }}></div>
        
        {/* Animated Lines */}
        <div className="absolute w-20 h-0.5 bg-gradient-to-r from-transparent via-green-400/50 to-transparent animate-pulse" style={{ top: '25%', left: '60%', animationDelay: '0.5s' }}></div>
        <div className="absolute w-16 h-0.5 bg-gradient-to-r from-transparent via-cyan-400/50 to-transparent animate-pulse" style={{ bottom: '40%', right: '40%', animationDelay: '1.5s' }}></div>
        <div className="absolute w-24 h-0.5 bg-gradient-to-r from-transparent via-emerald-400/50 to-transparent animate-pulse" style={{ top: '70%', left: '30%', animationDelay: '2.5s' }}></div>
        
        {/* Floating Triangles */}
        <div className="absolute w-0 h-0 border-l-4 border-r-4 border-b-8 border-l-transparent border-r-transparent border-b-green-400/30 animate-bounce" style={{ top: '30%', left: '70%', animationDelay: '0s' }}></div>
        <div className="absolute w-0 h-0 border-l-4 border-r-4 border-b-8 border-l-transparent border-r-transparent border-b-cyan-400/30 animate-bounce" style={{ bottom: '30%', right: '15%', animationDelay: '1s' }}></div>
        <div className="absolute w-0 h-0 border-l-4 border-r-4 border-b-8 border-l-transparent border-r-transparent border-b-emerald-400/30 animate-bounce" style={{ top: '80%', left: '40%', animationDelay: '2s' }}></div>
        

        
        {/* BLINKING ELEMENTS - 4 Types Only */}
        
        {/* 1. Circular Status Light - Slow Blink */}
        <div className="dashboard-blink animate-blink-slow" style={{ top: '15%', left: '30%' }}></div>
        <div className="dashboard-blink animate-blink-slow" style={{ bottom: '25%', right: '20%' }}></div>
        
        {/* 2. Square Alert Light - Fast Blink */}
        <div className="dashboard-blink-alert animate-blink-fast" style={{ top: '25%', right: '40%' }}></div>
        <div className="dashboard-blink-alert animate-blink-fast" style={{ bottom: '35%', left: '30%' }}></div>
        
        {/* 3. Rectangular Warning Light - Medium Blink */}
        <div className="dashboard-blink-warning animate-blink-medium" style={{ top: '35%', left: '70%' }}></div>
        <div className="dashboard-blink-warning animate-blink-medium" style={{ bottom: '15%', right: '35%' }}></div>
        
        {/* 4. System Light with Glow - Alert Blink */}
        <div className="dashboard-blink animate-blink-alert" style={{ top: '45%', right: '15%' }}></div>
        <div className="dashboard-blink animate-blink-alert" style={{ bottom: '45%', left: '15%' }}></div>
        
        {/* Simplified grid pattern - Static for better performance */}
        <div className="absolute inset-0 opacity-3">
          <div className="absolute inset-0" style={{
            backgroundImage: `radial-gradient(circle at 25% 25%, rgba(102, 126, 234, 0.05) 0%, transparent 50%),
                             radial-gradient(circle at 75% 75%, rgba(240, 147, 251, 0.05) 0%, transparent 50%)`,
            backgroundSize: '100px 100px, 150px 150px'
          }}></div>
        </div>
      </div>
      
      <Navigation />
      
      <div className="pt-20 relative z-10">
        <HeroSection />
        <FeaturesSection />
        <HowItWorksSection />
        <RewardsSection />
        <FAQSection />
        <CTASection />
        <Footer />
      </div>
    </div>
  );
}
