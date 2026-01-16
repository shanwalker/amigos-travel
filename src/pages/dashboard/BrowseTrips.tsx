import { useTrips } from '@/hooks/useTrips';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { MapPin, Calendar, Users, Star, Search, Filter } from 'lucide-react';
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

const BrowseTrips = () => {
  const { data: trips = [], isLoading } = useTrips();
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('date');
  const [filterCountry, setFilterCountry] = useState('all');

  const countries = [...new Set(trips.map(t => t.country))];

  const filteredTrips = trips
    .filter(trip => {
      const matchesSearch = trip.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        trip.destination.toLowerCase().includes(searchQuery.toLowerCase()) ||
        trip.country.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCountry = filterCountry === 'all' || trip.country === filterCountry;
      return matchesSearch && matchesCountry;
    })
    .sort((a, b) => {
      if (sortBy === 'price') return (a.price || 0) - (b.price || 0);
      if (sortBy === 'duration') return a.duration_days - b.duration_days;
      return new Date(a.start_date || '').getTime() - new Date(b.start_date || '').getTime();
    });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-display font-bold text-foreground">Browse Trips</h1>
        <p className="text-muted-foreground mt-2">Discover your next adventure</p>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search trips..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 bg-background/50 border-border"
          />
        </div>
        <Select value={filterCountry} onValueChange={setFilterCountry}>
          <SelectTrigger className="w-full sm:w-[180px] bg-background/50 border-border">
            <Filter className="h-4 w-4 mr-2" />
            <SelectValue placeholder="Country" />
          </SelectTrigger>
          <SelectContent className="bg-card border-border">
            <SelectItem value="all">All Countries</SelectItem>
            {countries.map(country => (
              <SelectItem key={country} value={country}>{country}</SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select value={sortBy} onValueChange={setSortBy}>
          <SelectTrigger className="w-full sm:w-[180px] bg-background/50 border-border">
            <SelectValue placeholder="Sort by" />
          </SelectTrigger>
          <SelectContent className="bg-card border-border">
            <SelectItem value="date">Date</SelectItem>
            <SelectItem value="price">Price</SelectItem>
            <SelectItem value="duration">Duration</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Trip Grid */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {filteredTrips.map((trip, index) => (
          <motion.div
            key={trip.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
          >
            <Card className="bg-card/50 border-border/50 overflow-hidden group hover:border-primary/50 transition-all duration-300">
              <div 
                className="h-48 bg-cover bg-center relative"
                style={{ backgroundImage: `url(${trip.image_url || '/placeholder.svg'})` }}
              >
                <div className="absolute inset-0 bg-gradient-to-t from-card to-transparent" />
                <div className="absolute bottom-4 left-4 right-4">
                  <Badge className="bg-primary/90 text-primary-foreground">
                    {trip.spots_left} spots left
                  </Badge>
                </div>
              </div>
              <CardContent className="p-4 space-y-4">
                <div>
                  <h3 className="text-lg font-semibold text-foreground group-hover:text-primary transition-colors">
                    {trip.title}
                  </h3>
                  <p className="text-sm text-muted-foreground flex items-center gap-1 mt-1">
                    <MapPin className="h-3 w-3" />
                    {trip.destination}, {trip.country}
                  </p>
                </div>
                
                <div className="flex items-center justify-between text-sm text-muted-foreground">
                  <span className="flex items-center gap-1">
                    <Calendar className="h-3 w-3" />
                    {trip.duration_days} days
                  </span>
                  <span className="flex items-center gap-1">
                    <Users className="h-3 w-3" />
                    {trip.total_spots} travelers
                  </span>
                  {trip.rating && (
                    <span className="flex items-center gap-1">
                      <Star className="h-3 w-3 text-primary fill-primary" />
                      {trip.rating}
                    </span>
                  )}
                </div>

                <div className="flex items-center justify-between pt-4 border-t border-border/50">
                  <div>
                    <p className="text-2xl font-bold text-primary">₹{trip.price?.toLocaleString()}</p>
                    <p className="text-xs text-muted-foreground">per person</p>
                  </div>
                  <Link to={`/dashboard/trips/${trip.id}`}>
                    <Button className="bg-primary text-primary-foreground hover:bg-primary/90">
                      View Details
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {filteredTrips.length === 0 && (
        <div className="text-center py-12">
          <MapPin className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <p className="text-muted-foreground">No trips found matching your criteria</p>
        </div>
      )}
    </div>
  );
};

export default BrowseTrips;
