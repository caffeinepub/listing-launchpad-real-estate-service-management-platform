import { useState } from 'react';
import { useInternetIdentity } from '../hooks/useInternetIdentity';
import { useSubmitContactForm } from '../hooks/useQueries';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Textarea } from '../components/ui/textarea';
import { CheckCircle2, Clock, Wrench, Home, MessageCircle, Phone } from 'lucide-react';
import { SiFacebook, SiInstagram, SiLinkedin, SiX } from 'react-icons/si';

const plans = [
  {
    name: 'Essential',
    price: '$99',
    description: 'Includes basic maintenance request management, photo uploads, and status tracking for up to 3 active listings.',
    hours: 'Up to 2 hours of repairs/touch-ups',
    features: [
      'Up to 3 active listings',
      'Basic maintenance request management',
      'Photo uploads',
      'Status tracking',
      'Up to 2 hours of repairs/touch-ups',
      'Email support',
      '48-hour response time'
    ],
  },
  {
    name: 'Pro',
    price: '$199',
    description: 'Includes all Essential features plus priority scheduling, unlimited active listings, and direct messaging with the admin team for faster response.',
    hours: 'Up to 5 hours including painting and fixture installs',
    features: [
      'All Essential features',
      'Unlimited active listings',
      'Priority scheduling',
      'Direct messaging with admin team',
      'Up to 5 hours including painting and fixture installs',
      'Faster response times',
      'Phone & email support',
      '24-hour response time'
    ],
    popular: true,
  },
  {
    name: 'Concierge',
    price: '$299',
    description: 'Includes all Pro features plus custom make-ready coordination, on-site visit scheduling, and 24/7 request support for high-end listings.',
    hours: 'Up to 10 hours with full project coordination and staging assistance',
    features: [
      'All Pro features',
      'Custom make-ready coordination',
      'On-site visit scheduling',
      '24/7 request support',
      'Up to 10 hours with full project coordination',
      'Staging assistance',
      'Dedicated account manager',
      'Full photo & video documentation',
      'Weekend & emergency service'
    ],
  },
];

