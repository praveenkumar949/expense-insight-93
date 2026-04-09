import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { 
  BookOpen, 
  GraduationCap, 
  MessageSquare, 
  FileText, 
  TrendingUp,
  Search,
  Clock,
  User,
  Download,
  Play,
  CheckCircle2,
  Award,
  Lightbulb,
  ExternalLink
} from "lucide-react";

const categories = [
  { id: "budgeting", name: "Budgeting & Saving", icon: "💰", color: "bg-blue-500" },
  { id: "investing", name: "Investing Basics", icon: "📈", color: "bg-green-500" },
  { id: "retirement", name: "Retirement Planning", icon: "🏡", color: "bg-purple-500" },
  { id: "taxes", name: "Taxes & Insurance", icon: "🧾", color: "bg-orange-500" },
  { id: "credit", name: "Credit & Loans", icon: "💳", color: "bg-red-500" },
  { id: "career", name: "Career & Income", icon: "👩‍💼", color: "bg-indigo-500" },
];

const featuredArticles = [
  {
    id: 1,
    title: "The 50/30/20 Budgeting Rule Explained",
    category: "Budgeting & Saving",
    author: "Financial Expert",
    date: "2024-01-15",
    readTime: "5 min",
    excerpt: "Learn how to divide your income effectively for optimal financial health.",
  },
  {
    id: 2,
    title: "Getting Started with SIP Investments",
    category: "Investing Basics",
    author: "Investment Advisor",
    date: "2024-01-14",
    readTime: "8 min",
    excerpt: "A beginner's guide to systematic investment plans and wealth building.",
  },
  {
    id: 3,
    title: "Understanding Your Credit Score",
    category: "Credit & Loans",
    author: "Credit Specialist",
    date: "2024-01-13",
    readTime: "6 min",
    excerpt: "Everything you need to know about credit scores and how to improve them.",
  },
];

const courses = [
  {
    id: 1,
    title: "Personal Finance Fundamentals",
    level: "Beginner",
    duration: "4 hours",
    lessons: 12,
    progress: 45,
    isPremium: false,
  },
  {
    id: 2,
    title: "Advanced Investment Strategies",
    level: "Advanced",
    duration: "6 hours",
    lessons: 18,
    progress: 0,
    isPremium: true,
  },
  {
    id: 3,
    title: "Tax Planning Essentials",
    level: "Intermediate",
    duration: "3 hours",
    lessons: 10,
    progress: 100,
    isPremium: false,
  },
];

const faqs = [
  {
    question: "How can I start saving on a low income?",
    answer: "Start by tracking all your expenses for a month, identify non-essential spending, and set up automatic transfers to savings even if it's just ₹500 per month. Focus on building an emergency fund first.",
  },
  {
    question: "Is investing risky for beginners?",
    answer: "All investments carry some risk, but starting with diversified mutual funds or index funds can minimize risk. Begin with small amounts, learn consistently, and never invest money you can't afford to lose.",
  },
  {
    question: "What's the 50/30/20 budgeting rule?",
    answer: "Allocate 50% of income to needs (rent, food), 30% to wants (entertainment, dining out), and 20% to savings and debt repayment. It's a simple framework to maintain financial balance.",
  },
  {
    question: "When should I start retirement planning?",
    answer: "The earlier, the better! Starting in your 20s gives you the maximum benefit of compound interest. Even small contributions grow significantly over 30-40 years.",
  },
  {
    question: "How much emergency fund do I need?",
    answer: "Aim for 3-6 months of essential expenses. If you're self-employed or have dependents, consider saving 6-12 months worth of expenses for better security.",
  },
];

const resources = [
  { name: "Monthly Budget Template", type: "Excel", size: "120 KB" },
  { name: "Investment Checklist", type: "PDF", size: "450 KB" },
  { name: "Tax Planning Guide 2024", type: "PDF", size: "2.1 MB" },
  { name: "Emergency Fund Calculator", type: "Excel", size: "85 KB" },
];

