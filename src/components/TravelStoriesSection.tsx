import { motion } from 'framer-motion';
import { Clock, ArrowRight, Quote } from 'lucide-react';
import reel1 from '@/assets/reel-1.jpg';
import reel2 from '@/assets/reel-2.jpg';
import reel3 from '@/assets/reel-3.jpg';

interface Story {
  id: number;
  title: string;
  excerpt: string;
  category: string;
  author: {
    name: string;
    initials: string;
    location: string;
  };
  image: string;
  readTime: number;
  date: string;
  featured?: boolean;
}

const stories: Story[] = [
  {
    id: 1,
    title: 'How I Found My Tribe on a Solo Trip to Bali',
    excerpt: 'I was nervous about traveling alone for the first time. Little did I know, I would meet 12 strangers who would become my closest friends...',
    category: 'First Solo Trip',
    author: { name: 'Ananya S.', initials: 'AS', location: 'Mumbai' },
    image: reel1,
    readTime: 8,
    date: 'Dec 2024',
    featured: true,
  },
  {
    id: 2,
    title: 'The Hidden Temple We Discovered at Sunrise',
    excerpt: 'Our local guide took us off the beaten path to a temple that tourists never see. The golden light made everything magical...',
    category: 'Hidden Gems',
    author: { name: 'Rohan K.', initials: 'RK', location: 'Bangalore' },
    image: reel2,
    readTime: 5,
    date: 'Nov 2024',
  },
  {
    id: 3,
    title: 'Street Food Safari: A Love Letter to Bangkok',
    excerpt: 'From Pad Thai at 2am to the best mango sticky rice, here\'s every dish I couldn\'t stop eating in Thailand...',
    category: 'Local Secrets',
    author: { name: 'Priya M.', initials: 'PM', location: 'Delhi' },
    image: reel3,
    readTime: 6,
    date: 'Oct 2024',
  },
];

const StoryCard = ({ story, index }: { story: Story; index: number }) => {
  const isFeatured = story.featured;

  return (
    <motion.article
      className={`group relative overflow-hidden rounded-2xl ${
        isFeatured ? 'md:col-span-2 md:row-span-2' : ''
      }`}
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.15 }}
      whileHover={{ y: -5 }}
    >
      {/* Image with Parallax */}
      <div className={`relative overflow-hidden ${isFeatured ? 'h-[400px] md:h-full' : 'h-48'}`}>
        <motion.img
          src={story.image}
          alt={story.title}
          className="w-full h-full object-cover"
          whileHover={{ scale: 1.1 }}
          transition={{ duration: 0.6 }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-navy via-navy/50 to-transparent" />
        
        {/* Category Badge */}
        <div className="absolute top-4 left-4">
          <span className="px-3 py-1 bg-amigo-orange/90 text-navy text-xs font-bold rounded-full">
            {story.category}
          </span>
        </div>
      </div>

      {/* Content Overlay */}
      <div className="absolute bottom-0 left-0 right-0 p-6">
        {isFeatured && (
          <motion.div
            className="mb-4 opacity-0 group-hover:opacity-100 transition-opacity"
            initial={{ y: 20 }}
            whileHover={{ y: 0 }}
          >
            <Quote className="w-8 h-8 text-amigo-orange/50" />
          </motion.div>
        )}
        
        <h3 className={`font-serif text-foreground mb-2 group-hover:text-amigo-orange transition-colors ${
          isFeatured ? 'text-2xl md:text-3xl' : 'text-lg'
        }`}>
          {story.title}
        </h3>
        
        {isFeatured && (
          <p className="text-muted-foreground text-sm mb-4 line-clamp-2">
            {story.excerpt}
          </p>
        )}

        <div className="flex items-center justify-between">
          {/* Author */}
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-amigo-orange to-amber-600 flex items-center justify-center text-navy text-xs font-bold">
              {story.author.initials}
            </div>
            <div>
              <p className="text-foreground text-sm font-medium">{story.author.name}</p>
              <p className="text-muted-foreground text-xs">{story.author.location}</p>
            </div>
          </div>

          {/* Meta */}
          <div className="flex items-center gap-3 text-muted-foreground text-xs">
            <span className="flex items-center gap-1">
              <Clock className="w-3 h-3" /> {story.readTime} min
            </span>
            <span>{story.date}</span>
          </div>
        </div>

        {/* Read More - Revealed on Hover */}
        <motion.div
          className="mt-4 overflow-hidden"
          initial={{ height: 0, opacity: 0 }}
          whileHover={{ height: 'auto', opacity: 1 }}
        >
          <button className="flex items-center gap-2 text-amigo-orange font-medium text-sm group/btn">
            Read Story
            <motion.span
              initial={{ x: 0 }}
              whileHover={{ x: 5 }}
            >
              <ArrowRight className="w-4 h-4" />
            </motion.span>
          </button>
        </motion.div>
      </div>
    </motion.article>
  );
};

export const TravelStoriesSection = () => {
  return (
    <section className="py-20 md:py-32 bg-background relative overflow-hidden">
      {/* Background Gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-navy/30 via-transparent to-navy/30" />

      <div className="container mx-auto px-4 relative z-10">
        <motion.div
          className="flex flex-col md:flex-row md:items-end md:justify-between mb-12"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <div>
            <span className="text-amigo-orange font-medium text-sm tracking-wider uppercase mb-4 block">
              From Our Travelers
            </span>
            <h2 className="font-serif text-4xl md:text-5xl lg:text-6xl text-foreground">
              Travel <span className="text-amigo-orange">Stories</span>
            </h2>
          </div>
          <motion.button
            className="mt-6 md:mt-0 flex items-center gap-2 text-foreground hover:text-amigo-orange transition-colors font-medium"
            whileHover={{ x: 5 }}
          >
            View All Stories <ArrowRight className="w-5 h-5" />
          </motion.button>
        </motion.div>

        {/* Stories Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:grid-rows-2">
          {stories.map((story, index) => (
            <StoryCard key={story.id} story={story} index={index} />
          ))}
        </div>

        {/* Newsletter CTA */}
        <motion.div
          className="mt-16 glass-card p-8 md:p-12 rounded-2xl text-center"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <h3 className="font-serif text-2xl md:text-3xl text-foreground mb-3">
            Get Stories in Your Inbox
          </h3>
          <p className="text-muted-foreground mb-6 max-w-md mx-auto">
            Weekly travel inspiration, tips, and exclusive stories from our community.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
            <input
              type="email"
              placeholder="Enter your email"
              className="flex-1 px-4 py-3 rounded-full bg-navy/50 border border-muted-foreground/30 text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-amigo-orange transition-colors"
            />
            <motion.button
              className="px-6 py-3 bg-amigo-orange text-navy font-semibold rounded-full"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Subscribe
            </motion.button>
          </div>
        </motion.div>
      </div>
    </section>
  );
};
