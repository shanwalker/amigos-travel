import { lazy, Suspense } from 'react';
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";
import { PageLoader } from "@/components/PageLoader";

// Critical - load immediately
import Index from "./pages/Index";

// Lazy load all other pages for code splitting
const Thailand = lazy(() => import("./pages/destinations/Thailand"));
const SurpriseTrip = lazy(() => import("./pages/SurpriseTrip"));
const CustomTrip = lazy(() => import("./pages/CustomTrip"));
const BecomeABuddy = lazy(() => import("./pages/BecomeABuddy"));
const Onboarding = lazy(() => import("./pages/Onboarding"));
const NotFound = lazy(() => import("./pages/NotFound"));

// Trip Signup Flow - lazy loaded
const GetStarted = lazy(() => import("./pages/GetStarted"));
const TripSignup = lazy(() => import("./pages/TripSignup"));

// Travel Profile Quiz - lazy loaded (COMPLETE VERSION with all 10 steps)
const TravelProfileQuiz = lazy(() => import("./pages/TravelProfileQuizRedesign"));
const MatchedTripResult = lazy(() => import("./pages/quiz/MatchedTripResult"));
const SurpriseTripResult = lazy(() => import("./pages/quiz/SurpriseTripResult"));
const CustomTripResult = lazy(() => import("./pages/quiz/CustomTripResult"));

// Auth Pages - lazy loaded
const Login = lazy(() => import("./pages/auth/Login"));
const Signup = lazy(() => import("./pages/auth/Signup"));
const ForgotPassword = lazy(() => import("./pages/auth/ForgotPassword"));
const AdminLogin = lazy(() => import("./pages/auth/AdminLogin"));

// User Dashboard - lazy loaded
const DashboardLayout = lazy(() => import("./components/dashboard/DashboardLayout").then(m => ({ default: m.DashboardLayout })));
const DashboardHome = lazy(() => import("./pages/dashboard/DashboardHome"));
const BrowseTrips = lazy(() => import("./pages/dashboard/BrowseTrips"));
const TripDetails = lazy(() => import("./pages/dashboard/TripDetails"));
const MyBookings = lazy(() => import("./pages/dashboard/MyBookings"));
const MyRequests = lazy(() => import("./pages/dashboard/MyRequests"));
const Profile = lazy(() => import("./pages/dashboard/Profile"));
const Wishlist = lazy(() => import("./pages/dashboard/Wishlist"));
const SurpriseTripSuggestions = lazy(() => import("./pages/dashboard/SurpriseTripSuggestions"));

