import React, { createContext, useContext, useState, useEffect } from 'react';
import { TripProposal } from '@/types/proposals';

export interface Traveler {
    id: string;
    name: string;
}

interface TripCustomizationContextType {
    travelers: Traveler[];
    duration: number;
    transferAdded: boolean;
    totalPrice: number;
    basePrice: number;
    addTraveler: (name: string) => void;
    removeTraveler: (id: string) => void;
    setDuration: React.Dispatch<React.SetStateAction<number>>;
    setTransferAdded: React.Dispatch<React.SetStateAction<boolean>>;
}

const TripCustomizationContext = createContext<TripCustomizationContextType | undefined>(undefined);

export function useTripCustomization() {
    const context = useContext(TripCustomizationContext);
    if (!context) {
        throw new Error('useTripCustomization must be used within a TripCustomizationProvider');
    }
    return context;
}

interface TripCustomizationProviderProps {
    proposal: TripProposal;
    children: React.ReactNode;
}

export function TripCustomizationProvider({ proposal, children }: TripCustomizationProviderProps) {
    const defaultDuration = proposal.duration_days || 7;
    // Assuming proposal total_price is the base price for 1 person for the default duration
    const basePrice = proposal.total_price;
    const transferCost = 5000; // Fixed cost for transfer (flat fee per group)

    // Calculate daily rate relative to base price for duration changes
    const dailyRate = basePrice / defaultDuration;

    // Initialize with one traveler (the user)
    const [travelers, setTravelers] = useState<Traveler[]>([{ id: '1', name: 'Lead Traveler' }]);
    const [duration, setDuration] = useState(defaultDuration);
    const [transferAdded, setTransferAdded] = useState(proposal.airport_transfer_included || false);
    const [totalPrice, setTotalPrice] = useState(basePrice);

    const addTraveler = (name: string) => {
        const newTraveler = {
            id: Date.now().toString(),
            name: name
        };
        setTravelers(prev => [...prev, newTraveler]);
    };

    const removeTraveler = (id: string) => {
        if (travelers.length <= 1) return; // Prevent removing the last traveler
        setTravelers(prev => prev.filter(t => t.id !== id));
    };

    useEffect(() => {
        // Pricing Logic:
        // Base Price is for 1 person, default duration.
        // New Price = (BasePrice + (duration - defaultDuration) * dailyRate) * travelers_count
        // + Transfer Cost (if added)

        const durationDetailCost = (duration - defaultDuration) * dailyRate;
        const perPersonCost = basePrice + durationDetailCost;
        let calculated = perPersonCost * travelers.length;

        if (transferAdded) {
            calculated += transferCost;
        }

        setTotalPrice(Math.round(calculated));
    }, [travelers, duration, transferAdded, basePrice, dailyRate]);

    return (
        <TripCustomizationContext.Provider value={{
            travelers,
            duration,
            transferAdded,
            totalPrice,
            basePrice,
            addTraveler,
            removeTraveler,
            setDuration,
            setTransferAdded
        }}>
            {children}
        </TripCustomizationContext.Provider>
    );
}
