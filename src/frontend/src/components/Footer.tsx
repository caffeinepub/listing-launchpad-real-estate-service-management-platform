import { Heart } from 'lucide-react';
import { SiFacebook, SiInstagram, SiLinkedin, SiX } from 'react-icons/si';

export default function Footer() {
  return (
    <footer className="border-t border-border/40 bg-muted/30">
      <div className="container py-8">
        <div className="flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <img src="/assets/generated/dallas-skyline-transparent.dim_400x150.png" alt="Dallas" className="h-8 opacity-60" />
            <span>Serving Dallas & Collin County</span>
          </div>
          
          {/* Social Media Links */}
          <div className="flex gap-4">
            <a 
              href="https://instagram.com" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-navy hover:text-gold transition-colors"
              aria-label="Instagram"
            >
              <SiInstagram className="h-5 w-5" />
            </a>
            <a 
              href="https://facebook.com" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-navy hover:text-gold transition-colors"
              aria-label="Facebook"
            >
              <SiFacebook className="h-5 w-5" />
            </a>
            <a 
              href="https://linkedin.com" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-navy hover:text-gold transition-colors"
              aria-label="LinkedIn"
            >
              <SiLinkedin className="h-5 w-5" />
            </a>
            <a 
              href="https://x.com" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-navy hover:text-gold transition-colors"
              aria-label="X (Twitter)"
            >
              <SiX className="h-5 w-5" />
            </a>
          </div>

          <div className="text-sm text-muted-foreground text-center">
            © 2025. Built with <Heart className="inline h-4 w-4 text-gold fill-gold" /> using{' '}
            <a href="https://caffeine.ai" target="_blank" rel="noopener noreferrer" className="text-navy hover:underline font-medium">
              caffeine.ai
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
