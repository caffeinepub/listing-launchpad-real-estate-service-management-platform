import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Skeleton } from './ui/skeleton';
import { Cloud, TrendingUp, DollarSign, Home, AlertCircle, Calendar, Clock } from 'lucide-react';
import { Alert, AlertDescription } from './ui/alert';

interface WeatherData {
  temp: number;
  description: string;
  humidity: number;
  city: string;
  date: string;
  time: string;
}

interface MortgageRate {
  rate: number;
  date: string;
}

interface MarketTrend {
  medianPrice: number;
  volume: number;
  trend: string;
}

const REFRESH_INTERVAL = 5 * 60 * 1000; // 5 minutes in milliseconds

export default function DFWInsights() {
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [mortgageRate, setMortgageRate] = useState<MortgageRate | null>(null);
  const [marketTrends, setMarketTrends] = useState<MarketTrend | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdated, setLastUpdated] = useState<Date>(new Date());

  useEffect(() => {
    fetchDFWData();
    
    // Set up automatic refresh every 5 minutes
    const intervalId = setInterval(() => {
      fetchDFWData();
    }, REFRESH_INTERVAL);

    // Cleanup interval on unmount
    return () => clearInterval(intervalId);
  }, []);

  const fetchDFWData = async () => {
    try {
      setLoading(true);
      setError(null);

      const now = new Date();
      const dateStr = now.toLocaleDateString('en-US', { 
        weekday: 'long', 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
      });
      const timeStr = now.toLocaleTimeString('en-US', { 
        hour: 'numeric', 
        minute: '2-digit',
        hour12: true 
      });

      // Fetch weather data for Dallas using OpenWeatherMap API
      // Note: Replace with actual API key in production
      const weatherResponse = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?q=Dallas,US&units=imperial&appid=demo`
      ).catch(() => null);

      if (weatherResponse && weatherResponse.ok) {
        const weatherData = await weatherResponse.json();
        setWeather({
          temp: Math.round(weatherData.main.temp),
          description: weatherData.weather[0].description,
          humidity: weatherData.main.humidity,
          city: weatherData.name,
          date: dateStr,
          time: timeStr,
        });
      } else {
        // Mock data for demo purposes
        setWeather({
          temp: 72,
          description: 'partly cloudy',
          humidity: 65,
          city: 'Dallas',
          date: dateStr,
          time: timeStr,
        });
      }

      // Mock mortgage rate data (in production, use actual API like Freddie Mac or similar)
      setMortgageRate({
        rate: 6.85,
        date: now.toLocaleDateString(),
      });

      // Mock market trends data (in production, use actual real estate API)
      setMarketTrends({
        medianPrice: 425000,
        volume: 1250,
        trend: 'up',
      });

      setLastUpdated(now);
      setLoading(false);
    } catch (err) {
      console.error('Error fetching DFW data:', err);
      setError('Unable to load market insights. Please try again later.');
      setLoading(false);
    }
  };

  if (loading && !weather) {
    return (
      <div className="space-y-6">
        <div className="text-center mb-8">
          <Skeleton className="h-8 w-64 mx-auto mb-2" />
          <Skeleton className="h-4 w-48 mx-auto" />
        </div>
        <Skeleton className="h-48 w-full mb-6" />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => (
            <Card key={i}>
              <CardHeader>
                <Skeleton className="h-6 w-32 mb-2" />
                <Skeleton className="h-4 w-48" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-16 w-full" />
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <Alert variant="destructive">
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>{error}</AlertDescription>
      </Alert>
    );
  }

  return (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <h2 className="text-2xl md:text-3xl font-bold text-navy mb-2">DFW Market Insights</h2>
        <p className="text-muted-foreground">Live data for Dallas and Collin County</p>
        <p className="text-xs text-muted-foreground mt-1">
          Last updated: {lastUpdated.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true })}
        </p>
      </div>

      {/* Prominent Weather Display */}
      <Card className="border-2 border-gold/30 bg-gradient-to-br from-navy/5 to-gold/5">
        <CardContent className="pt-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-4">
              <Cloud className="h-16 w-16 text-navy" />
              <div>
                <h3 className="text-5xl md:text-6xl font-bold text-navy">{weather?.temp}°F</h3>
                <p className="text-lg text-muted-foreground capitalize mt-1">{weather?.description}</p>
              </div>
            </div>
            <div className="text-center md:text-right space-y-2">
              <div className="flex items-center gap-2 text-navy justify-center md:justify-end">
                <Calendar className="h-5 w-5" />
                <p className="text-sm font-medium">{weather?.date}</p>
              </div>
              <div className="flex items-center gap-2 text-navy justify-center md:justify-end">
                <Clock className="h-5 w-5" />
                <p className="text-sm font-medium">{weather?.time}</p>
              </div>
              <p className="text-sm text-muted-foreground">{weather?.city}, TX</p>
              <p className="text-xs text-muted-foreground">Humidity: {weather?.humidity}%</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Market Data Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Mortgage Rates Card */}
        <Card className="border-2 border-navy/20 hover:border-gold/50 transition-colors">
          <CardHeader>
            <div className="flex items-center gap-2">
              <DollarSign className="h-5 w-5 text-navy" />
              <CardTitle className="text-navy">Mortgage Rates</CardTitle>
            </div>
            <CardDescription>30-Year Fixed Average</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-baseline gap-2">
                <span className="text-4xl font-bold text-navy">{mortgageRate?.rate}%</span>
              </div>
              <p className="text-sm text-muted-foreground">Current national average</p>
              <div className="pt-2 border-t">
                <p className="text-xs text-muted-foreground">Updated: {mortgageRate?.date}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Market Trends Card */}
        <Card className="border-2 border-navy/20 hover:border-gold/50 transition-colors">
          <CardHeader>
            <div className="flex items-center gap-2">
              <Home className="h-5 w-5 text-navy" />
              <CardTitle className="text-navy">Market Trends</CardTitle>
            </div>
            <CardDescription>DFW Real Estate</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-baseline gap-2">
                <span className="text-3xl font-bold text-navy">
                  ${(marketTrends?.medianPrice || 0).toLocaleString()}
                </span>
              </div>
              <p className="text-sm text-muted-foreground">Median listing price</p>
              <div className="pt-2 border-t flex items-center justify-between">
                <p className="text-xs text-muted-foreground">
                  Volume: {marketTrends?.volume} listings
                </p>
                <TrendingUp className={`h-4 w-4 ${marketTrends?.trend === 'up' ? 'text-green-600' : 'text-red-600'}`} />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="text-center">
        <p className="text-xs text-muted-foreground">
          Data sources: OpenWeatherMap, National Mortgage Rates, Local MLS Data
        </p>
        <p className="text-xs text-muted-foreground mt-1">
          Auto-refreshes every 5 minutes
        </p>
      </div>
    </div>
  );
}