const FinEdu = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedArticle, setSelectedArticle] = useState<typeof featuredArticles[0] | null>(null);
  const [selectedCourse, setSelectedCourse] = useState<typeof courses[0] | null>(null);
  const { toast } = useToast();

  const handleDownloadResource = (resourceName: string) => {
    toast({
      title: "Download Started",
      description: `Downloading ${resourceName}...`,
    });
  };

  const handleStartCourse = (course: typeof courses[0]) => {
    setSelectedCourse(course);
  };

  const handleReadArticle = (article: typeof featuredArticles[0]) => {
    setSelectedArticle(article);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/30">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-primary to-primary/80 text-primary-foreground py-12 px-4 sm:py-16 sm:px-6">
        <div className="container mx-auto max-w-6xl text-center">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4">
            Learn Finance the Smart Way 💡
          </h1>
          <p className="text-base sm:text-lg md:text-xl mb-6 sm:mb-8 opacity-90 max-w-3xl mx-auto px-4">
            Master personal finance from budgeting to investing with expert-curated content, 
            interactive courses, and practical tools.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center max-w-md mx-auto px-4">
            <Button size="lg" variant="secondary" className="w-full sm:w-auto">
              <GraduationCap className="mr-2 h-5 w-5" />
              Start Learning
            </Button>
            <Button size="lg" variant="outline" className="bg-primary-foreground/10 hover:bg-primary-foreground/20 border-primary-foreground/30 w-full sm:w-auto">
              <Play className="mr-2 h-5 w-5" />
              Watch Intro
            </Button>
          </div>
        </div>
      </div>

      <div className="container mx-auto max-w-6xl px-4 py-6 sm:py-8 md:py-12">
        {/* Search Bar */}
        <div className="mb-6 sm:mb-8">
          <div className="relative max-w-2xl mx-auto">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
            <Input
              placeholder="Search topics, articles, courses..."
              className="pl-10 h-12 text-base"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>

        {/* Categories */}
        <div className="mb-8 sm:mb-12">
          <h2 className="text-xl sm:text-2xl font-bold mb-4 sm:mb-6">Learning Categories</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4">
            {categories.map((category) => (
              <Card 
                key={category.id}
                className={`cursor-pointer transition-all hover:scale-105 ${
                  selectedCategory === category.id ? "ring-2 ring-primary" : ""
                }`}
                onClick={() => setSelectedCategory(category.id === selectedCategory ? null : category.id)}
              >
                <CardContent className="p-4 sm:p-6 text-center">
                  <div className="text-3xl sm:text-4xl mb-2 sm:mb-3">{category.icon}</div>
                  <p className="text-xs sm:text-sm font-medium">{category.name}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Main Content Tabs */}
        <Tabs defaultValue="articles" className="space-y-6 sm:space-y-8">
          <TabsList className="grid w-full grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-0 h-auto sm:h-10">
            <TabsTrigger value="articles" className="gap-2">
              <BookOpen className="h-4 w-4" />
              <span className="hidden sm:inline">Articles</span>
            </TabsTrigger>
            <TabsTrigger value="courses" className="gap-2">
              <GraduationCap className="h-4 w-4" />
              <span className="hidden sm:inline">Courses</span>
            </TabsTrigger>
            <TabsTrigger value="resources" className="gap-2">
              <FileText className="h-4 w-4" />
              <span className="hidden sm:inline">Resources</span>
            </TabsTrigger>
            <TabsTrigger value="faq" className="gap-2">
              <MessageSquare className="h-4 w-4" />
              <span className="hidden sm:inline">FAQ</span>
            </TabsTrigger>
          </TabsList>

          {/* Articles Tab */}
          <TabsContent value="articles" className="space-y-4 sm:space-y-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 sm:gap-4 mb-4 sm:mb-6">
              <h2 className="text-xl sm:text-2xl font-bold">Featured Articles</h2>
              <Button variant="outline">View All Articles</Button>
            </div>
            <div className="grid gap-4 sm:gap-6 md:grid-cols-2 lg:grid-cols-3">
              {featuredArticles.map((article) => (
                <Card key={article.id} className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="flex justify-between items-start mb-2">
                      <Badge variant="secondary">{article.category}</Badge>
                      <div className="flex items-center text-xs text-muted-foreground">
                        <Clock className="h-3 w-3 mr-1" />
                        {article.readTime}
                      </div>
                    </div>
                    <CardTitle className="text-lg sm:text-xl">{article.title}</CardTitle>
                    <CardDescription className="text-sm">{article.excerpt}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center justify-between text-xs sm:text-sm text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <User className="h-3 w-3" />
                        {article.author}
                      </div>
                      <span>{article.date}</span>
                    </div>
                    <Button 
                      className="w-full mt-4" 
                      variant="outline"
                      onClick={() => handleReadArticle(article)}
                    >
                      Read Article
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Courses Tab */}
          <TabsContent value="courses" className="space-y-4 sm:space-y-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 sm:gap-4 mb-4 sm:mb-6">
              <h2 className="text-xl sm:text-2xl font-bold">Learning Paths</h2>
              <Button variant="outline">Browse All Courses</Button>
            </div>
            <div className="grid gap-4 sm:gap-6 md:grid-cols-2 lg:grid-cols-3">
              {courses.map((course) => (
                <Card key={course.id}>
                  <CardHeader>
                    <div className="flex justify-between items-start mb-2">
                      <Badge>{course.level}</Badge>
                      {course.isPremium && (
                        <Badge variant="secondary" className="bg-gradient-to-r from-amber-500 to-amber-600">
                          <Award className="h-3 w-3 mr-1" />
                          Premium
                        </Badge>
                      )}
                    </div>
                    <CardTitle className="text-lg sm:text-xl">{course.title}</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex justify-between text-xs sm:text-sm text-muted-foreground">
                      <span>{course.lessons} lessons</span>
                      <span>{course.duration}</span>
                    </div>
                    {course.progress > 0 && (
                      <div className="space-y-2">
                        <div className="flex justify-between text-xs sm:text-sm">
                          <span className="text-muted-foreground">Progress</span>
                          <span className="font-medium">{course.progress}%</span>
                        </div>
                        <Progress value={course.progress} />
                      </div>
                    )}
                    <Button 
                      className="w-full" 
                      variant={course.progress === 100 ? "outline" : "default"}
                      onClick={() => handleStartCourse(course)}
                    >
                      {course.progress === 100 ? (
                        <>
                          <CheckCircle2 className="mr-2 h-4 w-4" />
                          Completed
                        </>
                      ) : course.progress > 0 ? (
                        "Continue Learning"
                      ) : (
                        <>
                          <Play className="mr-2 h-4 w-4" />
                          Start Course
                        </>
                      )}
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Interactive Learning Section */}
            <Card className="mt-6 sm:mt-8 bg-gradient-to-br from-primary/10 to-primary/5">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg sm:text-xl">
                  <Lightbulb className="h-5 w-5 sm:h-6 sm:w-6" />
                  Interactive Learning Tools
                </CardTitle>
                <CardDescription>
                  Test your knowledge and practice with real scenarios
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid gap-3 sm:gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  <Button 
                    variant="outline" 
                    className="h-auto py-3 sm:py-4 flex-col gap-2"
                    onClick={() => toast({ title: "Coming Soon", description: "Budget Simulator will be available soon!" })}
                  >
                    <TrendingUp className="h-5 w-5 sm:h-6 sm:w-6" />
                    <span className="text-sm sm:text-base">Budget Simulator</span>
                  </Button>
                  <Button 
                    variant="outline" 
                    className="h-auto py-3 sm:py-4 flex-col gap-2"
                    onClick={() => toast({ title: "Coming Soon", description: "Financial Quiz will be available soon!" })}
                  >
                    <GraduationCap className="h-5 w-5 sm:h-6 sm:w-6" />
                    <span className="text-sm sm:text-base">Financial Quiz</span>
                  </Button>
                  <Button 
                    variant="outline" 
                    className="h-auto py-3 sm:py-4 flex-col gap-2"
                    onClick={() => toast({ title: "Coming Soon", description: "Progress Tracker will be available soon!" })}
                  >
                    <Award className="h-5 w-5 sm:h-6 sm:w-6" />
                    <span className="text-sm sm:text-base">Progress Tracker</span>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Resources Tab */}
          <TabsContent value="resources" className="space-y-4 sm:space-y-6">
            <div className="mb-4 sm:mb-6">
              <h2 className="text-xl sm:text-2xl font-bold mb-2">Downloadable Resources</h2>
              <p className="text-sm sm:text-base text-muted-foreground">
                Templates, checklists, and guides to help you manage your finances
              </p>
            </div>
            <div className="grid gap-3 sm:gap-4">
              {resources.map((resource, index) => (
                <Card key={index}>
                  <CardContent className="flex items-center justify-between p-4 sm:p-6">
                    <div className="flex items-center gap-3 sm:gap-4 flex-1 min-w-0">
                      <div className="flex-shrink-0 flex h-10 w-10 sm:h-12 sm:w-12 items-center justify-center rounded-lg bg-primary/10">
                        <FileText className="h-5 w-5 sm:h-6 sm:w-6 text-primary" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <h3 className="font-medium text-sm sm:text-base truncate">{resource.name}</h3>
                        <p className="text-xs sm:text-sm text-muted-foreground">
                          {resource.type} • {resource.size}
                        </p>
                      </div>
                    </div>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="ml-2 flex-shrink-0"
                      onClick={() => handleDownloadResource(resource.name)}
                    >
                      <Download className="h-4 w-4" />
                      <span className="hidden sm:inline ml-2">Download</span>
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Recommended Tools */}
            <Card className="mt-6 sm:mt-8">
              <CardHeader>
                <CardTitle className="text-lg sm:text-xl">Recommended Apps & Tools</CardTitle>
                <CardDescription>
                  Trusted applications to manage your finances better
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid gap-3 sm:gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  {["Mint - Budget Tracker", "Groww - Investing", "Zerodha - Trading", 
                    "CRED - Credit Cards", "ET Money - Mutual Funds", "PolicyBazaar - Insurance"].map((tool) => (
                    <Button 
                      key={tool} 
                      variant="outline" 
                      className="justify-start gap-2"
                      onClick={() => toast({ title: "External Link", description: `Opening ${tool}...` })}
                    >
                      <ExternalLink className="h-4 w-4" />
                      {tool}
                    </Button>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* FAQ Tab */}
          <TabsContent value="faq" className="space-y-4 sm:space-y-6">
            <div className="mb-4 sm:mb-6">
              <h2 className="text-xl sm:text-2xl font-bold mb-2">Frequently Asked Questions</h2>
              <p className="text-sm sm:text-base text-muted-foreground">
                Quick answers to common financial questions
              </p>
            </div>
            <div className="grid gap-3 sm:gap-4">
              {faqs.map((faq, index) => (
                <Card key={index}>
                  <CardHeader>
                    <CardTitle className="text-base sm:text-lg flex items-start gap-2">
                      <MessageSquare className="h-4 w-4 sm:h-5 sm:w-5 text-primary mt-1 flex-shrink-0" />
                      <span>{faq.question}</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm sm:text-base text-muted-foreground">{faq.answer}</p>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Contact Section */}
            <Card className="bg-gradient-to-br from-primary/10 to-primary/5 mt-6 sm:mt-8">
              <CardHeader>
                <CardTitle className="text-lg sm:text-xl">Still Have Questions?</CardTitle>
                <CardDescription>
                  Can't find what you're looking for? Ask our financial experts
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button className="w-full sm:w-auto">
                  <MessageSquare className="mr-2 h-4 w-4" />
                  Ask a Question
                </Button>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>

      {/* Article Dialog */}
      <Dialog open={!!selectedArticle} onOpenChange={() => setSelectedArticle(null)}>
        <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-2xl">{selectedArticle?.title}</DialogTitle>
            <DialogDescription>
              <div className="flex items-center gap-4 text-sm text-muted-foreground mt-2">
                <div className="flex items-center gap-1">
                  <User className="h-3 w-3" />
                  {selectedArticle?.author}
                </div>
                <div className="flex items-center gap-1">
                  <Clock className="h-3 w-3" />
                  {selectedArticle?.readTime}
                </div>
                <span>{selectedArticle?.date}</span>
              </div>
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 mt-4">
            <Badge>{selectedArticle?.category}</Badge>
            <p className="text-lg">{selectedArticle?.excerpt}</p>
            <div className="prose dark:prose-invert max-w-none">
              <p>
                This is where the full article content would be displayed. In a real implementation,
                this would fetch the complete article from your backend and render it here with
                proper formatting, images, and interactive elements.
              </p>
              <p>
                The article would include detailed explanations, examples, charts, and actionable
                advice related to {selectedArticle?.category}.
              </p>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Course Dialog */}
      <Dialog open={!!selectedCourse} onOpenChange={() => setSelectedCourse(null)}>
        <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-2xl">{selectedCourse?.title}</DialogTitle>
            <DialogDescription>
              <div className="flex items-center gap-4 text-sm mt-2">
                <Badge>{selectedCourse?.level}</Badge>
                <span>{selectedCourse?.lessons} lessons</span>
                <span>{selectedCourse?.duration}</span>
              </div>
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-6 mt-4">
            {selectedCourse && selectedCourse.progress > 0 && (
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Your Progress</span>
                  <span className="font-medium">{selectedCourse.progress}%</span>
                </div>
                <Progress value={selectedCourse.progress} />
              </div>
            )}
            <div className="space-y-4">
              <h3 className="font-semibold text-lg">Course Overview</h3>
              <p className="text-muted-foreground">
                This comprehensive course covers all aspects of {selectedCourse?.title.toLowerCase()}.
                You'll learn through a combination of video lessons, interactive exercises, and
                real-world examples.
              </p>
              <h4 className="font-semibold">What You'll Learn:</h4>
              <ul className="list-disc list-inside space-y-2 text-muted-foreground">
                <li>Fundamental concepts and principles</li>
                <li>Practical strategies and techniques</li>
                <li>Real-world applications and case studies</li>
                <li>Expert tips and best practices</li>
              </ul>
              <Button className="w-full mt-6">
                {selectedCourse?.progress === 100 ? (
                  <>
                    <CheckCircle2 className="mr-2 h-4 w-4" />
                    Review Course
                  </>
                ) : selectedCourse?.progress > 0 ? (
                  <>
                    <Play className="mr-2 h-4 w-4" />
                    Continue Learning
                  </>
                ) : (
                  <>
                    <Play className="mr-2 h-4 w-4" />
                    Start Course
                  </>
                )}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default FinEdu;
