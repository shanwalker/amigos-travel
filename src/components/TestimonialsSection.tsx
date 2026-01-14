import { useRef, useEffect, useState } from 'react';
import { motion, useInView } from 'framer-motion';
import { Star } from 'lucide-react';

interface Testimonial {
  id: number;
  quote: string;
  highlightWord: string;
  name: string;
  location: string;
  avatar: string;
  rating: number;
}

const testimonials: Testimonial[] = [
  {
    id: 1,
    quote: "This was the most life-changing experience. I made friends who are now family.",
    highlightWord: "life-changing",
    name: "Sai Kiran Reddy",
    location: "Hyderabad, India",
    avatar: "SK",
    rating: 5,
  },
  {
    id: 2,
    quote: "I felt completely safe traveling solo for the first time. The group was amazing!",
    highlightWord: "safe",
    name: "Anusha Sharma",
    location: "Mumbai, India",
    avatar: "AS",
    rating: 5,
  },
  {
    id: 3,
    quote: "The best group travel experience ever. Every detail was perfectly planned.",
    highlightWord: "best group",
    name: "Aryan Mehta",
    location: "Delhi, India",
    avatar: "AM",
    rating: 5,
  },
];

const HighlightText = ({ text, highlightWord }: { text: string; highlightWord: string }) => {
  const ref = useRef<HTMLSpanElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-10%" });
  
  const parts = text.split(new RegExp(`(${highlightWord})`, 'gi'));

  return (
    <span ref={ref}>
      {parts.map((part, index) => {
        if (part.toLowerCase() === highlightWord.toLowerCase()) {
          return (
            <span 
              key={index} 
              className={`highlight-text ${isInView ? 'active' : ''}`}
            >
              {part}
            </span>
          );
        }
        return <span key={index}>{part}</span>;
      })}
    </span>
  );
};

export const TestimonialsSection = () => {
  return (
    <section className="relative py-16 md:py-20 bg-foreground overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-0 left-0 w-full h-full" 
          style={{
            backgroundImage: `radial-gradient(circle at 2px 2px, hsl(var(--navy-deep)) 1px, transparent 0)`,
            backgroundSize: '40px 40px',
          }}
        />
      </div>

      <div className="container mx-auto px-6">
        {/* Section Header */}
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center max-w-3xl mx-auto mb-12"
        >
          <span className="inline-block px-4 py-2 rounded-full bg-navy-deep/10 text-sm font-inter font-medium text-navy-deep mb-6">
            💬 What Amigos Say
          </span>
          <h2 className="font-jakarta text-4xl md:text-6xl font-extrabold text-navy-deep mb-6">
            Stories That <span className="text-primary">Inspire</span>
          </h2>
          <p className="text-lg text-navy-deep/60 font-inter">
            Don't just take our word for it. Hear from travelers who found their tribe.
          </p>
        </motion.div>

        {/* Testimonials Grid */}
        <div className="grid md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={testimonial.id}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.15 }}
              viewport={{ once: true }}
              className="bg-foreground rounded-2xl p-8 shadow-xl border border-navy-deep/10 hover:shadow-2xl transition-shadow duration-300"
            >
              {/* Stars */}
              <div className="flex gap-1 mb-6">
                {Array.from({ length: testimonial.rating }).map((_, i) => (
                  <Star key={i} className="w-5 h-5 fill-primary text-primary" />
                ))}
              </div>

              {/* Quote */}
              <blockquote className="text-xl md:text-2xl font-jakarta font-bold text-navy-deep leading-relaxed mb-8">
                "<HighlightText text={testimonial.quote} highlightWord={testimonial.highlightWord} />"
              </blockquote>

              {/* Author */}
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-full bg-gradient-to-br from-primary to-amigo-glow flex items-center justify-center text-primary-foreground font-bold text-lg">
                  {testimonial.avatar}
                </div>
                <div>
                  <div className="font-jakarta font-bold text-navy-deep">{testimonial.name}</div>
                  <div className="text-sm text-navy-deep/60 font-inter">{testimonial.location}</div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Stats Bar */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          viewport={{ once: true }}
          className="mt-12 grid grid-cols-2 md:grid-cols-4 gap-8 p-8 rounded-2xl bg-navy-deep"
        >
          {[
            { value: '4.9/5', label: 'Average Rating' },
            { value: '10K+', label: 'Happy Travelers' },
            { value: '98%', label: 'Would Recommend' },
            { value: '50+', label: 'Countries Explored' },
          ].map((stat, index) => (
            <div key={stat.label} className="text-center">
              <div className="text-3xl md:text-4xl font-jakarta font-extrabold text-primary">{stat.value}</div>
              <div className="text-sm text-foreground/70 font-inter mt-1">{stat.label}</div>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};
