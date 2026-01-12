import { motion } from 'framer-motion';
import { Instagram, Twitter, Youtube, Linkedin, Mail, MapPin, Phone } from 'lucide-react';
import logo from '@/assets/logo.png';

const footerLinks = {
  destinations: [
    { label: 'Vietnam', href: '#' },
    { label: 'Thailand', href: '#' },
    { label: 'Bali', href: '#' },
    { label: 'Japan', href: '#' },
    { label: 'Greece', href: '#' },
  ],
  community: [
    { label: 'Join a Trip', href: '#' },
    { label: 'Host a Trip', href: '#' },
    { label: 'Travel Stories', href: '#' },
    { label: 'Amigo Events', href: '#' },
  ],
  help: [
    { label: 'FAQ', href: '#' },
    { label: 'Contact Us', href: '#' },
    { label: 'Safety', href: '#' },
    { label: 'Cancellation Policy', href: '#' },
  ],
};

const socialLinks = [
  { icon: Instagram, href: '#', label: 'Instagram' },
  { icon: Twitter, href: '#', label: 'Twitter' },
  { icon: Youtube, href: '#', label: 'YouTube' },
  { icon: Linkedin, href: '#', label: 'LinkedIn' },
];

export const Footer = () => {
  return (
    <footer className="bg-navy-deep border-t border-foreground/10">
      <div className="container mx-auto px-6 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-12">
          {/* Brand Column */}
          <div className="lg:col-span-2">
            <img 
              src={logo} 
              alt="Travel Amigo" 
              loading="lazy"
              decoding="async"
              width={122}
              height={48}
              className="h-12 w-auto mb-6"
            />
            <p className="text-muted-foreground font-inter mb-6 max-w-sm">
              Connecting travelers worldwide. Join curated group adventures and make memories that last a lifetime.
            </p>
            
            {/* Contact Info */}
            <div className="space-y-3">
              <div className="flex items-center gap-3 text-muted-foreground font-inter text-sm">
                <Mail className="w-4 h-4 text-primary" />
                <span>hello@travelamigo.com</span>
              </div>
              <div className="flex items-center gap-3 text-muted-foreground font-inter text-sm">
                <Phone className="w-4 h-4 text-primary" />
                <span>+91 98765 43210</span>
              </div>
              <div className="flex items-center gap-3 text-muted-foreground font-inter text-sm">
                <MapPin className="w-4 h-4 text-primary" />
                <span>Mumbai, India</span>
              </div>
            </div>

            {/* Social Links */}
            <div className="flex gap-4 mt-6">
              {socialLinks.map((social) => (
                <motion.a
                  key={social.label}
                  href={social.href}
                  whileHover={{ scale: 1.2, y: -3 }}
                  whileTap={{ scale: 0.95 }}
                  className="w-10 h-10 rounded-full glass-card flex items-center justify-center text-muted-foreground hover:text-primary hover:border-primary/50 transition-colors"
                  aria-label={social.label}
                >
                  <social.icon className="w-5 h-5" />
                </motion.a>
              ))}
            </div>
          </div>

          {/* Destinations */}
          <div>
            <h4 className="font-jakarta font-bold text-foreground mb-4">Destinations</h4>
            <ul className="space-y-3">
              {footerLinks.destinations.map((link) => (
                <li key={link.label}>
                  <a 
                    href={link.href}
                    className="text-muted-foreground font-inter text-sm hover:text-primary transition-colors"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Community */}
          <div>
            <h4 className="font-jakarta font-bold text-foreground mb-4">Community</h4>
            <ul className="space-y-3">
              {footerLinks.community.map((link) => (
                <li key={link.label}>
                  <a 
                    href={link.href}
                    className="text-muted-foreground font-inter text-sm hover:text-primary transition-colors"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Help */}
          <div>
            <h4 className="font-jakarta font-bold text-foreground mb-4">Help</h4>
            <ul className="space-y-3">
              {footerLinks.help.map((link) => (
                <li key={link.label}>
                  <a 
                    href={link.href}
                    className="text-muted-foreground font-inter text-sm hover:text-primary transition-colors"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-foreground/10 mt-12 pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-muted-foreground font-inter text-sm">
            © 2025 Travel Amigo. All rights reserved.
          </p>
          <div className="flex gap-6">
            <a href="#" className="text-muted-foreground font-inter text-sm hover:text-primary transition-colors">
              Privacy Policy
            </a>
            <a href="#" className="text-muted-foreground font-inter text-sm hover:text-primary transition-colors">
              Terms of Service
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};
