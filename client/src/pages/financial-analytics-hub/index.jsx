import React, { useState, useEffect } from 'react';
import Header from '../../components/ui/Header';
import Sidebar from '../../components/ui/Sidebar';
import Icon from '../../components/AppIcon';
import Button from '../../components/ui/Button';
import Select from '../../components/ui/Select';
import FinancialKPICard from './components/FinancialKPICard';
import RevenueChart from './components/RevenueChart';
import TopDonorsPanel from './components/TopDonorsPanel';
import DonationMethodChart from './components/DonationMethodChart';
import FestivalImpactAnalysis from './components/FestivalImpactAnalysis';
import RecurringDonationsMetrics from './components/RecurringDonationsMetrics';
import SeasonalTrendAnalysis from './components/SeasonalTrendAnalysis';
import RevenueForecasting from './components/RevenueForecasting';

const FinancialAnalyticsHub = () => {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [selectedPeriod, setSelectedPeriod] = useState('monthly');
  const [selectedYear, setSelectedYear] = useState(2024);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [lastUpdate, setLastUpdate] = useState(new Date());

  // Simulate real-time updates
  useEffect(() => {
    const interval = setInterval(() => {
      setLastUpdate(new Date());
    }, 3600000); // Update every hour

    return () => clearInterval(interval);
  }, []);

  // Mock financial KPI data
  const financialKPIs = [
    {
      title: "Total Donations",
      value: "12,45,680",
      change: "+18.5%",
      changeType: "positive",
      icon: "IndianRupee"
    },
    {
      title: "Average per Visitor",
      value: "156",
      change: "+12.3%",
      changeType: "positive",
      icon: "Users"
    },
    {
      title: "Digital Payments",
      value: "8,76,420",
      change: "+24.7%",
      changeType: "positive",
      icon: "Smartphone"
    },
    {
      title: "Monthly Growth",
      value: "15.8%",
      change: "+3.2%",
      changeType: "positive",
      icon: "TrendingUp"
    }
  ];

  // Mock revenue chart data
  const revenueChartData = [
    { period: "Jan", donations: 890000, visitors: 5200 },
    { period: "Feb", donations: 920000, visitors: 5400 },
    { period: "Mar", donations: 1150000, visitors: 6800 },
    { period: "Apr", donations: 980000, visitors: 5900 },
    { period: "May", donations: 1080000, visitors: 6200 },
    { period: "Jun", donations: 1200000, visitors: 6800 },
    { period: "Jul", donations: 1350000, visitors: 7200 },
    { period: "Aug", donations: 1280000, visitors: 6900 },
    { period: "Sep", donations: 1420000, visitors: 7800 },
    { period: "Oct", donations: 1680000, visitors: 8900 },
    { period: "Nov", donations: 1580000, visitors: 8200 },
    { period: "Dec", donations: 1750000, visitors: 9200 }
  ];

  // Mock top donors data
  const topDonors = [
    {
      id: 1,
      name: "Rajesh Gupta Trust",
      type: "trust",
      totalAmount: 250000,
      donationCount: 12,
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face"
    },
    {
      id: 2,
      name: "Priya Sharma",
      type: "individual",
      totalAmount: 180000,
      donationCount: 24,
      avatar: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=100&h=100&fit=crop&crop=face"
    },
    {
      id: 3,
      name: "Aditya Industries",
      type: "corporate",
      totalAmount: 150000,
      donationCount: 8,
      avatar: null
    },
    {
      id: 4,
      name: "Meera Patel",
      type: "individual",
      totalAmount: 120000,
      donationCount: 18,
      avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop&crop=face"
    },
    {
      id: 5,
      name: "Vishnu Foundation",
      type: "trust",
      totalAmount: 95000,
      donationCount: 15,
      avatar: null
    }
  ];

  // Mock donation method data
  const donationMethodData = [
    { method: "Digital Payment", amount: 876420 },
    { method: "Cash", amount: 234560 },
    { method: "Bank Transfer", amount: 98700 },
    { method: "Cheque", amount: 36000 },
    { method: "Other", amount: 12000 }
  ];

  // Mock festival impact data
  const festivalImpactData = [
    { festival: "Diwali", amount: 1850000, impact: 320, duration: 5 },
    { festival: "Navratri", amount: 1420000, impact: 280, duration: 9 },
    { festival: "Holi", amount: 980000, impact: 220, duration: 2 },
    { festival: "Dussehra", amount: 1200000, impact: 250, duration: 3 },
    { festival: "Janmashtami", amount: 890000, impact: 180, duration: 1 },
    { festival: "Regular Days", amount: 450000, impact: 100, duration: 30 }
  ];

  // Mock recurring donations data
  const recurringDonationsData = [
    { month: "Jan", amount: 125000, subscribers: 245 },
    { month: "Feb", amount: 132000, subscribers: 258 },
    { month: "Mar", amount: 145000, subscribers: 276 },
    { month: "Apr", amount: 138000, subscribers: 269 },
    { month: "May", amount: 152000, subscribers: 289 },
    { month: "Jun", amount: 168000, subscribers: 312 }
  ];

  const recurringDonationsSummary = {
    totalSubscribers: 312,
    monthlyRecurring: 168000,
    retentionRate: 87.5,
    frequencyBreakdown: [
      { frequency: "Monthly", subscribers: 198, amount: 850 },
      { frequency: "Weekly", subscribers: 89, amount: 420 },
      { frequency: "Yearly", subscribers: 25, amount: 6800 }
    ]
  };

  // Mock seasonal trend data
  const seasonalTrendData = [
    { month: "Jan", amount: 890000, year: 2024, festivalEvents: 2 },
    { month: "Feb", amount: 920000, year: 2024, festivalEvents: 1 },
    { month: "Mar", amount: 1150000, year: 2024, festivalEvents: 3 },
    { month: "Apr", amount: 980000, year: 2024, festivalEvents: 2 },
    { month: "May", amount: 1080000, year: 2024, festivalEvents: 1 },
    { month: "Jun", amount: 1200000, year: 2024, festivalEvents: 2 },
    { month: "Jul", amount: 1350000, year: 2024, festivalEvents: 1 },
    { month: "Aug", amount: 1280000, year: 2024, festivalEvents: 3 },
    { month: "Sep", amount: 1420000, year: 2024, festivalEvents: 4 },
    { month: "Oct", amount: 1680000, year: 2024, festivalEvents: 5 },
    { month: "Nov", amount: 1580000, year: 2024, festivalEvents: 3 },
    { month: "Dec", amount: 1750000, year: 2024, festivalEvents: 2 },
    // Previous year data
    { month: "Jan", amount: 750000, year: 2023, festivalEvents: 2 },
    { month: "Feb", amount: 820000, year: 2023, festivalEvents: 1 },
    { month: "Mar", amount: 980000, year: 2023, festivalEvents: 3 },
    { month: "Apr", amount: 850000, year: 2023, festivalEvents: 2 },
    { month: "May", amount: 920000, year: 2023, festivalEvents: 1 },
    { month: "Jun", amount: 1050000, year: 2023, festivalEvents: 2 },
    { month: "Jul", amount: 1180000, year: 2023, festivalEvents: 1 },
    { month: "Aug", amount: 1120000, year: 2023, festivalEvents: 3 },
    { month: "Sep", amount: 1250000, year: 2023, festivalEvents: 4 },
    { month: "Oct", amount: 1450000, year: 2023, festivalEvents: 5 },
    { month: "Nov", amount: 1380000, year: 2023, festivalEvents: 3 },
    { month: "Dec", amount: 1520000, year: 2023, festivalEvents: 2 }
  ];

  // Mock forecasting data
  const historicalForecastData = [
    { period: "Oct 2024", historical: 1680000 },
    { period: "Nov 2024", historical: 1580000 },
    { period: "Dec 2024", historical: 1750000 }
  ];

  const forecastData = [
    { 
      period: "Jan 2025", 
      forecast: 1820000, 
      target: 1800000, 
      confidence: 85,
      factors: ["New Year", "Winter season"]
    },
    { 
      period: "Feb 2025", 
      forecast: 1650000, 
      target: 1700000, 
      confidence: 78,
      factors: ["Post-festival dip", "Valentine\'s Day"]
    },
    { 
      period: "Mar 2025", 
      forecast: 2100000, 
      target: 2000000, 
      confidence: 92,
      factors: ["Holi festival", "Spring season"]
    },
    { 
      period: "Apr 2025", 
      forecast: 1950000, 
      target: 1900000, 
      confidence: 88,
      factors: ["Ram Navami", "Good weather"]
    }
  ];

  const forecastTargets = {
    annual: 22000000,
    confidence: 85,
    modelAccuracy: 87.3
  };

  // Filter options
  const periodOptions = [
    { value: 'daily', label: 'Daily' },
    { value: 'weekly', label: 'Weekly' },
    { value: 'monthly', label: 'Monthly' },
    { value: 'quarterly', label: 'Quarterly' },
    { value: 'yearly', label: 'Yearly' }
  ];

  const categoryOptions = [
    { value: 'all', label: 'All Categories' },
    { value: 'general', label: 'General Donations' },
    { value: 'festival', label: 'Festival Donations' },
    { value: 'maintenance', label: 'Maintenance Fund' },
    { value: 'charity', label: 'Charity Programs' }
  ];

  const handleExportReport = () => {
    // Mock export functionality
    console.log('Exporting financial report...');
  };

  const handlePrintReport = () => {
    // Mock print functionality
    window.print();
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <Sidebar 
        isCollapsed={sidebarCollapsed} 
        onToggle={() => setSidebarCollapsed(!sidebarCollapsed)} 
      />
      <main className={`transition-sacred ${sidebarCollapsed ? 'ml-16' : 'ml-64'} pt-6`}>
        <div className="px-6 pb-6">
          {/* Header Section */}
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-8">
            <div className="mb-4 lg:mb-0">
              <div className="flex items-center space-x-3 mb-2">
                <div className="w-10 h-10 bg-gradient-to-br from-primary to-secondary rounded-lg flex items-center justify-center sacred-shadow-sm">
                  <Icon name="TrendingUp" size={24} className="text-white" />
                </div>
                <div>
                  <h1 className="text-2xl font-heading font-bold text-foreground">Financial Analytics Hub</h1>
                  <p className="text-sm font-caption text-muted-foreground">
                    Comprehensive revenue insights and donation trend analysis
                  </p>
                </div>
              </div>
              <div className="flex items-center space-x-2 text-xs font-caption text-muted-foreground">
                <Icon name="Clock" size={14} />
                <span>Last updated: {lastUpdate?.toLocaleTimeString('en-IN', { hour12: false })}</span>
                <span>•</span>
                <span>Data refreshes hourly</span>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-3 sm:space-y-0 sm:space-x-4">
              <div className="flex items-center space-x-3">
                <Select
                  options={periodOptions}
                  value={selectedPeriod}
                  onChange={setSelectedPeriod}
                  placeholder="Select period"
                  className="w-32"
                />
                <Select
                  options={categoryOptions}
                  value={selectedCategory}
                  onChange={setSelectedCategory}
                  placeholder="Select category"
                  className="w-40"
                />
              </div>
              <div className="flex items-center space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  iconName="Download"
                  iconPosition="left"
                  onClick={handleExportReport}
                >
                  Export
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  iconName="Printer"
                  iconPosition="left"
                  onClick={handlePrintReport}
                >
                  Print
                </Button>
              </div>
            </div>
          </div>

          {/* Financial KPIs */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {financialKPIs?.map((kpi, index) => (
              <FinancialKPICard
                key={index}
                title={kpi?.title}
                value={kpi?.value}
                change={kpi?.change}
                changeType={kpi?.changeType}
                icon={kpi?.icon}
              />
            ))}
          </div>

          {/* Main Analytics Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
            {/* Revenue Chart - 2 columns */}
            <div className="lg:col-span-2">
              <RevenueChart data={revenueChartData} selectedPeriod={selectedPeriod} />
            </div>

            {/* Top Donors Panel - 1 column */}
            <div className="lg:col-span-1">
              <TopDonorsPanel donors={topDonors} />
            </div>
          </div>

          {/* Secondary Analytics Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            <DonationMethodChart data={donationMethodData} />
            <FestivalImpactAnalysis data={festivalImpactData} />
          </div>

          {/* Recurring Donations */}
          <div className="mb-8">
            <RecurringDonationsMetrics 
              data={recurringDonationsData} 
              summary={recurringDonationsSummary} 
            />
          </div>

          {/* Full-width Analytics */}
          <div className="space-y-8">
            <SeasonalTrendAnalysis 
              data={seasonalTrendData}
              selectedYear={selectedYear}
              onYearChange={setSelectedYear}
            />
            
            <RevenueForecasting 
              historicalData={historicalForecastData}
              forecastData={forecastData}
              targets={forecastTargets}
            />
          </div>

          {/* Footer Summary */}
          <div className="mt-12 pt-8 border-t border-border">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center">
                <div className="text-3xl font-heading font-bold text-primary mb-2">
                  ₹{(revenueChartData?.reduce((sum, d) => sum + d?.donations, 0))?.toLocaleString('en-IN')}
                </div>
                <div className="text-sm font-caption text-muted-foreground">Total Annual Revenue</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-heading font-bold text-success mb-2">
                  {topDonors?.length?.toLocaleString('en-IN')}
                </div>
                <div className="text-sm font-caption text-muted-foreground">Active Major Donors</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-heading font-bold text-accent mb-2">
                  {recurringDonationsSummary?.retentionRate}%
                </div>
                <div className="text-sm font-caption text-muted-foreground">Donor Retention Rate</div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default FinancialAnalyticsHub;