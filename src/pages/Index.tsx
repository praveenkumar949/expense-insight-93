import { useNavigate } from "react-router-dom";
import React, { useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Wallet, TrendingUp, Shield, PieChart, Calculator, FileText, Target, Sparkles } from "lucide-react";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";
import type { CarouselApi } from "@/components/ui/carousel";

const Index = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [api, setApi] = React.useState<CarouselApi>();

  useEffect(() => {
    if (user) {
      navigate("/dashboard");
    }
  }, [user, navigate]);

  useEffect(() => {
    if (!api) return;

    const interval = setInterval(() => {
      api.scrollNext();
    }, 3000);

    return () => clearInterval(interval);
  }, [api]);

  if (user) {
    return null;
  }

  const features = [
    {
      icon: <PieChart className="h-12 w-12 text-primary" />,
      title: "Expense Tracking",
      description: "Categorize and monitor your daily expenses with beautiful visualizations and detailed analytics."
    },
    {
      icon: <TrendingUp className="h-12 w-12 text-chart-wants" />,
      title: "Market Analysis",
      description: "Stay updated with real-time market insights and financial news to make informed decisions."
    },
    {
      icon: <Calculator className="h-12 w-12 text-chart-investments" />,
      title: "Financial Calculators",
      description: "Access 11+ powerful calculators including SIP, EMI, FD, and compound interest calculators."
    },
    {
      icon: <Target className="h-12 w-12 text-chart-emis" />,
      title: "Savings Goals",
      description: "Set and track your savings goals with progress monitoring and intelligent recommendations."
    },
    {
      icon: <FileText className="h-12 w-12 text-chart-loans" />,
      title: "FinNote",
      description: "Create and organize financial notes with drawing tools and secure cloud storage."
    },
    {
      icon: <Shield className="h-12 w-12 text-success" />,
      title: "AI-Powered Insights",
      description: "Get personalized financial advice and insights from our intelligent chatbot assistant."
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-muted/30 to-background">
      {/* Hero Section */}
      <section className="relative overflow-hidden px-4 py-20 sm:px-6 lg:px-8">
        <div className="absolute inset-0 bg-gradient-to-r from-primary/10 via-accent/10 to-primary/10 animate-gradient bg-[length:200%_200%]" />
        
        <div className="relative mx-auto max-w-7xl">
          <div className="text-center animate-fade-in">
            <div className="mb-6 flex justify-center">
              <div className="flex h-20 w-20 items-center justify-center rounded-full bg-primary shadow-lg animate-scale-in">
                <Wallet className="h-10 w-10 text-primary-foreground" />
              </div>
            </div>
            
            <h1 className="mb-6 text-5xl font-bold tracking-tight text-foreground sm:text-6xl lg:text-7xl">
              Welcome to <span className="text-primary">FinGuide</span>
            </h1>
            
            <p className="mx-auto mb-8 max-w-2xl text-xl text-muted-foreground sm:text-2xl">
              Your complete financial management solution. Track expenses, analyze investments, 
              and achieve your financial goals with AI-powered insights.
            </p>
            
            <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
              <Button 
                size="lg" 
                onClick={() => navigate("/auth")}
                className="group min-w-[200px] transition-all hover:scale-105 hover:shadow-lg"
              >
                Get Started
                <Sparkles className="ml-2 h-4 w-4 transition-transform group-hover:rotate-12" />
              </Button>
              <Button 
                size="lg" 
                variant="outline"
                onClick={() => navigate("/auth")}
                className="min-w-[200px] transition-all hover:scale-105 hover:shadow-lg"
              >
                Sign In
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Features Carousel */}
      <section className="px-4 py-20 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="mb-12 text-center animate-fade-in">
            <h2 className="mb-4 text-4xl font-bold text-foreground">
              Website Specifications
            </h2>
            <p className="text-xl text-muted-foreground">
              Powerful features to take control of your finances
            </p>
          </div>

          <Carousel
            setApi={setApi}
            opts={{
              align: "start",
              loop: true,
            }}
            className="mx-auto max-w-5xl"
          >
            <CarouselContent>
              {features.map((feature, index) => (
                <CarouselItem key={index} className="md:basis-1/2 lg:basis-1/3">
                  <div className="p-1">
                    <Card className="h-full transition-all hover:scale-105 hover:shadow-xl">
                      <CardContent className="flex flex-col items-center p-6 text-center">
                        <div className="mb-4 animate-scale-in" style={{ animationDelay: `${index * 100}ms` }}>
                          {feature.icon}
                        </div>
                        <h3 className="mb-2 text-xl font-semibold text-foreground">
                          {feature.title}
                        </h3>
                        <p className="text-muted-foreground">
                          {feature.description}
                        </p>
                      </CardContent>
                    </Card>
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious />
            <CarouselNext />
          </Carousel>
        </div>
      </section>

      {/* About Section */}
      <section className="px-4 py-20 sm:px-6 lg:px-8 bg-muted/50">
        <div className="mx-auto max-w-4xl text-center animate-fade-in">
          <h2 className="mb-6 text-3xl font-bold text-foreground">
            Why Choose FinGuide?
          </h2>
          <p className="mb-8 text-lg text-muted-foreground leading-relaxed">
            FinGuide is your all-in-one financial companion designed to simplify money management. 
            Whether you're tracking daily expenses, planning investments, or setting savings goals, 
            our intuitive platform provides the tools and insights you need to make smarter financial decisions.
          </p>
          <div className="grid gap-6 sm:grid-cols-3">
            <Card className="transition-all hover:scale-105 hover:shadow-lg">
              <CardContent className="p-6">
                <div className="mb-3 text-4xl font-bold text-primary">11+</div>
                <div className="text-sm text-muted-foreground">Financial Calculators</div>
              </CardContent>
            </Card>
            <Card className="transition-all hover:scale-105 hover:shadow-lg">
              <CardContent className="p-6">
                <div className="mb-3 text-4xl font-bold text-chart-wants">100%</div>
                <div className="text-sm text-muted-foreground">Secure & Private</div>
              </CardContent>
            </Card>
            <Card className="transition-all hover:scale-105 hover:shadow-lg">
              <CardContent className="p-6">
                <div className="mb-3 text-4xl font-bold text-success">AI</div>
                <div className="text-sm text-muted-foreground">Powered Insights</div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="px-4 py-20 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-3xl text-center animate-fade-in">
          <h2 className="mb-6 text-4xl font-bold text-foreground">
            Ready to Take Control of Your Finances?
          </h2>
          <p className="mb-8 text-xl text-muted-foreground">
            Join FinGuide today and start your journey towards financial freedom.
          </p>
          <Button 
            size="lg"
            onClick={() => navigate("/auth")}
            className="group min-w-[250px] transition-all hover:scale-105 hover:shadow-xl"
          >
            Start Free Now
            <Sparkles className="ml-2 h-5 w-5 transition-transform group-hover:rotate-12" />
          </Button>
        </div>
      </section>
    </div>
  );
};

export default Index;
