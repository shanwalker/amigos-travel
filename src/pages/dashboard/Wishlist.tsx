import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Heart, Plane } from 'lucide-react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

const Wishlist = () => {
  // Placeholder - would need a wishlist table in the database
  const wishlistItems: any[] = [];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-display font-bold text-foreground">Wishlist</h1>
        <p className="text-muted-foreground mt-2">Trips you've saved for later</p>
      </div>

      {wishlistItems.length === 0 ? (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Card className="bg-card/50 border-border/50">
            <CardContent className="py-12 text-center">
              <Heart className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-foreground mb-2">Your Wishlist is Empty</h3>
              <p className="text-muted-foreground mb-4">
                Save trips you love to plan your future adventures!
              </p>
              <Link to="/dashboard/trips">
                <Button className="bg-primary text-primary-foreground">
                  <Plane className="mr-2 h-4 w-4" />
                  Browse Trips
                </Button>
              </Link>
            </CardContent>
          </Card>
        </motion.div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {/* Would render wishlist items here */}
        </div>
      )}
    </div>
  );
};

export default Wishlist;
