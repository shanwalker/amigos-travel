import { motion } from 'framer-motion';
import { ArrowRight, Calendar, User, Clock } from 'lucide-react';
import { cn } from '@/lib/utils';

interface BlogPost {
    id: number;
    title: string;
    excerpt: string;
    image: string;
    category: string;
    date: string;
    author: string;
    readTime: string;
}

const blogPosts: BlogPost[] = [
    {
        id: 1,
        title: "10 Hidden Gems in Thailand You Won't Find in Guidebooks",
        excerpt: "Discover the secret beaches, local eateries, and cultural spots that only the locals know about.",
        image: "https://images.unsplash.com/photo-1552465011-b4e21bf6e79a?auto=format&fit=crop&q=80&w=800",
        category: "Travel Tips",
        date: "Jan 15, 2026",
        author: "Sarah J.",
        readTime: "5 min read"
    },
    {
        id: 2,
        title: "Why Group Travel is the Best Way to Make Lifelong Friends",
        excerpt: "Solo travel is great, but traveling with a curated group of like-minded Amigos changes everything.",
        image: "https://images.unsplash.com/photo-1539635278303-d4002c07eae3?auto=format&fit=crop&q=80&w=800",
        category: "Community",
        date: "Jan 22, 2026",
        author: "Mike T.",
        readTime: "4 min read"
    },
    {
        id: 3,
        title: "Packing Light: The Ultimate Guide for Adventure Travelers",
        excerpt: "Learn the art of packing everything you need into a single carry-on without sacrificing style.",
        image: "https://images.unsplash.com/photo-1503220317375-aaad6143d41b?auto=format&fit=crop&q=80&w=800",
        category: "Guides",
        date: "Feb 01, 2026",
        author: "Elena R.",
        readTime: "6 min read"
    }
];

export const BlogSection = () => {
    return (
        <section className="py-10 md:py-16 bg-background relative overflow-hidden">
            {/* Background Elements */}
            <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none" />

            <div className="container mx-auto px-6 relative z-10">
                <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-6">
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6 }}
                    >
                        <span className="text-primary font-sans font-semibold tracking-wider uppercase text-sm mb-2 block">
                            Travel Stories & Tips
                        </span>
                        <h2 className="font-serif text-4xl md:text-5xl font-bold text-foreground">
                            The Amigo Blog
                        </h2>
                    </motion.div>

                    <motion.button
                        initial={{ opacity: 0, x: 20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6, delay: 0.2 }}
                        className="group flex items-center gap-2 text-foreground font-semibold hover:text-primary transition-colors"
                    >
                        View All Articles
                        <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                    </motion.button>
                </div>

                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {blogPosts.map((post, index) => (
                        <motion.article
                            key={post.id}
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.5, delay: index * 0.1 }}
                            className="group flex flex-col h-full bg-card rounded-2xl overflow-hidden border border-border/50 hover:border-primary/50 hover:shadow-lg transition-all duration-300"
                        >
                            {/* Image Container */}
                            <div className="relative h-56 overflow-hidden">
                                <img
                                    src={post.image}
                                    alt={post.title}
                                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                                />
                                <div className="absolute top-4 left-4 px-3 py-1 bg-background/90 backdrop-blur-md rounded-full text-xs font-semibold text-primary border border-primary/20">
                                    {post.category}
                                </div>
                            </div>

                            {/* Content */}
                            <div className="flex-1 p-6 flex flex-col">
                                <div className="flex items-center gap-4 text-xs text-muted-foreground mb-3">
                                    <div className="flex items-center gap-1">
                                        <Calendar className="w-3.5 h-3.5" />
                                        <span>{post.date}</span>
                                    </div>
                                    <div className="flex items-center gap-1">
                                        <Clock className="w-3.5 h-3.5" />
                                        <span>{post.readTime}</span>
                                    </div>
                                </div>

                                <h3 className="font-serif text-xl font-bold text-foreground mb-3 leading-tight group-hover:text-primary transition-colors">
                                    {post.title}
                                </h3>

                                <p className="text-muted-foreground text-sm line-clamp-3 mb-6 flex-1">
                                    {post.excerpt}
                                </p>

                                <div className="flex items-center justify-between pt-4 border-t border-border/50">
                                    <div className="flex items-center gap-2 text-sm font-medium text-foreground">
                                        <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                                            <User className="w-4 h-4" />
                                        </div>
                                        {post.author}
                                    </div>
                                    <span className="text-sm font-semibold text-primary group-hover:underline underline-offset-4">
                                        Read Post
                                    </span>
                                </div>
                            </div>
                        </motion.article>
                    ))}
                </div>
            </div>
        </section>
    );
};
