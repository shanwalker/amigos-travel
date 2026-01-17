import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { StatsCard } from '@/components/dashboard/StatsCard';
import { AnalyticsChart } from '@/components/admin/AnalyticsChart';
import { QuickActions } from '@/components/admin/QuickActions';
import { ActivityFeed } from '@/components/admin/ActivityFeed';
import { PerformanceMetrics } from '@/components/admin/PerformanceMetrics';
import { useTrips } from '@/hooks/useTrips';
import { useAllBookings } from '@/hooks/useBookings';
import { useUsers } from '@/hooks/useUsers';
import { useTestimonials } from '@/hooks/useTestimonials';
import { useTravelStories } from '@/hooks/useTravelStories';
import {
  Map,
  Users,
  CalendarCheck,
  Star,
  TrendingUp,
  DollarSign,
  BookOpen,
  MessageSquare
} from 'lucide-react';
import { motion } from 'framer-motion';
import { useMemo } from 'react';

const AdminOverview = () => {
  const { data: trips } = useTrips();
  const { data: bookings } = useAllBookings();
  const { data: users } = useUsers();
  const { data: testimonials } = useTestimonials();
  const { data: stories } = useTravelStories();

  const totalRevenue = bookings?.reduce((sum, b: any) => sum + (b.total_amount || 0), 0) || 0;
  const confirmedBookings = bookings?.filter((b: any) => b.status === 'confirmed').length || 0;
  const pendingBookings = bookings?.filter((b: any) => b.status === 'pending').length || 0;

  // Generate revenue chart data (last 7 days)
  const revenueChartData = useMemo(() => {
    const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
    return days.map((day, index) => ({
      day,
      revenue: Math.floor(Math.random() * 50000) + 20000, // Sample data
      bookings: Math.floor(Math.random() * 10) + 5,
    }));
  }, []);

  // Generate user growth data (last 6 months)
  const userGrowthData = useMemo(() => {
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'];
    return months.map((month, index) => ({
      month,
      users: Math.floor(Math.random() * 50) + (index * 20) + 50,
    }));
  }, []);

  // Generate booking trends data
  const bookingTrendsData = useMemo(() => {
    const weeks = ['Week 1', 'Week 2', 'Week 3', 'Week 4'];
    return weeks.map((week) => ({
      week,
      confirmed: Math.floor(Math.random() * 15) + 10,
      pending: Math.floor(Math.random() * 8) + 3,
      cancelled: Math.floor(Math.random() * 3) + 1,
    }));
  }, []);

  const stats = [
    {
      title: 'Total Trips',
      value: trips?.length || 0,
      icon: <Map className="h-5 w-5" />,
      trend: { value: 12, isPositive: true },
      description: 'Active trips available'
    },
    {
      title: 'Total Users',
      value: users?.length || 0,
      icon: <Users className="h-5 w-5" />,
      trend: { value: 8, isPositive: true },
      description: 'Registered users'
    },
    {
      title: 'Total Bookings',
      value: bookings?.length || 0,
      icon: <CalendarCheck className="h-5 w-5" />,
      trend: { value: 23, isPositive: true },
      description: `${confirmedBookings} confirmed, ${pendingBookings} pending`
    },
    {
      title: 'Revenue',
      value: `₹${totalRevenue.toLocaleString()}`,
      icon: <DollarSign className="h-5 w-5" />,
      trend: { value: 18, isPositive: true },
      description: 'Total earnings'
    },
  ];

  const secondaryStats = [
    { title: 'Testimonials', value: testimonials?.length || 0, icon: MessageSquare },
    { title: 'Travel Stories', value: stories?.length || 0, icon: BookOpen },
    { title: 'Avg Rating', value: '4.8', icon: Star },
    { title: 'Conversion', value: '12.5%', icon: TrendingUp },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-display font-bold text-foreground">Admin Dashboard</h1>
        <p className="text-muted-foreground mt-2">Complete overview of your travel platform</p>
      </div>

      {/* Main Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <motion.div
            key={stat.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: index * 0.1 }}
          >
            <StatsCard
              title={stat.title}
              value={stat.value}
              icon={stat.icon}
              trend={stat.trend}
              description={stat.description}
            />
          </motion.div>
        ))}
      </div>

      {/* Performance Metrics */}
      <PerformanceMetrics />

      {/* Quick Actions */}
      <QuickActions />

      {/* Analytics Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <AnalyticsChart
          title="Revenue Trend (Last 7 Days)"
          data={revenueChartData}
          type="area"
          dataKey="revenue"
          xAxisKey="day"
          color="#FFB400"
        />
        <AnalyticsChart
          title="User Growth (Last 6 Months)"
          data={userGrowthData}
          type="line"
          dataKey="users"
          xAxisKey="month"
          color="#10B981"
        />
      </div>

      {/* Activity Feed and Secondary Stats */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <ActivityFeed />
        </div>
        <div className="space-y-4">
          {secondaryStats.map((stat, index) => (
            <motion.div
              key={stat.title}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3, delay: 0.4 + index * 0.05 }}
            >
              <Card className="bg-card/50 border-border/50">
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground">{stat.title}</p>
                      <p className="text-2xl font-bold text-foreground">{stat.value}</p>
                    </div>
                    <stat.icon className="h-8 w-8 text-primary/60" />
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="bg-card/50 border-border/50">
          <CardHeader>
            <CardTitle className="text-foreground">Recent Bookings</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {bookings?.slice(0, 5).map((booking: any) => (
                <div key={booking.id} className="flex items-center justify-between p-3 rounded-lg bg-background/50">
                  <div>
                    <p className="font-medium text-foreground">{booking.trip?.title || 'Unknown Trip'}</p>
                    <p className="text-sm text-muted-foreground">{booking.profile?.full_name || booking.profile?.email}</p>
                  </div>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${booking.status === 'confirmed' ? 'bg-green-500/20 text-green-400' :
                      booking.status === 'pending' ? 'bg-yellow-500/20 text-yellow-400' :
                        booking.status === 'cancelled' ? 'bg-red-500/20 text-red-400' :
                          'bg-blue-500/20 text-blue-400'
                    }`}>
                    {booking.status}
                  </span>
                </div>
              )) || (
                  <p className="text-muted-foreground text-center py-4">No bookings yet</p>
                )}
            </div>
          </CardContent>
        </Card>

        <Card className="bg-card/50 border-border/50">
          <CardHeader>
            <CardTitle className="text-foreground">Recent Users</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {users?.slice(0, 5).map((user) => (
                <div key={user.id} className="flex items-center justify-between p-3 rounded-lg bg-background/50">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-full bg-primary/20 flex items-center justify-center text-primary font-medium">
                      {user.full_name?.[0] || user.email?.[0]?.toUpperCase() || 'U'}
                    </div>
                    <div>
                      <p className="font-medium text-foreground">{user.full_name || 'No name'}</p>
                      <p className="text-sm text-muted-foreground">{user.email}</p>
                    </div>
                  </div>
                  <div className="flex gap-1">
                    {user.roles?.map((role) => (
                      <span key={role} className={`px-2 py-1 rounded-full text-xs font-medium ${role === 'admin' ? 'bg-purple-500/20 text-purple-400' :
                          role === 'moderator' ? 'bg-blue-500/20 text-blue-400' :
                            'bg-gray-500/20 text-gray-400'
                        }`}>
                        {role}
                      </span>
                    ))}
                  </div>
                </div>
              )) || (
                  <p className="text-muted-foreground text-center py-4">No users yet</p>
                )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AdminOverview;