export default function LandingPage() {
  const [formData, setFormData] = useState({ name: '', email: '', phone: '', message: '' });
  const { mutate: submitForm, isPending } = useSubmitContactForm();
  const { login, loginStatus } = useInternetIdentity();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    submitForm(formData, {
      onSuccess: () => {
        setFormData({ name: '', email: '', phone: '', message: '' });
      },
    });
  };

  const handleGetStarted = async () => {
    try {
      await login();
    } catch (error: any) {
      console.error('Login error:', error);
    }
  };

  const handleTextContact = () => {
    // Using sms: scheme opens iMessage on iOS and native texting app on Android
    window.location.href = 'sms:+12146076245?body=Hi, I would like to learn more about your services.';
  };

  const handleCallContact = () => {
    window.location.href = 'tel:+12146076245';
  };

  const isLoggingIn = loginStatus === 'logging-in';

  return (
    <div className="w-full">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-navy via-navy-light to-navy overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <img src="/assets/generated/hero-background.dim_1200x600.jpg" alt="" className="w-full h-full object-cover" />
        </div>
        <div className="container relative py-24 md:py-32">
          <div className="max-w-3xl mx-auto text-center text-white">
            <h1 className="text-4xl md:text-6xl font-bold mb-6 leading-tight">
              Elevate Your Listings with Professional Service Management
            </h1>
            <p className="text-xl md:text-2xl mb-8 text-white/90">
              Streamline property maintenance and remodeling for North Texas real estate professionals
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button 
                size="lg" 
                className="bg-gold hover:bg-gold-dark text-navy font-semibold text-lg px-8"
                onClick={handleGetStarted}
                disabled={isLoggingIn}
              >
                {isLoggingIn ? 'Loading...' : 'Get Started Today'}
              </Button>
              <Button 
                size="lg" 
                variant="outline" 
                className="bg-white/10 hover:bg-white/20 text-white border-white/30"
                onClick={() => {
                  const plansSection = document.getElementById('plans-section');
                  plansSection?.scrollIntoView({ behavior: 'smooth' });
                }}
              >
                View Plans
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-background">
        <div className="container">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-navy mb-4">Why Choose Listing Launchpad?</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Designed specifically for Dallas and Collin County real estate professionals
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <Card className="border-2 hover:border-gold/50 transition-colors">
              <CardHeader>
                <div className="w-12 h-12 rounded-lg bg-navy/10 flex items-center justify-center mb-4">
                  <Home className="h-6 w-6 text-navy" />
                </div>
                <CardTitle className="text-navy">Property Portfolio</CardTitle>
                <CardDescription>
                  Manage all your DFW properties in one centralized dashboard
                </CardDescription>
              </CardHeader>
              <CardContent>
                <img src="/assets/generated/luxury-home-exterior.dim_600x400.jpg" alt="Property" className="rounded-lg w-full h-48 object-cover" />
              </CardContent>
            </Card>

            <Card className="border-2 hover:border-gold/50 transition-colors">
              <CardHeader>
                <div className="w-12 h-12 rounded-lg bg-navy/10 flex items-center justify-center mb-4">
                  <Wrench className="h-6 w-6 text-navy" />
                </div>
                <CardTitle className="text-navy">Priority Service Requests</CardTitle>
                <CardDescription>
                  Create and track maintenance requests with photo documentation
                </CardDescription>
              </CardHeader>
              <CardContent>
                <img src="/assets/generated/service-tools.dim_400x300.jpg" alt="Services" className="rounded-lg w-full h-48 object-cover" />
              </CardContent>
            </Card>

            <Card className="border-2 hover:border-gold/50 transition-colors">
              <CardHeader>
                <div className="w-12 h-12 rounded-lg bg-navy/10 flex items-center justify-center mb-4">
                  <Clock className="h-6 w-6 text-navy" />
                </div>
                <CardTitle className="text-navy">Real-Time Updates</CardTitle>
                <CardDescription>
                  Track service status from pending to completion in real-time
                </CardDescription>
              </CardHeader>
              <CardContent>
                <img src="/assets/generated/realtor-professional.dim_400x500.jpg" alt="Professional" className="rounded-lg w-full h-48 object-cover" />
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Plans Section */}
      <section id="plans-section" className="py-20 bg-gradient-to-br from-gold/5 via-gold/10 to-gold/5">
        <div className="container">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-navy mb-4">Choose Your Plan</h2>
            <p className="text-lg text-muted-foreground">
              Flexible flat-fee pricing for agents at every level
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {plans.map((plan) => (
              <Card 
                key={plan.name} 
                className={`relative transition-all hover:shadow-xl ${
                  plan.popular 
                    ? 'border-2 border-gold shadow-2xl scale-105 bg-gradient-to-br from-white to-gold/5' 
                    : 'border-2 border-gold/30 hover:border-gold/60'
                }`}
              >
                {plan.popular && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                    <span className="bg-gradient-to-r from-gold to-gold-dark text-navy px-6 py-1.5 rounded-full text-sm font-bold shadow-lg">
                      Most Popular
                    </span>
                  </div>
                )}
                <CardHeader className="text-center pb-6">
                  <CardTitle className="text-2xl text-navy mb-2">{plan.name}</CardTitle>
                  <div className="mb-4">
                    <span className="text-5xl font-bold bg-gradient-to-br from-gold to-gold-dark bg-clip-text text-transparent">
                      {plan.price}
                    </span>
                    <span className="text-muted-foreground text-lg">/month</span>
                  </div>
                  <div className="mb-3 px-3 py-2 bg-gold/10 rounded-lg">
                    <p className="text-sm font-semibold text-navy">{plan.hours}</p>
                  </div>
                  <CardDescription className="text-base leading-relaxed px-2">
                    {plan.description}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-3 mb-6">
                    {plan.features.map((feature) => (
                      <li key={feature} className="flex items-start gap-3">
                        <CheckCircle2 className="h-5 w-5 text-gold shrink-0 mt-0.5" />
                        <span className="text-sm text-foreground">{feature}</span>
                      </li>
                    ))}
                  </ul>
                  <Button 
                    onClick={handleGetStarted}
                    disabled={isLoggingIn}
                    className={`w-full ${
                      plan.popular 
                        ? 'bg-gradient-to-r from-gold to-gold-dark hover:from-gold-dark hover:to-gold text-navy font-bold shadow-lg' 
                        : 'bg-navy hover:bg-navy/90 text-white'
                    }`}
                  >
                    {isLoggingIn ? 'Loading...' : 'Get Started'}
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Form Section */}
      <section className="py-20 bg-background">
        <div className="container max-w-2xl">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-navy mb-4">Ready to Get Started?</h2>
            <p className="text-lg text-muted-foreground mb-2">
              Contact us directly to discuss your plan selection and get personalized assistance.
            </p>
            <p className="text-base text-gold font-semibold mb-6">
              Have questions about which plan is right for you? We're here to help!
            </p>
            
            {/* Quick Contact Buttons */}
            <div className="flex flex-col sm:flex-row gap-3 justify-center mb-8">
              <Button 
                onClick={handleTextContact}
                variant="outline"
                className="gap-2 border-navy text-navy hover:bg-navy hover:text-white"
              >
                <MessageCircle className="h-4 w-4" />
                Text Us
              </Button>
              <Button 
                onClick={handleCallContact}
                variant="outline"
                className="gap-2 border-navy text-navy hover:bg-navy hover:text-white"
              >
                <Phone className="h-4 w-4" />
                Call Us
              </Button>
            </div>

            {/* Social Media Links */}
            <div className="flex gap-4 justify-center mb-8">
              <a 
                href="https://instagram.com" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-navy hover:text-gold transition-colors"
                aria-label="Instagram"
              >
                <SiInstagram className="h-6 w-6" />
              </a>
              <a 
                href="https://facebook.com" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-navy hover:text-gold transition-colors"
                aria-label="Facebook"
              >
                <SiFacebook className="h-6 w-6" />
              </a>
              <a 
                href="https://linkedin.com" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-navy hover:text-gold transition-colors"
                aria-label="LinkedIn"
              >
                <SiLinkedin className="h-6 w-6" />
              </a>
              <a 
                href="https://x.com" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-navy hover:text-gold transition-colors"
                aria-label="X (Twitter)"
              >
                <SiX className="h-6 w-6" />
              </a>
            </div>
          </div>

          <Card className="border-2 border-gold/30 shadow-lg">
            <CardContent className="pt-6">
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Name</Label>
                    <Input
                      id="name"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      placeholder="Your full name"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone</Label>
                    <Input
                      id="phone"
                      type="tel"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      placeholder="(555) 123-4567"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="your.email@example.com"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="message">Message</Label>
                  <Textarea
                    id="message"
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    placeholder="Tell us about your needs and which plan interests you..."
                    rows={5}
                    required
                  />
                </div>

                <Button 
                  type="submit" 
                  disabled={isPending} 
                  className="w-full bg-gradient-to-r from-gold to-gold-dark hover:from-gold-dark hover:to-gold text-navy font-bold text-lg py-6 shadow-lg"
                >
                  {isPending ? 'Sending...' : 'Contact Us About Plans'}
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </section>
    </div>
  );
}
