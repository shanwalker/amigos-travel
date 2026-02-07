import { motion } from 'framer-motion';
import { User, Calendar, Plane, Car, Hotel, Plus, ChevronRight, Star, Clock, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { TripProposal } from '@/types/proposals';
import { useTripCustomization } from '@/contexts/TripCustomizationContext';

interface TripCustomizationProps {
    proposal: TripProposal;
    className?: string;
}

export function TripCustomization({ proposal, className = "" }: TripCustomizationProps) {
    const {
        travelers,
        duration,
        transferAdded,
        addTraveler,
        removeTraveler,
        setDuration,
        setTransferAdded
    } = useTripCustomization();

    const departureDate = proposal.departure_date ? new Date(proposal.departure_date) : new Date();
    // Calculate return date based on DYNAMIC duration
    const returnDate = new Date(departureDate);
    returnDate.setDate(departureDate.getDate() + duration);

    const formatDate = (date: Date) => {
        return date.toLocaleDateString('en-GB', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });
    };

    const handleAddTraveler = () => {
        const name = window.prompt("Enter traveler's name:");
        if (name && name.trim()) {
            addTraveler(name.trim());
        }
    };

    return (
        <section className={`py-12 px-4 ${className}`}>
            <div className="max-w-4xl mx-auto bg-white/5 backdrop-blur-sm rounded-2xl border border-white/10 overflow-hidden text-left">
                {/* Header */}
                <div className="p-6 border-b border-white/10 flex items-center justify-between">
                    <h3 className="text-2xl font-bold text-white flex items-center gap-2">
                        <span className="text-primary">Trip</span>Explorer
                    </h3>
                    <div className="text-white/60 text-sm">Customise your journey</div>
                </div>

                {/* Travelers & Duration Grid */}
                <div className="grid md:grid-cols-2">
                    {/* Travelers */}
                    <div className="p-6 border-b md:border-b-0 md:border-r border-white/10 hover:bg-white/5 transition-colors group">
                        <div className="flex justify-between items-start mb-2">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-full bg-blue-500/20 flex items-center justify-center text-blue-400">
                                    <User className="w-5 h-5" />
                                </div>
                                <div>
                                    <div className="text-xs text-white/50 uppercase tracking-wider font-bold">Trip</div>
                                    <div className="text-white font-medium">Travelers</div>
                                </div>
                            </div>
                            <Button
                                variant="ghost"
                                size="sm"
                                className="text-primary hover:text-white hover:bg-primary/20 gap-1 h-8"
                                onClick={handleAddTraveler}
                            >
                                <Plus className="w-3 h-3" /> ADD PEOPLE
                            </Button>
                        </div>
                        <div className="pl-13 mb-2">
                            <div className="text-xl font-bold text-white mb-1">
                                {travelers.length} Person{travelers.length !== 1 ? 's' : ''}
                            </div>
                            <div className="flex flex-wrap gap-2">
                                {travelers.map((t) => (
                                    <div key={t.id} className="flex items-center gap-1 bg-white/10 px-2 py-1 rounded text-xs text-white/80">
                                        <span>{t.name}</span>
                                        {travelers.length > 1 && (
                                            <button
                                                onClick={() => removeTraveler(t.id)}
                                                className="text-white/40 hover:text-red-400 ml-1"
                                            >
                                                ×
                                            </button>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Duration */}
                    <div className="p-6 border-b border-white/10 md:border-b-0 hover:bg-white/5 transition-colors group">
                        <div className="flex justify-between items-start mb-2">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-full bg-purple-500/20 flex items-center justify-center text-purple-400">
                                    <Calendar className="w-5 h-5" />
                                </div>
                                <div>
                                    <div className="text-xs text-white/50 uppercase tracking-wider font-bold">Trip</div>
                                    <div className="text-white font-medium">Duration</div>
                                </div>
                            </div>
                            <div className="flex gap-1">
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    className="text-white/50 hover:text-white h-8 w-8 p-0"
                                    onClick={() => setDuration(prev => Math.max(1, prev - 1))}
                                >
                                    -
                                </Button>
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    className="text-primary hover:text-white hover:bg-primary/20 gap-1 h-8"
                                    onClick={() => setDuration(prev => prev + 1)}
                                >
                                    <Plus className="w-3 h-3" /> ADD NIGHTS
                                </Button>
                            </div>
                        </div>
                        <div className="pl-13 text-xl font-bold text-white">{duration} days</div>
                    </div>
                </div>

                {/* Flights Section */}
                <div className="border-t border-white/10">
                    <div className="p-6 border-b border-white/10 hover:bg-white/5 transition-colors">
                        <div className="flex justify-between items-center mb-6">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-full bg-emerald-500/20 flex items-center justify-center text-emerald-400">
                                    <Plane className="w-5 h-5" />
                                </div>
                                <div>
                                    <div className="text-xs text-white/50 uppercase tracking-wider font-bold">Trip</div>
                                    <div className="text-white font-medium">DATES & FLIGHTS</div>
                                </div>
                            </div>
                            <Button variant="outline" size="sm" className="border-primary/50 text-primary hover:bg-primary hover:text-white gap-2">
                                <Calendar className="w-3 h-3" /> CHANGE DATES/FLIGHTS
                            </Button>
                        </div>

                        <div className="space-y-6 md:pl-13">
                            {/* Departure */}
                            <div className="flex gap-4 items-start relative">
                                <div className="flex flex-col items-center">
                                    <div className="w-3 h-3 rounded-full bg-emerald-500 mt-1.5" />
                                    <div className="w-0.5 h-16 bg-white/10 my-1" />
                                </div>
                                <div className="flex-1">
                                    <div className="text-sm text-white/50 mb-1">Leaves <span className="text-white font-bold ml-2">07:00 AM</span></div>
                                    <div className="text-lg font-bold text-white mb-0.5">{formatDate(departureDate)}</div>
                                    <div className="text-sm text-white/70">{proposal.departure_airport || 'London Heathrow'}</div>
                                    <div className="text-xs text-white/40 mt-1">No stopover • 6-8 hours total duration</div>
                                </div>
                            </div>

                            {/* Return */}
                            <div className="flex gap-4 items-start relative">
                                <div className="flex flex-col items-center">
                                    <div className="w-3 h-3 rounded-full bg-emerald-500 mt-1.5" />
                                </div>
                                <div className="flex-1">
                                    <div className="text-sm text-white/50 mb-1">Returns <span className="text-white font-bold ml-2">07:50 PM</span></div>
                                    <div className="text-lg font-bold text-white mb-0.5">{formatDate(returnDate)}</div>
                                    <div className="text-sm text-white/70">{proposal.return_airport || 'London Heathrow'}</div>
                                    <div className="text-xs text-white/40 mt-1">No stopover • 6-8 hours total duration</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Transfers */}
                <div className="border-t border-white/10 grid md:grid-cols-[1fr_auto]">
                    <div className="p-6 hover:bg-white/5 transition-colors">
                        <div className="flex items-center gap-3 mb-2">
                            <div className="w-10 h-10 rounded-full bg-orange-500/20 flex items-center justify-center text-orange-400">
                                <Car className="w-5 h-5" />
                            </div>
                            <div>
                                <div className="text-xs text-white/50 uppercase tracking-wider font-bold">Trip</div>
                                <div className="text-white font-medium">Airport transfer</div>
                            </div>
                        </div>
                        <div className="pl-13 text-white/70">
                            {transferAdded ? 'Private luxury transfer included' : 'Not added yet'}
                        </div>
                    </div>
                    <div className="p-6 flex items-center justify-end md:border-l border-white/10">
                        <Button
                            variant={transferAdded ? "default" : "ghost"}
                            size="sm"
                            className={transferAdded ? "bg-green-600 hover:bg-green-700" : "text-primary hover:text-white hover:bg-primary/20 gap-1"}
                            onClick={() => setTransferAdded(!transferAdded)}
                        >
                            {transferAdded ? <><div className='mr-1'>✓</div> ADDED</> : <><Plus className="w-3 h-3" /> ADD TRANSFER</>}
                        </Button>
                    </div>
                </div>

                {/* Accommodation */}
                <div className="border-t border-white/10">
                    <div className="p-6 hover:bg-white/5 transition-colors">
                        <div className="flex items-center gap-3 mb-4">
                            <div className="w-10 h-10 rounded-full bg-rose-500/20 flex items-center justify-center text-rose-400">
                                <Hotel className="w-5 h-5" />
                            </div>
                            <div>
                                <div className="text-xs text-white/50 uppercase tracking-wider font-bold">Trip</div>
                                <div className="text-white font-medium">Accommodation</div>
                            </div>
                        </div>

                        <div className="md:pl-13">
                            <h4 className="text-xl font-bold text-white mb-2">Private apartment or hotel</h4>
                            <div className="flex items-center gap-2 mb-4">
                                <div className="flex text-yellow-400">
                                    <Star className="w-4 h-4 fill-current" />
                                    <Star className="w-4 h-4 fill-current" />
                                    <Star className="w-4 h-4 fill-current" />
                                    <Star className="w-4 h-4 fill-current" />
                                    <Star className="w-4 h-4 fill-current" />
                                </div>
                                <span className="text-white/60 text-sm">93% of Journee Explorers loved their stay</span>
                            </div>

                            <ul className="space-y-2 text-white/70 text-sm">
                                <li className="flex items-center gap-2">
                                    <div className="w-1.5 h-1.5 rounded-full bg-primary" />
                                    Always well-located, clean, comfortable and safe
                                </li>
                                <li className="flex items-center gap-2">
                                    <div className="w-1.5 h-1.5 rounded-full bg-primary" />
                                    WiFi, toiletries and towels included
                                </li>
                                <li className="flex items-center gap-2">
                                    <div className="w-1.5 h-1.5 rounded-full bg-primary" />
                                    3* and highly-rated by independent reviews (at least 8 out of 10)
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>

            </div>
        </section>
    );
}