// Admin Dashboard - lazy loaded
const AdminLayout = lazy(() => import("./components/admin/AdminLayout").then(m => ({ default: m.AdminLayout })));
const AdminOverview = lazy(() => import("./pages/admin/AdminOverview"));
const TripManagement = lazy(() => import("./pages/admin/TripManagement"));
const BookingsManagement = lazy(() => import("./pages/admin/BookingsManagement"));
const UserManagement = lazy(() => import("./pages/admin/UserManagement"));
const TestimonialsManagement = lazy(() => import("./pages/admin/TestimonialsManagement"));
const StoriesManagement = lazy(() => import("./pages/admin/StoriesManagement"));
const NewsletterManagement = lazy(() => import("./pages/admin/NewsletterManagement"));
const AllRequestsManagement = lazy(() => import("./pages/admin/AllRequestsManagement"));
const SurpriseRequestsManagement = lazy(() => import("./pages/admin/SurpriseRequestsManagement"));
const CustomRequestsManagement = lazy(() => import("./pages/admin/CustomRequestsManagement"));
const ReservationsManagement = lazy(() => import("./pages/admin/ReservationsManagement"));
const LocalBuddiesManagement = lazy(() => import("./pages/admin/LocalBuddiesManagement"));
const SettingsManagement = lazy(() => import("./pages/admin/SettingsManagement"));

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutes
      gcTime: 1000 * 60 * 30, // 30 minutes (formerly cacheTime)
      refetchOnWindowFocus: false,
      retry: 1,
    },
  },
});

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Suspense fallback={<PageLoader />}>
            <Routes>
              {/* Public Routes */}
              <Route path="/" element={<Index />} />
              <Route path="/destinations/thailand" element={<Thailand />} />
              <Route path="/surprise-trip" element={<SurpriseTrip />} />
              <Route path="/custom-trip" element={<CustomTrip />} />
              <Route path="/become-a-buddy" element={<BecomeABuddy />} />
              <Route path="/onboarding" element={<Onboarding />} />

              {/* Trip Signup Flow */}
              <Route path="/get-started" element={<GetStarted />} />
              <Route path="/signup/:tripType" element={<TripSignup />} />

              {/* Travel Profile Quiz */}
              <Route path="/quiz" element={<TravelProfileQuiz />} />
              <Route path="/quiz/result/matched" element={<MatchedTripResult />} />
              <Route path="/quiz/result/surprise" element={<SurpriseTripResult />} />
              <Route path="/quiz/result/custom" element={<CustomTripResult />} />

              {/* Auth Routes */}
              <Route path="/login" element={<Login />} />
              <Route path="/signup" element={<Signup />} />
              <Route path="/forgot-password" element={<ForgotPassword />} />
              <Route path="/admin/login" element={<AdminLogin />} />

              {/* User Dashboard Routes */}
              <Route path="/dashboard" element={
                <ProtectedRoute>
                  <DashboardLayout>
                    <DashboardHome />
                  </DashboardLayout>
                </ProtectedRoute>
              } />
              <Route path="/dashboard/trips" element={
                <ProtectedRoute>
                  <DashboardLayout>
                    <BrowseTrips />
                  </DashboardLayout>
                </ProtectedRoute>
              } />
              <Route path="/dashboard/trips/:id" element={
                <ProtectedRoute>
                  <DashboardLayout>
                    <TripDetails />
                  </DashboardLayout>
                </ProtectedRoute>
              } />
              <Route path="/dashboard/bookings" element={
                <ProtectedRoute>
                  <DashboardLayout>
                    <MyBookings />
                  </DashboardLayout>
                </ProtectedRoute>
              } />
              <Route path="/dashboard/profile" element={
                <ProtectedRoute>
                  <DashboardLayout>
                    <Profile />
                  </DashboardLayout>
                </ProtectedRoute>
              } />
              <Route path="/dashboard/wishlist" element={
                <ProtectedRoute>
                  <DashboardLayout>
                    <Wishlist />
                  </DashboardLayout>
                </ProtectedRoute>
              } />
              <Route path="/dashboard/requests" element={
                <ProtectedRoute>
                  <DashboardLayout>
                    <MyRequests />
                  </DashboardLayout>
                </ProtectedRoute>
              } />
              <Route path="/dashboard/surprise-suggestions" element={
                <ProtectedRoute>
                  <DashboardLayout>
                    <SurpriseTripSuggestions />
                  </DashboardLayout>
                </ProtectedRoute>
              } />

              {/* Admin Routes */}
              <Route path="/admin" element={
                <ProtectedRoute requiredRole="admin">
                  <AdminLayout>
                    <AdminOverview />
                  </AdminLayout>
                </ProtectedRoute>
              } />
              <Route path="/admin/trips" element={
                <ProtectedRoute requiredRole="admin">
                  <AdminLayout>
                    <TripManagement />
                  </AdminLayout>
                </ProtectedRoute>
              } />
              <Route path="/admin/bookings" element={
                <ProtectedRoute requiredRole="admin">
                  <AdminLayout>
                    <BookingsManagement />
                  </AdminLayout>
                </ProtectedRoute>
              } />
              <Route path="/admin/users" element={
                <ProtectedRoute requiredRole="admin">
                  <AdminLayout>
                    <UserManagement />
                  </AdminLayout>
                </ProtectedRoute>
              } />
              <Route path="/admin/testimonials" element={
                <ProtectedRoute requiredRole="admin">
                  <AdminLayout>
                    <TestimonialsManagement />
                  </AdminLayout>
                </ProtectedRoute>
              } />
              <Route path="/admin/stories" element={
                <ProtectedRoute requiredRole="admin">
                  <AdminLayout>
                    <StoriesManagement />
                  </AdminLayout>
                </ProtectedRoute>
              } />
              <Route path="/admin/newsletter" element={
                <ProtectedRoute requiredRole="admin">
                  <AdminLayout>
                    <NewsletterManagement />
                  </AdminLayout>
                </ProtectedRoute>
              } />
              <Route path="/admin/all-requests" element={
                <ProtectedRoute requiredRole="admin">
                  <AdminLayout>
                    <AllRequestsManagement />
                  </AdminLayout>
                </ProtectedRoute>
              } />
              <Route path="/admin/surprise-requests" element={
                <ProtectedRoute requiredRole="admin">
                  <AdminLayout>
                    <SurpriseRequestsManagement />
                  </AdminLayout>
                </ProtectedRoute>
              } />
              <Route path="/admin/custom-requests" element={
                <ProtectedRoute requiredRole="admin">
                  <AdminLayout>
                    <CustomRequestsManagement />
                  </AdminLayout>
                </ProtectedRoute>
              } />
              <Route path="/admin/reservations" element={
                <ProtectedRoute requiredRole="admin">
                  <AdminLayout>
                    <ReservationsManagement />
                  </AdminLayout>
                </ProtectedRoute>
              } />
              <Route path="/admin/local-buddies" element={
                <ProtectedRoute requiredRole="admin">
                  <AdminLayout>
                    <LocalBuddiesManagement />
                  </AdminLayout>
                </ProtectedRoute>
              } />
              <Route path="/admin/settings" element={
                <ProtectedRoute requiredRole="admin">
                  <AdminLayout>
                    <SettingsManagement />
                  </AdminLayout>
                </ProtectedRoute>
              } />

              <Route path="*" element={<NotFound />} />
            </Routes>
          </Suspense>
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
