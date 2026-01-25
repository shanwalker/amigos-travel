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
const NotFound = lazy(() => import("./pages/NotFound"));
const SurpriseTrip = lazy(() => import("./pages/SurpriseTrip"));
const CustomTrip = lazy(() => import("./pages/CustomTrip"));
const Onboarding = lazy(() => import("./pages/Onboarding"));

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
const Profile = lazy(() => import("./pages/dashboard/Profile"));
const Wishlist = lazy(() => import("./pages/dashboard/Wishlist"));

// Admin Dashboard - lazy loaded
const AdminLayout = lazy(() => import("./components/admin/AdminLayout").then(m => ({ default: m.AdminLayout })));
const AdminOverview = lazy(() => import("./pages/admin/AdminOverview"));
const TripManagement = lazy(() => import("./pages/admin/TripManagement"));
const BookingsManagement = lazy(() => import("./pages/admin/BookingsManagement"));
const UserManagement = lazy(() => import("./pages/admin/UserManagement"));
const TestimonialsManagement = lazy(() => import("./pages/admin/TestimonialsManagement"));
const StoriesManagement = lazy(() => import("./pages/admin/StoriesManagement"));
const NewsletterManagement = lazy(() => import("./pages/admin/NewsletterManagement"));

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
              {/* Auth Routes */}
              <Route path="/login" element={<Login />} />
              <Route path="/signup" element={<Signup />} />
              <Route path="/forgot-password" element={<ForgotPassword />} />
              <Route path="/admin/login" element={<AdminLogin />} />
              
              {/* Onboarding Route - after signup */}
              <Route path="/onboarding" element={
                <ProtectedRoute>
                  <Onboarding />
                </ProtectedRoute>
              } />

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

              <Route path="*" element={<NotFound />} />
            </Routes>
          </Suspense>
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
