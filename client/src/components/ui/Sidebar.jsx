import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import Icon from '../AppIcon';
import Button from './Button';

const Sidebar = ({ isCollapsed = false, onToggle }) => {
  const location = useLocation();
  const [culturalTheme, setCulturalTheme] = useState('default');
  const [realTimeMetrics, setRealTimeMetrics] = useState({
    activeVisitors: 1247,
    staffOnDuty: 23,
    emergencyLevel: 'normal'
  });

  // Simulate real-time metrics updates
  useEffect(() => {
    const interval = setInterval(() => {
      setRealTimeMetrics(prev => ({
        ...prev,
        activeVisitors: prev?.activeVisitors + Math.floor(Math.random() * 20) - 10,
        staffOnDuty: Math.max(15, prev?.staffOnDuty + Math.floor(Math.random() * 3) - 1)
      }));
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  const navigationSections = [
    {
      title: 'SIH Showcase',
      items: [
        {
          name: 'SIH Demo Showcase',
          path: '/sih-demo-showcase',
          icon: 'Play',
          description: 'Smart India Hackathon demonstration',
          badge: 'Demo'
        }
      ]
    },
    {
      title: 'Operations Center',
      items: [
        {
          name: 'Temple Operations',
          path: '/temple-operations-overview',
          icon: 'Activity',
          description: 'Real-time monitoring dashboard',
          badge: 'Live'
        },
        {
          name: 'Emergency Response',
          path: '/emergency-response-center',
          icon: 'AlertTriangle',
          description: 'Critical incident management',
          badge: realTimeMetrics?.emergencyLevel === 'high' ? 'Alert' : null
        }
      ]
    },
    {
      title: 'Analytics Intelligence',
      items: [
        {
          name: 'Crowd Analytics',
          path: '/crowd-analytics-dashboard',
          icon: 'Users',
          description: 'Visitor pattern analysis',
          badge: null
        },
        {
          name: 'Financial Analytics',
          path: '/financial-analytics-hub',
          icon: 'TrendingUp',
          description: 'Revenue and donation metrics',
          badge: null
        }
      ]
    }
  ];

  const culturalThemes = [
    { value: 'default', label: 'Default', icon: 'Sun' },
    { value: 'diwali', label: 'Diwali', icon: 'Sparkles' },
    { value: 'holi', label: 'Holi', icon: 'Palette' },
    { value: 'navratri', label: 'Navratri', icon: 'Crown' }
  ];

  const isActiveRoute = (path) => {
    return location?.pathname === path;
  };

  const getEmergencyLevelColor = (level) => {
    switch (level) {
      case 'high': return 'text-error';
      case 'medium': return 'text-warning';
      default: return 'text-success';
    }
  };

  const CulturalThemeSelector = () => (
    <div className="p-4 border-t border-border">
      {!isCollapsed && (
        <div className="mb-3">
          <h4 className="font-heading font-medium text-sm text-foreground mb-2">
            Cultural Theme
          </h4>
        </div>
      )}
      <div className={`${isCollapsed ? 'flex flex-col space-y-2' : 'grid grid-cols-2 gap-2'}`}>
        {culturalThemes?.map((theme) => (
          <Button
            key={theme?.value}
            variant={culturalTheme === theme?.value ? 'default' : 'ghost'}
            size={isCollapsed ? 'icon' : 'sm'}
            className={`${isCollapsed ? 'w-10 h-10' : 'justify-start'}`}
            onClick={() => setCulturalTheme(theme?.value)}
            title={theme?.label}
          >
            <Icon name={theme?.icon} size={16} />
            {!isCollapsed && (
              <span className="ml-2 text-xs font-caption">{theme?.label}</span>
            )}
          </Button>
        ))}
      </div>
    </div>
  );

  const RealTimeMetricsPanel = () => (
    <div className="p-4 border-t border-border">
      {!isCollapsed && (
        <div className="mb-3">
          <h4 className="font-heading font-medium text-sm text-foreground mb-2">
            Live Metrics
          </h4>
        </div>
      )}
      <div className="space-y-3">
        <div className={`${isCollapsed ? 'text-center' : 'flex items-center justify-between'}`}>
          <div className="flex items-center space-x-2">
            <Icon name="Users" size={14} className="text-primary" />
            {!isCollapsed && (
              <span className="text-xs font-caption text-muted-foreground">Visitors</span>
            )}
          </div>
          <span className={`font-mono text-sm font-medium ${isCollapsed ? 'text-xs' : ''}`}>
            {realTimeMetrics?.activeVisitors?.toLocaleString()}
          </span>
        </div>
        
        <div className={`${isCollapsed ? 'text-center' : 'flex items-center justify-between'}`}>
          <div className="flex items-center space-x-2">
            <Icon name="Shield" size={14} className="text-accent" />
            {!isCollapsed && (
              <span className="text-xs font-caption text-muted-foreground">Staff</span>
            )}
          </div>
          <span className={`font-mono text-sm font-medium ${isCollapsed ? 'text-xs' : ''}`}>
            {realTimeMetrics?.staffOnDuty}
          </span>
        </div>
        
        <div className={`${isCollapsed ? 'text-center' : 'flex items-center justify-between'}`}>
          <div className="flex items-center space-x-2">
            <Icon name="AlertCircle" size={14} className={getEmergencyLevelColor(realTimeMetrics?.emergencyLevel)} />
            {!isCollapsed && (
              <span className="text-xs font-caption text-muted-foreground">Status</span>
            )}
          </div>
          <span className={`text-xs font-caption capitalize ${getEmergencyLevelColor(realTimeMetrics?.emergencyLevel)} ${isCollapsed ? 'text-xs' : ''}`}>
            {realTimeMetrics?.emergencyLevel}
          </span>
        </div>
      </div>
    </div>
  );

  const QuickActions = () => (
    <div className="p-4 border-t border-border">
      {!isCollapsed && (
        <div className="mb-3">
          <h4 className="font-heading font-medium text-sm text-foreground mb-2">
            Quick Actions
          </h4>
        </div>
      )}
      <div className={`${isCollapsed ? 'space-y-2' : 'space-y-2'}`}>
        <Button
          variant="outline"
          size={isCollapsed ? 'icon' : 'sm'}
          className={`${isCollapsed ? 'w-full' : 'w-full justify-start'}`}
          onClick={() => {/* Handle emergency protocol */}}
          title="Emergency Protocol"
        >
          <Icon name="Phone" size={16} className="text-error" />
          {!isCollapsed && (
            <span className="ml-2 text-xs">Emergency</span>
          )}
        </Button>
        
        <Button
          variant="ghost"
          size={isCollapsed ? 'icon' : 'sm'}
          className={`${isCollapsed ? 'w-full' : 'w-full justify-start'}`}
          onClick={() => {/* Handle broadcast */}}
          title="Broadcast Message"
        >
          <Icon name="Radio" size={16} className="text-primary" />
          {!isCollapsed && (
            <span className="ml-2 text-xs">Broadcast</span>
          )}
        </Button>
        
        <Button
          variant="ghost"
          size={isCollapsed ? 'icon' : 'sm'}
          className={`${isCollapsed ? 'w-full' : 'w-full justify-start'}`}
          onClick={() => {/* Handle system override */}}
          title="System Override"
        >
          <Icon name="Settings" size={16} className="text-accent" />
          {!isCollapsed && (
            <span className="ml-2 text-xs">Override</span>
          )}
        </Button>
      </div>
    </div>
  );

  return (
    <aside className={`fixed left-0 top-20 h-[calc(100vh-5rem)] bg-card border-r border-border transition-sacred z-100 ${
      isCollapsed ? 'w-16' : 'w-64'
    }`}>
      <div className="flex flex-col h-full">
        {/* Toggle Button */}
        <div className="p-4 border-b border-border">
          <Button
            variant="ghost"
            size="icon"
            onClick={onToggle}
            className="w-full"
            title={isCollapsed ? 'Expand Sidebar' : 'Collapse Sidebar'}
          >
            <Icon name={isCollapsed ? "ChevronRight" : "ChevronLeft"} size={18} />
          </Button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto">
          <div className="p-4 space-y-6">
            {navigationSections?.map((section) => (
              <div key={section?.title}>
                {!isCollapsed && (
                  <h3 className="font-heading font-semibold text-xs text-accent uppercase tracking-wide mb-3">
                    {section?.title}
                  </h3>
                )}
                <div className="space-y-1">
                  {section?.items?.map((item) => (
                    <a
                      key={item?.path}
                      href={item?.path}
                      className={`group flex items-center px-3 py-2 rounded-lg transition-hover hover-lift ${
                        isActiveRoute(item?.path)
                          ? 'bg-primary text-primary-foreground sacred-shadow-sm'
                          : 'text-card-foreground hover:bg-muted'
                      } ${isCollapsed ? 'justify-center' : ''}`}
                      title={isCollapsed ? `${item?.name} - ${item?.description}` : ''}
                    >
                      <Icon 
                        name={item?.icon} 
                        size={18} 
                        className={`${isCollapsed ? '' : 'mr-3'} ${
                          isActiveRoute(item?.path) ? 'text-primary-foreground' : 'text-muted-foreground group-hover:text-foreground'
                        }`}
                      />
                      {!isCollapsed && (
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between">
                            <span className="font-body text-sm font-medium truncate">
                              {item?.name}
                            </span>
                            {item?.badge && (
                              <span className={`ml-2 px-2 py-0.5 text-xs font-caption rounded-full ${
                                item?.badge === 'Live' ?'bg-success/20 text-success breathing-animation' 
                                  : item?.badge === 'Alert' ?'bg-error/20 text-error' :'bg-muted text-muted-foreground'
                              }`}>
                                {item?.badge}
                              </span>
                            )}
                          </div>
                          <p className="text-xs font-caption text-muted-foreground truncate mt-0.5">
                            {item?.description}
                          </p>
                        </div>
                      )}
                    </a>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </nav>

        {/* Bottom Sections */}
        <div className="border-t border-border">
          <RealTimeMetricsPanel />
          <CulturalThemeSelector />
          <QuickActions />
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;