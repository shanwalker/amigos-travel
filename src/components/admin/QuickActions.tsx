import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import {
    Plus,
    CheckCircle,
    Mail,
    MessageSquare,
    Users,
    FileText,
    Zap
} from 'lucide-react';
import { motion } from 'framer-motion';

export const QuickActions = () => {
    const navigate = useNavigate();

    const actions = [
        {
            icon: Plus,
            label: 'Create Trip',
            description: 'Add new travel package',
            color: 'from-blue-500 to-cyan-500',
            onClick: () => navigate('/admin/trips'),
        },
        {
            icon: CheckCircle,
            label: 'Approve Bookings',
            description: 'Review pending bookings',
            color: 'from-green-500 to-emerald-500',
            onClick: () => navigate('/admin/bookings'),
        },
        {
            icon: MessageSquare,
            label: 'Add Testimonial',
            description: 'Feature customer review',
            color: 'from-purple-500 to-pink-500',
            onClick: () => navigate('/admin/testimonials'),
        },
        {
            icon: FileText,
            label: 'Write Story',
            description: 'Create blog post',
            color: 'from-orange-500 to-red-500',
            onClick: () => navigate('/admin/stories'),
        },
        {
            icon: Users,
            label: 'Manage Users',
            description: 'View all users',
            color: 'from-indigo-500 to-blue-500',
            onClick: () => navigate('/admin/users'),
        },
        {
            icon: Mail,
            label: 'Newsletter',
            description: 'Send campaign',
            color: 'from-yellow-500 to-orange-500',
            onClick: () => navigate('/admin/newsletter'),
        },
    ];

    return (
        <Card className="bg-card/50 border-border/50">
            <CardHeader>
                <div className="flex items-center gap-2">
                    <Zap className="h-5 w-5 text-yellow-500" />
                    <CardTitle className="text-foreground">Quick Actions</CardTitle>
                </div>
            </CardHeader>
            <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                    {actions.map((action, index) => (
                        <motion.div
                            key={action.label}
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ duration: 0.2, delay: index * 0.05 }}
                        >
                            <Button
                                variant="outline"
                                className="w-full h-auto flex flex-col items-start gap-2 p-4 bg-background/50 border-border/50 hover:bg-background/80 hover:border-primary/30 transition-all group"
                                onClick={action.onClick}
                            >
                                <div className={`p-2 rounded-lg bg-gradient-to-br ${action.color} group-hover:scale-110 transition-transform`}>
                                    <action.icon className="h-4 w-4 text-white" />
                                </div>
                                <div className="text-left">
                                    <p className="font-semibold text-sm text-foreground">{action.label}</p>
                                    <p className="text-xs text-muted-foreground">{action.description}</p>
                                </div>
                            </Button>
                        </motion.div>
                    ))}
                </div>
            </CardContent>
        </Card>
    );
};
