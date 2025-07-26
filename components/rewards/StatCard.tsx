"use client";

import { Card, CardContent } from "@/components/ui/card";

interface StatCardProps {
  icon: string;
  title: {
    mobile: string;
    desktop: string;
  };
  value: {
    mobile: string | number;
    desktop: string | number;
  };
  subtitle: {
    mobile: string;
    desktop: string;
  };
  color: string;
  bgColor: string;
}

export default function StatCard({
  icon,
  title,
  value,
  subtitle,
  color,
  bgColor,
}: StatCardProps) {
  return (
    <Card className="bg-card/80 backdrop-blur-sm border-0 shadow-lg hover:shadow-xl transition-all duration-300">
      <CardContent className="p-6">
        <div className="flex flex-col items-center text-center space-y-4">
          <div className={`p-4 ${bgColor} rounded-xl`}>
            <span className="text-3xl">{icon}</span>
          </div>
          <div>
            <p className="text-xs sm:text-sm font-medium text-muted-foreground">
              <span className="block sm:hidden">{title.mobile}</span>
              <span className="hidden sm:block">{title.desktop}</span>
            </p>
            <p className={`text-xl sm:text-3xl font-bold ${color}`}>
              <span className="block sm:hidden">{value.mobile}</span>
              <span className="hidden sm:block">{value.desktop}</span>
            </p>
            <p className={`text-xs ${color.replace("600", "500")}`}>
              <span className="block sm:hidden">{subtitle.mobile}</span>
              <span className="hidden sm:block">{subtitle.desktop}</span>
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
