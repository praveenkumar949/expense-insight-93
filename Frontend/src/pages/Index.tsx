import { useNavigate } from "react-router-dom";
import React, { useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { 
  Wallet, TrendingUp, Shield, PieChart, Calculator, FileText, 
  Target, Sparkles, Menu, X, Mail, Phone, MapPin,
  Linkedin, Github, Instagram, Twitter, ChevronRight,
  BarChart3, TrendingDown, LineChart, DollarSign, Newspaper,
  MessageSquare, FileSpreadsheet, Bell
} from "lucide-react";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";
import type { CarouselApi } from "@/components/ui/carousel";

const Index = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [api, setApi] = React.useState<CarouselApi>();
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);

  useEffect(() => {
    if (user) {
      navigate("/dashboard");
    }
  }, [user, navigate]);

  useEffect(() => {
    if (!api) return;

    const interval = setInterval(() => {
      api.scrollNext();
    }, 4000);

    return () => clearInterval(interval);
  }, [api]);

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    element?.scrollIntoView({ behavior: "smooth" });
    setMobileMenuOpen(false);
  };

  if (user) {
    return null;
  }

  const specificationSlides = [
    {
      icon: <PieChart className="h-16 w-16 text-primary" />,
      title: "Expense Tracking",
      description: "Monitor your daily expenses with intelligent categorization. Get detailed insights into your spending patterns with beautiful visualizations and analytics."
    },
    {
      icon: <Target className="h-16 w-16 text-chart-emis" />,
      title: "Savings Goals",
      description: "Set and achieve personal financial milestones effortlessly. Track your progress with visual indicators and smart recommendations."
    },
    {
      icon: <BarChart3 className="h-16 w-16 text-chart-wants" />,
      title: "Smart Reports & Insights",
      description: "Understand your spending with detailed charts and summaries. Export comprehensive reports in CSV, PDF, and DOCX formats."
    },
    {
      icon: <FileText className="h-16 w-16 text-chart-loans" />,
      title: "FinNote",
      description: "Take and organize your personal finance notes with attachments. Use drawing tools to sketch ideas and strategies."
    },
    {
      icon: <MessageSquare className="h-16 w-16 text-primary" />,
      title: "FinBot Chat Assistant",
      description: "Get instant financial insights through our intelligent AI-powered chatbot. Ask questions and receive personalized advice."
    },
    {
      icon: <TrendingUp className="h-16 w-16 text-success" />,
      title: "Market Analysis",
      description: "Track Nifty 50, Sensex, Gold, Silver, and Mutual Funds daily. Stay updated with real-time market data and trends."
    },
    {
      icon: <Bell className="h-16 w-16 text-chart-investments" />,
      title: "Auto Reports & Notifications",
      description: "Receive monthly summaries directly via email. Schedule automated reports and never miss important financial updates."
    }
  ];

  const features = [
    {
      icon: <PieChart className="h-12 w-12 text-primary" />,
      title: "Expense & Budget Management",
      description: "Categorize expenses, set budgets, and track spending in real-time"
    },
    {
      icon: <TrendingDown className="h-12 w-12 text-chart-wants" />,
      title: "Savings Insights & Trends",
      description: "Analyze saving patterns and get actionable recommendations"
    },
    {
      icon: <Target className="h-12 w-12 text-chart-emis" />,
      title: "Goal Tracking",
      description: "Set financial goals and monitor progress with visual tracking"
    },
    {
      icon: <Calculator className="h-12 w-12 text-chart-investments" />,
      title: "Financial Calculators",
      description: "Access 11+ calculators: SIP, EMI, FD, Inflation, Insurance & more"
    },
    {
      icon: <FileText className="h-12 w-12 text-chart-loans" />,
      title: "FinNote",
      description: "Create notes with drawing tools and secure cloud storage"
    },
    {
      icon: <FileSpreadsheet className="h-12 w-12 text-success" />,
      title: "Export Reports",
      description: "Download data in CSV, PDF, and DOCX formats"
    },
    {
      icon: <MessageSquare className="h-12 w-12 text-primary" />,
      title: "FinBot Assistant",
      description: "AI-powered chatbot for personalized financial guidance"
    },
    {
      icon: <Newspaper className="h-12 w-12 text-chart-wants" />,
      title: "Market Updates & News",
      description: "Stay informed with latest financial news and market trends"
    }
  ];

  const whyChoose = [
    {
      title: "Simple & Intuitive",
      description: "User-friendly interface designed for everyone, from beginners to experts"
    },
    {
      title: "Real-time Analytics",
      description: "Get instant insights with live data visualization and tracking"
    },
    {
      title: "Personalized Insights",
      description: "AI-powered recommendations tailored to your financial goals"
    },
    {
      title: "Secure & Private",
      description: "Bank-grade security with encrypted data storage"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-muted/30 to-background">
      {/* Header Navigation */}
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center justify-between px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-2">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary">
              <Wallet className="h-6 w-6 text-primary-foreground" />
            </div>
            <div className="hidden sm:block">
              <h1 className="text-xl font-bold text-foreground">FinGuide</h1>
              <p className="text-xs text-muted-foreground">Your Path to Financial Flourish</p>
            </div>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-6">
            <button onClick={() => scrollToSection("home")} className="text-sm font-medium text-foreground hover:text-primary transition-colors">
              Home
            </button>
            <button onClick={() => scrollToSection("features")} className="text-sm font-medium text-foreground hover:text-primary transition-colors">
              Features
            </button>
            <button onClick={() => scrollToSection("about")} className="text-sm font-medium text-foreground hover:text-primary transition-colors">
              About
            </button>
            <button onClick={() => scrollToSection("contact")} className="text-sm font-medium text-foreground hover:text-primary transition-colors">
              Contact
            </button>
          </nav>

          <div className="flex items-center gap-3">
            <Button variant="outline" size="sm" onClick={() => navigate("/auth")} className="hidden sm:inline-flex">
              Login
            </Button>
            <Button size="sm" onClick={() => navigate("/auth")}>
              Sign Up
            </Button>
            
            {/* Mobile Menu Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 text-foreground hover:text-primary transition-colors"
            >
              {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t bg-background animate-fade-in">
            <nav className="flex flex-col gap-4 p-4">
              <button onClick={() => scrollToSection("home")} className="text-left text-sm font-medium text-foreground hover:text-primary transition-colors">
                Home
              </button>
              <button onClick={() => scrollToSection("features")} className="text-left text-sm font-medium text-foreground hover:text-primary transition-colors">
                Features
              </button>
              <button onClick={() => scrollToSection("about")} className="text-left text-sm font-medium text-foreground hover:text-primary transition-colors">
                About
              </button>
              <button onClick={() => scrollToSection("contact")} className="text-left text-sm font-medium text-foreground hover:text-primary transition-colors">
                Contact
              </button>
            </nav>
          </div>
        )}
      </header>

      {/* Hero Section */}
      <section id="home" className="relative overflow-hidden px-4 py-20 sm:py-32 sm:px-6 lg:px-8">
        <div className="absolute inset-0 bg-gradient-to-r from-primary/10 via-accent/10 to-primary/10 animate-gradient bg-[length:200%_200%]" />
        
        <div className="relative mx-auto max-w-7xl">
          <div className="text-center animate-fade-in">
            <div className="mb-8 flex justify-center">
              <div className="flex h-24 w-24 items-center justify-center rounded-full bg-primary shadow-2xl animate-scale-in">
                <Wallet className="h-12 w-12 text-primary-foreground" />
              </div>
            </div>
            
            <h1 className="mb-6 text-4xl font-bold tracking-tight text-foreground sm:text-6xl lg:text-7xl">
              Track, Save, and Grow Your <span className="text-primary">Wealth Smarter</span>
            </h1>
            
            <p className="mx-auto mb-10 max-w-3xl text-lg text-muted-foreground sm:text-xl lg:text-2xl">
              Your all-in-one personal finance companion — track expenses, analyze savings, 
              and make informed financial decisions with AI-powered insights.
            </p>
            
            <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
              <Button 
                size="lg" 
                onClick={() => navigate("/auth")}
                className="group min-w-[220px] transition-all hover:scale-105 hover:shadow-xl"
              >
                Get Started
                <Sparkles className="ml-2 h-5 w-5 transition-transform group-hover:rotate-12" />
              </Button>
              <Button 
                size="lg" 
                variant="outline"
                onClick={() => scrollToSection("features")}
                className="min-w-[220px] transition-all hover:scale-105 hover:shadow-lg"
              >
                Explore Features
                <ChevronRight className="ml-2 h-5 w-5" />
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* App Specifications Carousel */}
      <section className="px-4 py-20 sm:px-6 lg:px-8 bg-muted/50">
        <div className="mx-auto max-w-7xl">
          <div className="mb-12 text-center animate-fade-in">
            <h2 className="mb-4 text-3xl font-bold text-foreground sm:text-4xl lg:text-5xl">
              Website Specifications
            </h2>
            <p className="text-lg text-muted-foreground sm:text-xl">
              Discover the powerful features that make FinGuide your perfect financial companion
            </p>
          </div>

          <Carousel
            setApi={setApi}
            opts={{
              align: "start",
              loop: true,
            }}
            className="mx-auto max-w-6xl"
          >
            <CarouselContent>
              {specificationSlides.map((spec, index) => (
                <CarouselItem key={index} className="md:basis-1/2 lg:basis-1/2">
                  <div className="p-2">
                    <Card className="h-full transition-all hover:scale-105 hover:shadow-2xl border-2">
                      <CardContent className="flex flex-col items-center p-8 text-center h-full">
                        <div className="mb-6 animate-scale-in" style={{ animationDelay: `${index * 100}ms` }}>
                          {spec.icon}
                        </div>
                        <h3 className="mb-4 text-2xl font-bold text-foreground">
                          {spec.title}
                        </h3>
                        <p className="text-muted-foreground leading-relaxed">
                          {spec.description}
                        </p>
                      </CardContent>
                    </Card>
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious className="hidden md:flex" />
            <CarouselNext className="hidden md:flex" />
          </Carousel>
        </div>
      </section>

      {/* Features Highlights */}
      <section id="features" className="px-4 py-20 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="mb-12 text-center animate-fade-in">
            <h2 className="mb-4 text-3xl font-bold text-foreground sm:text-4xl lg:text-5xl">
              Core Features
            </h2>
            <p className="text-lg text-muted-foreground sm:text-xl">
              Everything you need to manage your finances effectively
            </p>
          </div>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {features.map((feature, index) => (
              <Card 
                key={index} 
                className="group transition-all hover:scale-105 hover:shadow-xl animate-fade-in"
                style={{ animationDelay: `${index * 50}ms` }}
              >
                <CardContent className="flex flex-col items-center p-6 text-center">
                  <div className="mb-4 transition-transform group-hover:scale-110">
                    {feature.icon}
                  </div>
                  <h3 className="mb-2 text-lg font-semibold text-foreground">
                    {feature.title}
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    {feature.description}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Why Choose FinGuide */}
      <section id="about" className="px-4 py-20 sm:px-6 lg:px-8 bg-muted/50">
        <div className="mx-auto max-w-6xl">
          <div className="mb-12 text-center animate-fade-in">
            <h2 className="mb-4 text-3xl font-bold text-foreground sm:text-4xl lg:text-5xl">
              Why Choose FinGuide?
            </h2>
            <p className="mx-auto max-w-3xl text-lg text-muted-foreground leading-relaxed sm:text-xl">
              FinGuide is your all-in-one financial companion designed to simplify money management. 
              Whether you're tracking daily expenses, planning investments, or setting savings goals, 
              our intuitive platform provides the tools and insights you need to make smarter financial decisions.
            </p>
          </div>

          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4 mb-12">
            {whyChoose.map((item, index) => (
              <Card 
                key={index} 
                className="transition-all hover:scale-105 hover:shadow-xl animate-fade-in"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <CardContent className="p-6 text-center">
                  <h3 className="mb-3 text-xl font-bold text-foreground">
                    {item.title}
                  </h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {item.description}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="grid gap-6 sm:grid-cols-3 animate-fade-in">
            <Card className="transition-all hover:scale-105 hover:shadow-lg">
              <CardContent className="p-6 text-center">
                <div className="mb-3 text-5xl font-bold text-primary">11+</div>
                <div className="text-sm font-medium text-muted-foreground">Financial Calculators</div>
              </CardContent>
            </Card>
            <Card className="transition-all hover:scale-105 hover:shadow-lg">
              <CardContent className="p-6 text-center">
                <div className="mb-3 text-5xl font-bold text-chart-wants">100%</div>
                <div className="text-sm font-medium text-muted-foreground">Secure & Private</div>
              </CardContent>
            </Card>
            <Card className="transition-all hover:scale-105 hover:shadow-lg">
              <CardContent className="p-6 text-center">
                <div className="mb-3 text-5xl font-bold text-success">
                  <Shield className="h-12 w-12 mx-auto" />
                </div>
                <div className="text-sm font-medium text-muted-foreground">AI-Powered Insights</div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="px-4 py-20 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-4xl text-center animate-fade-in">
          <h2 className="mb-6 text-3xl font-bold text-foreground sm:text-4xl lg:text-5xl">
            Ready to Take Control of Your Finances?
          </h2>
          <p className="mb-8 text-lg text-muted-foreground sm:text-xl">
            Join FinGuide today and start your journey towards financial freedom. 
            No credit card required.
          </p>
          <Button 
            size="lg"
            onClick={() => navigate("/auth")}
            className="group min-w-[250px] transition-all hover:scale-105 hover:shadow-2xl"
          >
            Start Free Now
            <Sparkles className="ml-2 h-5 w-5 transition-transform group-hover:rotate-12" />
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer id="contact" className="border-t bg-muted/30 px-4 py-12 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {/* Brand */}
            <div>
              <div className="flex items-center gap-2 mb-4">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary">
                  <Wallet className="h-6 w-6 text-primary-foreground" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-foreground">FinGuide</h3>
                  <p className="text-xs text-muted-foreground">Financial Flourish</p>
                </div>
              </div>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Your trusted companion for smarter financial management and growth.
              </p>
            </div>

            {/* Quick Links */}
            <div>
              <h4 className="mb-4 text-sm font-semibold text-foreground">Quick Links</h4>
              <ul className="space-y-2 text-sm">
                <li>
                  <button onClick={() => scrollToSection("home")} className="text-muted-foreground hover:text-primary transition-colors">
                    Home
                  </button>
                </li>
                <li>
                  <button onClick={() => scrollToSection("features")} className="text-muted-foreground hover:text-primary transition-colors">
                    Features
                  </button>
                </li>
                <li>
                  <button onClick={() => scrollToSection("about")} className="text-muted-foreground hover:text-primary transition-colors">
                    About
                  </button>
                </li>
                <li>
                  <button onClick={() => navigate("/auth")} className="text-muted-foreground hover:text-primary transition-colors">
                    Sign Up
                  </button>
                </li>
              </ul>
            </div>

            {/* Legal */}
            <div>
              <h4 className="mb-4 text-sm font-semibold text-foreground">Legal</h4>
              <ul className="space-y-2 text-sm">
                <li>
                  <button className="text-muted-foreground hover:text-primary transition-colors">
                    Terms & Conditions
                  </button>
                </li>
                <li>
                  <button className="text-muted-foreground hover:text-primary transition-colors">
                    Privacy Policy
                  </button>
                </li>
              </ul>
            </div>

            {/* Contact */}
            <div>
              <h4 className="mb-4 text-sm font-semibold text-foreground">Contact</h4>
              <ul className="space-y-3 text-sm">
                <li className="flex items-center gap-2 text-muted-foreground">
                  <Mail className="h-4 w-4" />
                  <span>support@finguide.com</span>
                </li>
                <li className="flex items-center gap-2 text-muted-foreground">
                  <Phone className="h-4 w-4" />
                  <span>+91 XXXXX XXXXX</span>
                </li>
                <li className="flex items-center gap-2 text-muted-foreground">
                  <MapPin className="h-4 w-4" />
                  <span>India</span>
                </li>
              </ul>

              {/* Social Media */}
              <div className="mt-4 flex gap-3">
                <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-primary transition-colors">
                  <Linkedin className="h-5 w-5" />
                </a>
                <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-primary transition-colors">
                  <Twitter className="h-5 w-5" />
                </a>
                <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-primary transition-colors">
                  <Instagram className="h-5 w-5" />
                </a>
                <a href="https://github.com" target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-primary transition-colors">
                  <Github className="h-5 w-5" />
                </a>
              </div>
            </div>
          </div>

          <div className="mt-12 border-t pt-8 text-center text-sm text-muted-foreground">
            <p>© 2025 FinGuide. Created by Praveen Kumar. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
