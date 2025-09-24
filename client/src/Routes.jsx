import React from "react";
import { BrowserRouter, Routes as RouterRoutes, Route } from "react-router-dom";
import { SignedIn, SignedOut, RedirectToSignIn } from '@clerk/clerk-react';
import ScrollToTop from "components/ScrollToTop";
import ErrorBoundary from "components/ErrorBoundary";
import NotFound from "pages/NotFound";
import TempleOperationsOverview from './pages/temple-operations-overview';
import FinancialAnalyticsHub from './pages/financial-analytics-hub';
import EmergencyResponseCenter from './pages/emergency-response-center';
import CrowdAnalyticsDashboard from './pages/crowd-analytics-dashboard';
import SIHDemoShowcase from './pages/sih-demo-showcase';
import EDarshanTicketBooking from './pages/e-darshan-ticket-booking';
import BookingConfirmationManagement from './pages/booking-confirmation-management';
import PaymentSuccess from './pages/PaymentSuccess';
import TicketView from './pages/ticket-view';

const Routes = () => {
  return (
    <BrowserRouter>
      <ErrorBoundary>
      <ScrollToTop />
      <RouterRoutes>
        {/* Define your route here */}
        <Route path="/" element={<CrowdAnalyticsDashboard />} />
        <Route path="/temple-operations-overview" element={<TempleOperationsOverview />} />
        <Route path="/financial-analytics-hub" element={<FinancialAnalyticsHub />} />
        <Route path="/emergency-response-center" element={<EmergencyResponseCenter />} />
        <Route path="/crowd-analytics-dashboard" element={<CrowdAnalyticsDashboard />} />
        <Route path="/sih-demo-showcase" element={<SIHDemoShowcase />} />
        <Route path="/e-darshan-ticket-booking" element={
          <SignedIn>
            <EDarshanTicketBooking />
          </SignedIn>
        } />
        <Route path="/booking-confirmation-management" element={
          <SignedIn>
            <BookingConfirmationManagement />
          </SignedIn>
        } />
        <Route path="/payment-success" element={
          <SignedIn>
            <PaymentSuccess />
          </SignedIn>
        } />
        <Route path="/ticket/:id" element={<TicketView />} />
        <Route path="*" element={<NotFound />} />
      </RouterRoutes>
      </ErrorBoundary>
    </BrowserRouter>
  );
};

export default Routes;