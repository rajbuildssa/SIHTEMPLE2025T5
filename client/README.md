# 🛕 Temple Crowd Management / Temple Analytics

**Live Demo:** [Temple Analytics](https://adityasih2025templecrowdmanagement.vercel.app/)

---

## 📌 Overview

Temple Crowd Management (Temple Analytics) is a web application designed to help temples and religious institutions **monitor, analyze, and manage visitor flow**.  

It provides **real-time dashboards, crowd insights, and alerts** to ensure a safe and organized environment for devotees during daily operations and peak festival days.

---

## 🎯 Goals & Motivation

Temples often face **overcrowding** during festivals, special ceremonies, or weekends. This leads to:

- 🚨 Safety risks from high crowd density  
- 🧑‍🤝‍🧑 Inefficient staff/security allocation  
- ⏳ Long waiting times and poor visitor experience  
- 📉 Lack of historical data for planning future events  

👉 This project aims to solve these problems with a **data-driven digital solution**.

---

## ✨ Features

- 📊 **Real-time Crowd Dashboard** – Live view of visitors  
- 🕒 **Historical Analytics** – Hourly, daily & seasonal patterns  
- ⚠️ **Alerts & Notifications** – Trigger when thresholds are exceeded  
- 📍 **Visualizations** – Charts and (planned) heatmaps for temple zones  
- 📱 **Mobile Responsive** – Works seamlessly on all devices  
- 🔮 **Future Scope** – Forecasting, IoT integration, multilingual support  

---

## 🖼️ Screenshots

### Dashboard (Live Metrics)
<img src="https://github.com/user-attachments/assets/81d0f287-f229-48c3-aa8b-7237432517cf" width="800" />

### Analytics & Trends
<img src="https://github.com/user-attachments/assets/38bca5c5-370e-46d7-bd9e-285aaff61695" width="800" />

### Temple Selector
<img src="https://github.com/user-attachments/assets/28f684ae-1cdc-49c2-acf7-c30940cb1c30" width="800" />





---

## 🛠️ Tech Stack

- **Frontend:** React / Next.js  
- **Hosting & Deployment:** Vercel  
- **Backend (Planned):** Node.js / Express or Serverless Functions  
- **Database (Planned):** PostgreSQL / MongoDB / Firebase  
- **Visualization:** Chart.js / D3.js (heatmaps coming soon)  

---

## ⚙️ How It Works

1. **Data Collection** – Visitor entries/exits logged manually or via IoT sensors  
2. **Storage** – Data stored in a database for real-time + historical analysis  
3. **Processing** – Aggregates visitor counts and checks thresholds  
4. **Visualization** – Displays real-time dashboards and charts  
5. **Alerts** – Sends alerts when safe crowd density is exceeded  

---

## 🚀 Setup / Installation

Run locally with:

```bash
# Clone the repository
git clone https://github.com/yourusername/temple-crowd-management.git
cd temple-crowd-management

# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

---

## 📁 Frontend Folder Structure

This section outlines the complete structure of the `client/` directory, which is the frontend part of the Temple Crowd Management application. The structure is organized for a React-based application using Vite as the build tool.

### Root Level Files
- `.gitignore` - Git ignore rules
- `eslint.config.js` - ESLint configuration
- `index.html` - Main HTML entry point
- `jsconfig.json` - JavaScript configuration
- `package.json` - Dependencies and scripts
- `postcss.config.js` - PostCSS configuration
- `QR_IMPLEMENTATION_README.md` - QR code implementation documentation
- `QR_TEST_README.md` - QR code testing documentation
- `qr-test.html` - QR testing page
- `README.md` - This file (project documentation)
- `simple-qr-test.html` - Simple QR test page
- `tailwind.config.js` - Tailwind CSS configuration
- `TODO.md` - Task list and development notes
- `vercel.json` - Vercel deployment configuration
- `vite.config.mjs` - Vite configuration

### `public/` Directory
Contains static assets served directly by Vite:
- `_redirects` - Redirect rules for deployment
- `manifest.json` - Web app manifest
- `vite.svg` - Vite logo
- `assets/images/no_images.png` - Default image placeholder

### `src/` Directory
Main source code directory:

#### Core Files
- `App.jsx` - Main application component
- `index.jsx` - Application entry point
- `Routes.jsx` - Route definitions

#### `components/` Directory
Reusable UI components:
- `AppIcon.jsx` - Icon component
- `AppImage.jsx` - Image component
- `ErrorBoundary.jsx` - Error boundary component
- `ScrollToTop.jsx` - Scroll to top utility
- `ui/` - UI components:
  - `Button.jsx`, `Checkbox.jsx`, `Header.jsx`, `Input.jsx`, `Select.jsx`, `Sidebar.jsx`

#### `pages/` Directory
Page components organized by feature:

- `NotFound.jsx` - 404 error page
- `booking-confirmation-management/` - Booking management feature:
  - `index.jsx` - Main page
  - `components/` - Related components (e.g., `AdditionalServicesBooking.jsx`, `BookingManagementHeader.jsx`, `BookingModificationModal.jsx`, `FeedbackSubmissionModal.jsx`, `LiveTempleUpdates.jsx`, `NavigationAssistance.jsx`, `TicketManagementCard.jsx`, `VisitPreparationChecklist.jsx`)
- `crowd-analytics-dashboard/` - Analytics dashboard:
  - `index.jsx` - Main page
  - `components/` - Dashboard components (e.g., `FilterControls.jsx`, `HeatMapVisualization.jsx`, `MetricsStrip.jsx`, `MLPredictionPanel.jsx`, `PredictiveForecast.jsx`, `SeasonalTrendsChart.jsx`)
- `e-darshan-ticket-booking/` - Ticket booking:
  - `index.jsx` - Main page
  - `components/` - Booking components (e.g., `BookingConfirmation.jsx`, `BookingHeader.jsx`, `DarshanBookingForm.jsx`, `DevoteeDetailsForm.jsx`, `PaymentIntegration.jsx`, `TempleSelector.jsx`, `TicketSelection.jsx`)
- `emergency-response-center/` - Emergency management:
  - `index.jsx` - Main page
  - `components/` - Emergency components (e.g., `AlertBanner.jsx`, `CrowdDensityHeatMap.jsx`, `IncidentTimeline.jsx`, `QuickActionPanel.jsx`, `StaffDispatchTracker.jsx`, `StatusMetricsRow.jsx`)
- `financial-analytics-hub/` - Financial analytics:
  - `index.jsx` - Main page
  - `components/` - Financial components (e.g., `DonationMethodChart.jsx`, `FestivalImpactAnalysis.jsx`, `FinancialKPICard.jsx`, `RecurringDonationsMetrics.jsx`, `RevenueChart.jsx`, `RevenueForecasting.jsx`, `SeasonalTrendAnalysis.jsx`, `TopDonorsPanel.jsx`)
- `qr-test/` - QR testing:
  - `index.jsx` - Main page
- `sih-demo-showcase/` - Demo showcase:
  - `index.jsx` - Main page
  - `components/` - Demo components (e.g., `DemoControlPanel.jsx`, `DemoHeader.jsx`, `DemoNarrative.jsx`, `LiveMetricsTicker.jsx`, `MainVisualization.jsx`)
- `temple-operations-overview/` - Operations overview:
  - `index.jsx` - Main page
  - `components/` - Overview components (e.g., `GlobalControlPanel.jsx`, `KPIMetricCard.jsx`, `LiveAlertFeed.jsx`, `PredictionChart.jsx`, `TempleStatusGrid.jsx`)

#### `styles/` Directory
- `index.css` - Main CSS file
- `tailwind.css` - Tailwind CSS imports

#### `utils/` Directory
Utility functions:
- `cn.js` - Utility for class names
- `pdfGenerator.js` - PDF generation utility
- `qrTest.js` - QR testing utility
- `qrTestFixed.js` - Fixed QR testing utility
