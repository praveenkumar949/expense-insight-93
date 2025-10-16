import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { TrendingUp, ExternalLink } from "lucide-react";
import { useEffect, useState } from "react";

interface NewsItem {
  title: string;
  source: string;
  url: string;
  publishedAt: string;
}

const FinancialNewsSection = () => {
  const [news, setNews] = useState<NewsItem[]>([]);
  const [loading, setLoading] = useState(true);

  // Financial news with real URLs
  useEffect(() => {
    const mockNews: NewsItem[] = [
      {
        title: "Stock Market Reaches New Highs Amid Economic Recovery",
        source: "Financial Times",
        url: "https://www.ft.com/markets",
        publishedAt: new Date().toISOString(),
      },
      {
        title: "RBI Announces New Interest Rate Policy",
        source: "Economic Times",
        url: "https://economictimes.indiatimes.com/markets",
        publishedAt: new Date().toISOString(),
      },
      {
        title: "Top Investment Strategies for 2025",
        source: "Money Control",
        url: "https://www.moneycontrol.com/news/business/markets/",
        publishedAt: new Date().toISOString(),
      },
      {
        title: "Mutual Funds Show Strong Performance This Quarter",
        source: "Business Standard",
        url: "https://www.business-standard.com/markets",
        publishedAt: new Date().toISOString(),
      },
    ];
    
    setTimeout(() => {
      setNews(mockNews);
      setLoading(false);
    }, 500);
  }, []);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <TrendingUp className="h-5 w-5 text-primary" />
          Daily Top Trending Financial News
        </CardTitle>
        <CardDescription>Stay updated with the latest financial trends</CardDescription>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="space-y-3">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="h-16 bg-muted animate-pulse rounded-lg" />
            ))}
          </div>
        ) : (
          <div className="space-y-3">
            {news.map((item, index) => (
              <a
                key={index}
                href={item.url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-start justify-between gap-3 p-3 rounded-lg border hover:bg-accent/50 dark:hover:bg-accent transition-colors group"
              >
                <div className="flex-1">
                  <h4 className="font-medium text-sm group-hover:text-primary transition-colors">
                    {item.title}
                  </h4>
                  <p className="text-xs text-muted-foreground mt-1">
                    {item.source} • {new Date(item.publishedAt).toLocaleDateString()}
                  </p>
                </div>
                <ExternalLink className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors flex-shrink-0" />
              </a>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default FinancialNewsSection;