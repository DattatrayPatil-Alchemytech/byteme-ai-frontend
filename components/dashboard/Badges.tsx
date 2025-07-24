'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

interface Badge {
  id: number;
  type: string;
  earnedAt: string;
}

interface BadgesProps {
  badges: Badge[];
  onShare: (message: string) => void;
}

const badgeConfig = {
  'first-ride': {
    icon: '🚗',
    title: 'First Ride',
    description: 'Completed your first sustainable driving session',
    color: 'from-primary to-blue-500'
  },
  '100km': {
    icon: '🏁',
    title: '100km Milestone',
    description: 'Drove 100 sustainable kilometers',
    color: 'from-success to-emerald-500'
  },
  'eco-warrior': {
    icon: '🌱',
    title: 'Eco Warrior',
    description: 'Maintained 90%+ eco-driving score for a week',
    color: 'from-emerald-400 to-green-500'
  },
  'streak-7': {
    icon: '🔥',
    title: '7-Day Streak',
    description: 'Drove sustainably for 7 consecutive days',
    color: 'from-orange-400 to-red-500'
  }
};

export default function Badges({ badges, onShare }: BadgesProps) {
  const handleShare = (badge: Badge) => {
    const config = badgeConfig[badge.type as keyof typeof badgeConfig];
    const message = `I just earned the ${config.title} badge on ByteMe AI! 🎉`;
    onShare(message);
  };

  return (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-foreground mb-2">Your Achievements</h2>
        <p className="text-muted-foreground">Track your sustainable driving milestones</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {badges.map((badge) => {
          const config = badgeConfig[badge.type as keyof typeof badgeConfig];
          if (!config) return null;

          return (
            <Card key={badge.id} className="hover-lift gradient-ev-green/10 border-primary/20 backdrop-blur-sm">
              <CardHeader className="text-center pb-4">
                <div className={`w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-r ${config.color} flex items-center justify-center text-2xl shadow-lg`}>
                  {config.icon}
                </div>
                <CardTitle className="text-foreground text-lg">{config.title}</CardTitle>
              </CardHeader>
              <CardContent className="text-center">
                <p className="text-muted-foreground text-sm mb-4">{config.description}</p>
                <div className="text-xs text-muted-foreground mb-4">
                  Earned on {new Date(badge.earnedAt).toLocaleDateString()}
                </div>
                <Button
                  onClick={() => handleShare(badge)}
                  variant="outline"
                  size="sm"
                  className="w-full border-primary/30 text-primary hover:bg-primary/10"
                >
                  <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.367 2.684 3 3 0 00-5.367-2.684z" />
                  </svg>
                  Share Achievement
                </Button>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {badges.length === 0 && (
        <Card className="hover-lift gradient-ev-light/10 border-success/20 backdrop-blur-sm text-center py-12">
          <CardContent>
            <div className="text-6xl mb-4">🏆</div>
            <h3 className="text-xl font-semibold text-foreground mb-2">No Badges Yet</h3>
            <p className="text-muted-foreground mb-4">Start driving sustainably to earn your first badge!</p>
            <Button className="gradient-ev-green hover:from-emerald-600 hover:to-green-700">
              Start Driving
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
} 