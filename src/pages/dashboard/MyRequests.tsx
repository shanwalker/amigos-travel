import { useState } from 'react';
import { useUserCustomRequests } from '@/hooks/useCustomRequests';
import { useUserSurpriseRequests } from '@/hooks/useSurpriseRequests';
import { RequestCard } from '@/components/dashboard/RequestCard';
import { SurpriseTripCard } from '@/components/dashboard/SurpriseTripCard';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Wand2, Sparkles, FileText } from 'lucide-react';
import { motion } from 'framer-motion';

const MyRequests = () => {
  const { data: customRequests = [], isLoading: loadingCustom } = useUserCustomRequests();
  const { data: surpriseRequests = [], isLoading: loadingSurprise } = useUserSurpriseRequests();

  const isLoading = loadingCustom || loadingSurprise;

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  const totalRequests = customRequests.length + surpriseRequests.length;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-display font-bold text-foreground">My Requests</h1>
        <p className="text-muted-foreground mt-2">Track your custom and surprise trip requests</p>
      </div>

      {totalRequests === 0 ? (
        <Card className="bg-card/50 border-border/50">
          <CardContent className="py-12 text-center">
            <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-foreground mb-2">No Requests Yet</h3>
            <p className="text-muted-foreground mb-6">
              Create a custom trip request or try our surprise trip experience!
            </p>
            <div className="flex gap-3 justify-center">
              <Button
                className="bg-orange-500 text-white hover:bg-orange-600"
                onClick={() => window.location.href = '/signup/custom-request'}
              >
                <Wand2 className="h-4 w-4 mr-2" />
                Custom Trip Request
              </Button>
              <Button
                className="bg-gradient-to-r from-purple-500 to-pink-500 text-white hover:from-purple-600 hover:to-pink-600"
                onClick={() => window.location.href = '/signup/surprise'}
              >
                <Sparkles className="h-4 w-4 mr-2" />
                Surprise Trip
              </Button>
            </div>
          </CardContent>
        </Card>
      ) : (
        <Tabs defaultValue="custom" className="w-full">
          <TabsList className="grid w-full grid-cols-2 max-w-md">
            <TabsTrigger value="custom" className="flex items-center gap-2">
              <Wand2 className="h-4 w-4" />
              Custom Requests ({customRequests.length})
            </TabsTrigger>
            <TabsTrigger value="surprise" className="flex items-center gap-2">
              <Sparkles className="h-4 w-4" />
              Surprise Trips ({surpriseRequests.length})
            </TabsTrigger>
          </TabsList>

          <TabsContent value="custom" className="space-y-4 mt-6">
            {customRequests.length === 0 ? (
              <Card className="bg-card/50 border-border/50">
                <CardContent className="py-8 text-center">
                  <Wand2 className="h-10 w-10 text-muted-foreground mx-auto mb-3" />
                  <p className="text-muted-foreground mb-4">No custom trip requests</p>
                  <Button
                    className="bg-orange-500 text-white hover:bg-orange-600"
                    onClick={() => window.location.href = '/signup/custom-request'}
                  >
                    <Wand2 className="h-4 w-4 mr-2" />
                    Create Custom Request
                  </Button>
                </CardContent>
              </Card>
            ) : (
              customRequests.map((request, index) => (
                <motion.div
                  key={request.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                >
                  <RequestCard
                    request={request}
                    onViewDetails={(id) => console.log('View details:', id)}
                  />
                </motion.div>
              ))
            )}
          </TabsContent>

          <TabsContent value="surprise" className="space-y-4 mt-6">
            {surpriseRequests.length === 0 ? (
              <Card className="bg-card/50 border-border/50">
                <CardContent className="py-8 text-center">
                  <Sparkles className="h-10 w-10 text-muted-foreground mx-auto mb-3" />
                  <p className="text-muted-foreground mb-4">No surprise trip requests</p>
                  <Button
                    className="bg-gradient-to-r from-purple-500 to-pink-500 text-white hover:from-purple-600 hover:to-pink-600"
                    onClick={() => window.location.href = '/signup/surprise'}
                  >
                    <Sparkles className="h-4 w-4 mr-2" />
                    Request Surprise Trip
                  </Button>
                </CardContent>
              </Card>
            ) : (
              surpriseRequests.map((request, index) => (
                <motion.div
                  key={request.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                >
                  <SurpriseTripCard
                    request={request}
                    onViewDetails={(id) => console.log('View details:', id)}
                  />
                </motion.div>
              ))
            )}
          </TabsContent>
        </Tabs>
      )}
    </div>
  );
};

export default MyRequests;
