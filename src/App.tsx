import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";

// Public Pages
import Index from "./pages/Index";
import Thailand from "./pages/destinations/Thailand";
import NotFound from "./pages/NotFound";

// Auth Pages
import Login from "./pages/auth/Login";
import Signup from "./pages/auth/Signup";
import ForgotPassword from "./pages/auth/ForgotPassword";

// User Dashboard
import { DashboardLayout } from "./components/dashboard/DashboardLayout";
import DashboardHome from "./pages/dashboard/DashboardHome";
import BrowseTrips from "./pages/dashboard/BrowseTrips";
import TripDetails from "./pages/dashboard/TripDetails";
import MyBookings from "./pages/dashboard/MyBookings";
import Profile from "./pages/dashboard/Profile";
import Wishlist from "./pages/dashboard/Wishlist";

// Admin Dashboard
import { AdminLayout } from "./components/admin/AdminLayout";
import AdminOverview from "./pages/admin/AdminOverview";
import TripManagement from "./pages/admin/TripManagement";
import BookingsManagement from "./pages/admin/BookingsManagement";
import UserManagement from "./pages/admin/UserManagement";
import TestimonialsManagement from "./pages/admin/TestimonialsManagement";
import StoriesManagement from "./pages/admin/StoriesManagement";
import NewsletterManagement from "./pages/admin/NewsletterManagement";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<Index />} />
            <Route path="/destinations/thailand" element={<Thailand />} />
            
            {/* Auth Routes */}
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />

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

            {/* Catch-all */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
