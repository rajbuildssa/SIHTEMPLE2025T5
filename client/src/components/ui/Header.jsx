import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { SignInButton, SignUpButton, UserButton, useUser, useAuth } from '@clerk/clerk-react';
import Icon from '../AppIcon';
import Button from './Button';

const Header = () => {
  const location = useLocation();
  const { isLoaded, isSignedIn, user } = useUser();
  const { signOut } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [realTimeStatus, setRealTimeStatus] = useState('connected');
  const [alertCount, setAlertCount] = useState(3);
  const [lastUpdate, setLastUpdate] = useState(new Date());

  // Simulate real-time status updates
  useEffect(() => {
    const interval = setInterval(() => {
      setLastUpdate(new Date());
    }, 30000); // Update every 30 seconds

    return () => clearInterval(interval);
  }, []);

  const navigationItems = [
    {
      label: 'Operations Center',
      items: [
        {
          name: 'Temple Operations',
          path: '/temple-operations-overview',
          icon: 'Activity',
          tooltip: 'Real-time temple monitoring and 24-hour predictions'
        },
        {
          name: 'Emergency Response',
          path: '/emergency-response-center',
          icon: 'AlertTriangle',
          tooltip: 'Critical incident management and staff dispatch'
        },
        {
          name: 'E-Darshan Booking',
          path: '/e-darshan-ticket-booking',
          icon: 'Calendar',
          tooltip: 'Online darshan ticket booking system'
        },
        {
          name: 'Booking Management',
          path: '/booking-confirmation-management',
          icon: 'CheckCircle',
          tooltip: 'Manage and confirm darshan bookings'
        }
      ]
    },
    {
      label: 'Analytics Intelligence',
      items: [
        {
          name: 'Crowd Analytics',
          path: '/crowd-analytics-dashboard',
          icon: 'Users',
          tooltip: 'Visitor pattern analysis and predictive modeling'
        },
        {
          name: 'Financial Analytics',
          path: '/financial-analytics-hub',
          icon: 'TrendingUp',
          tooltip: 'Revenue trends and donation performance metrics'
        }
      ]
    }
  ];

  const isActiveRoute = (path) => {
    return location?.pathname === path;
  };

  const getActiveSection = () => {
    const currentPath = location?.pathname;
    if (currentPath === '/temple-operations-overview' || currentPath === '/emergency-response-center') {
      return 'Operations Center';
    }
    if (currentPath === '/crowd-analytics-dashboard' || currentPath === '/financial-analytics-hub') {
      return 'Analytics Intelligence';
    }
    return '';
  };

  const formatTime = (date) => {
    return date?.toLocaleTimeString('en-US', { 
      hour12: false, 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  const Logo = () => (
    <div className="flex items-center space-x-3">
      <div className="w-10 h-10 bg-gradient-to-br from-primary to-secondary rounded-lg flex items-center justify-center sacred-shadow-sm">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" className="text-white">
          <path
            d="M12 2L13.09 8.26L20 9L13.09 9.74L12 16L10.91 9.74L4 9L10.91 8.26L12 2Z"
            fill="currentColor"
          />
          <circle cx="12" cy="20" r="2" fill="currentColor" />
        </svg>
      </div>
      <div className="hidden sm:block">
        <h1 className="text-xl font-heading font-semibold text-foreground">Temple Analytics</h1>
        <p className="text-xs font-caption text-muted-foreground">Sacred Intelligence Platform</p>
      </div>
    </div>
  );

  const RealTimeStatusIndicator = () => (
    <div className="hidden lg:flex items-center space-x-2 px-3 py-1.5 bg-surface rounded-lg sacred-shadow-sm">
      <div className={`w-2 h-2 rounded-full ${
        realTimeStatus === 'connected' ? 'bg-success breathing-animation' : 'bg-error'
      }`} />
      <span className="text-sm font-mono text-text-secondary">
        {formatTime(lastUpdate)}
      </span>
      <span className="text-xs font-caption text-muted-foreground">
        {realTimeStatus === 'connected' ? 'Live' : 'Offline'}
      </span>
    </div>
  );

  const AlertNotificationCenter = () => (
    <Button
      variant="ghost"
      size="icon"
      className="relative"
      onClick={() => {/* Handle alert center */}}
    >
      <Icon name="Bell" size={20} />
      {alertCount > 0 && (
        <span className="absolute -top-1 -right-1 w-5 h-5 bg-error text-error-foreground text-xs rounded-full flex items-center justify-center font-mono">
          {alertCount > 9 ? '9+' : alertCount}
        </span>
      )}
    </Button>
  );

  const AuthenticationSection = () => {
    if (!isLoaded) {
      return (
        <div className="hidden md:flex items-center space-x-2">
          <div className="w-8 h-8 bg-muted rounded-full animate-pulse" />
        </div>
      );
    }

    if (isSignedIn) {
      return (
        <div className="hidden md:flex items-center space-x-2">
          <UserButton
            afterSignOutUrl="/"
            appearance={{
              elements: {
                avatarBox: "w-8 h-8"
              }
            }}
          />
        </div>
      );
    }

    return (
      <div className="hidden md:flex items-center space-x-2">
        <SignInButton mode="modal">
          <Button variant="outline" size="sm">
            Sign In
          </Button>
        </SignInButton>
        <SignUpButton mode="modal">
          <Button size="sm" className="sw1049-gradient text-white hover:opacity-90">
            Sign Up
          </Button>
        </SignUpButton>
      </div>
    );
  };

  const QuickActionToolbar = () => (
    <div className="hidden md:flex items-center space-x-2">
      <Button
        variant="outline"
        size="sm"
        iconName="Phone"
        iconPosition="left"
        onClick={() => {/* Handle emergency call */}}
      >
        Emergency
      </Button>
      <Button
        variant="ghost"
        size="icon"
        onClick={() => {/* Handle settings */}}
      >
        <Icon name="Settings" size={18} />
      </Button>
    </div>
  );

  return (
    <header className="sticky top-0 z-100 w-full bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b border-border">
      <div className="flex h-20 items-center justify-between px-6">
        {/* Logo Section */}
        <Logo />

        {/* Homepage Button */}
        <Button
          variant="outline"
          size="sm"
          onClick={() => window.location.href = '/'}
          className="ml-4"
        >
          Home
        </Button>

        {/* Desktop Navigation */}
        <nav className="hidden lg:flex items-center space-x-8">
          {navigationItems?.map((section) => (
            <div key={section?.label} className="relative group">
              <div className={`px-4 py-2 rounded-lg transition-sacred ${
                getActiveSection() === section?.label 
                  ? 'bg-primary/10 text-primary' :'text-text-primary hover:bg-muted'
              }`}>
                <span className="font-heading font-medium text-sm" style={{ color: 'black' }}>{section?.label}</span>
              </div>
              
              {/* Dropdown Menu */}
              <div className="absolute top-full left-0 mt-2 w-64 bg-popover border border-border rounded-lg sacred-shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-sacred">
                <div className="p-2">
                  {section?.items?.map((item) => (
                    <a
                      key={item?.path}
                      href={item?.path}
                      className={`flex items-center space-x-3 px-3 py-2 rounded-md transition-hover hover-lift ${
                        isActiveRoute(item?.path)
                          ? 'bg-primary text-primary-foreground'
                          : 'text-popover-foreground hover:bg-muted'
                      }`}
                      title={item?.tooltip}
                    >
                      <Icon name={item?.icon} size={16} />
                      <span className="font-body text-sm">{item?.name}</span>
                    </a>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </nav>

        {/* Right Section */}
        <div className="flex items-center space-x-4">
          <RealTimeStatusIndicator />
          <AlertNotificationCenter />
          <AuthenticationSection />
          <QuickActionToolbar />

          {/* Mobile Menu Button */}
          <Button
            variant="ghost"
            size="icon"
            className="lg:hidden"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            <Icon name={isMenuOpen ? "X" : "Menu"} size={20} />
          </Button>
        </div>
      </div>
      {/* Mobile Navigation */}
      {isMenuOpen && (
        <div className="lg:hidden border-t border-border bg-background">
          <div className="px-6 py-4 space-y-4">
            {navigationItems?.map((section) => (
              <div key={section?.label} className="space-y-2">
                <h3 className="font-heading font-semibold text-sm text-accent uppercase tracking-wide">
                  {section?.label}
                </h3>
                <div className="space-y-1">
                  {section?.items?.map((item) => (
                    <a
                      key={item?.path}
                      href={item?.path}
                      className={`flex items-center space-x-3 px-3 py-2 rounded-lg transition-hover ${
                        isActiveRoute(item?.path)
                          ? 'bg-primary text-primary-foreground'
                          : 'text-foreground hover:bg-muted'
                      }`}
                      onClick={() => setIsMenuOpen(false)}
                    >
                      <Icon name={item?.icon} size={18} />
                      <span className="font-body text-sm">{item?.name}</span>
                    </a>
                  ))}
                </div>
              </div>
            ))}
            
            {/* Mobile Status and Actions */}
            <div className="pt-4 border-t border-border space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <div className={`w-2 h-2 rounded-full ${
                    realTimeStatus === 'connected' ? 'bg-success breathing-animation' : 'bg-error'
                  }`} />
                  <span className="text-sm font-mono text-text-secondary">
                    Last update: {formatTime(lastUpdate)}
                  </span>
                </div>
                <Button
                  variant="destructive"
                  size="sm"
                  iconName="Phone"
                  iconPosition="left"
                  onClick={() => {/* Handle emergency call */}}
                >
                  Emergency
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;