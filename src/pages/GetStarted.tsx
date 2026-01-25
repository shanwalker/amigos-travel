import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Sparkles, Users, Package, Wand2 } from 'lucide-react';
import type { TripType } from '@/lib/signupSession';

const GetStarted = () => {
    const navigate = useNavigate();

    const tripTypes: Array<{
        type: TripType;
        title: string;
        description: string;
        icon: React.ReactNode;
        gradient: string;
    }> = [
            {
                type: 'surprise',
                title: 'Surprise Trips',
                description: 'Budget-based mystery adventures tailored to your preferences',
                icon: <Sparkles className="h-8 w-8" />,
                gradient: 'from-purple-500 to-pink-500',
            },
            {
                type: 'group',
                title: 'Group Trips',
                description: 'Fixed dates with reservation system for group adventures',
                icon: <Users className="h-8 w-8" />,
                gradient: 'from-blue-500 to-cyan-500',
            },
            {
                type: 'standard',
                title: 'Standard Packages',
                description: 'Pre-planned itineraries with proven experiences',
                icon: <Package className="h-8 w-8" />,
                gradient: 'from-green-500 to-emerald-500',
            },
            {
                type: 'custom',
                title: 'Custom Trips',
                description: 'Fully personalized travel planning just for you',
                icon: <Wand2 className="h-8 w-8" />,
                gradient: 'from-orange-500 to-red-500',
            },
        ];

    const handleSelectTripType = (tripType: TripType) => {
        navigate(`/signup/${tripType}`);
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-navy-deep via-navy-medium to-navy-deep">
            <div className="container mx-auto px-4 py-16">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                    className="text-center mb-12"
                >
                    <h1 className="text-4xl md:text-5xl font-display font-bold text-white mb-4">
                        Choose Your Adventure
                    </h1>
                    <p className="text-xl text-gray-300 max-w-2xl mx-auto">
                        Select the type of trip that best matches your travel style
                    </p>
                </motion.div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-5xl mx-auto">
                    {tripTypes.map((trip, index) => (
                        <motion.div
                            key={trip.type}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, delay: index * 0.1 }}
                        >
                            <Card
                                className="border-border/50 bg-card/80 backdrop-blur-xl shadow-2xl hover:shadow-3xl transition-all duration-300 cursor-pointer group h-full"
                                onClick={() => handleSelectTripType(trip.type)}
                            >
                                <CardHeader>
                                    <div
                                        className={`w-16 h-16 rounded-full bg-gradient-to-br ${trip.gradient} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300`}
                                    >
                                        <div className="text-white">{trip.icon}</div>
                                    </div>
                                    <CardTitle className="text-2xl font-display text-foreground group-hover:text-primary transition-colors">
                                        {trip.title}
                                    </CardTitle>
                                    <CardDescription className="text-muted-foreground text-base">
                                        {trip.description}
                                    </CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <Button
                                        className={`w-full bg-gradient-to-r ${trip.gradient} text-white hover:opacity-90 transition-opacity`}
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            handleSelectTripType(trip.type);
                                        }}
                                    >
                                        Get Started
                                    </Button>
                                </CardContent>
                            </Card>
                        </motion.div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default GetStarted;
