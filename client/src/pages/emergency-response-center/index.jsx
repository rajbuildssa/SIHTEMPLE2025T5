import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import Header from '../../components/ui/Header';
import Sidebar from '../../components/ui/Sidebar';
import AlertBanner from './components/AlertBanner';
import StatusMetricsRow from './components/StatusMetricsRow';
import IncidentTimeline from './components/IncidentTimeline';
import StaffDispatchTracker from './components/StaffDispatchTracker';
import CrowdDensityHeatMap from './components/CrowdDensityHeatMap';
import QuickActionPanel from './components/QuickActionPanel';

const EmergencyResponseCenter = () => {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [realTimeData, setRealTimeData] = useState({
    lastUpdate: new Date(),
    connectionStatus: 'connected'
  });

  // Mock data for active alerts
  const [activeAlerts] = useState([
    {
      id: 1,
      type: "Crowd Density",
      severity: "critical",
      message: "Main hall exceeding 95% capacity",
      timestamp: new Date(Date.now() - 300000)
    },
    {
      id: 2,
      type: "Medical",
      severity: "high",
      message: "Medical assistance required at entrance gate",
      timestamp: new Date(Date.now() - 600000)
    },
    {
      id: 3,
      type: "Security",
      severity: "medium",
      message: "Unauthorized access attempt detected",
      timestamp: new Date(Date.now() - 900000)
    }
  ]);

  // Mock system status
  const [systemStatus] = useState({
    overall: 'operational',
    network: 'operational',
    cctv: 'operational',
    communication: 'degraded',
    power: 'operational'
  });

  // Mock metrics data
  const [metrics] = useState({
    activeIncidents: {
      total: 7,
      critical: 2,
      high: 3,
      medium: 2,
      trend: -1
    },
    responseTime: {
      average: 4.2,
      target: 5.0,
      trend: -0.3
    },
    staffDeployment: {
      active: 18,
      total: 25,
      available: 7,
      trend: 2
    },
    crowdSafety: {
      score: 78,
      zones: 12,
      trend: -5
    },
    equipment: {
      operational: 23,
      total: 25,
      maintenance: 2,
      trend: 0
    },
    communication: {
      status: 'Operational',
      channels: 8,
      trend: 0
    }
  });

  // Mock incidents data
  const [incidents] = useState([
    {
      id: 1,
      title: "Medical Emergency - Visitor Collapse",
      description: "Elderly visitor collapsed near main shrine. Medical team dispatched. Paramedics en route with estimated arrival in 3 minutes.",
      type: "medical",
      severity: "critical",
      status: "in-progress",
      location: "Main Shrine Area",
      reporter: "Security Guard #12",
      timestamp: new Date(Date.now() - 180000),
      assignedTo: "Dr. Sharma (Medical Team Alpha)",
      eta: "2 minutes"
    },
    {
      id: 2,
      title: "Crowd Density Alert - Main Hall",
      description: "Main hall capacity exceeded 95%. Implementing crowd control measures. Additional security personnel deployed to manage visitor flow.",
      type: "crowd",
      severity: "critical",
      status: "escalated",
      location: "Main Prayer Hall",
      reporter: "Crowd Monitor System",
      timestamp: new Date(Date.now() - 300000),
      assignedTo: "Security Team Beta",
      eta: "Ongoing"
    },
    {
      id: 3,
      title: "Fire Safety System Malfunction",
      description: "Smoke detector in storage room showing false positives. Fire safety team investigating. No actual fire detected by thermal sensors.",
      type: "fire",
      severity: "high",
      status: "in-progress",
      location: "Storage Room B-12",
      reporter: "Maintenance Staff",
      timestamp: new Date(Date.now() - 450000),
      assignedTo: "Fire Safety Team",
      eta: "15 minutes"
    },
    {
      id: 4,
      title: "Security Breach Attempt",
      description: "Unauthorized individual attempted to access restricted area near administrative offices. Security personnel responded immediately.",
      type: "security",
      severity: "high",
      status: "resolved",
      location: "Administrative Wing",
      reporter: "CCTV Monitoring",
      timestamp: new Date(Date.now() - 600000),
      assignedTo: "Security Team Alpha",
      eta: "Resolved"
    },
    {
      id: 5,
      title: "Technical System Glitch",
      description: "Audio system experiencing intermittent failures in courtyard area. Technical team working on backup system activation.",
      type: "technical",
      severity: "medium",
      status: "in-progress",
      location: "Main Courtyard",
      reporter: "Audio Technician",
      timestamp: new Date(Date.now() - 720000),
      assignedTo: "Technical Support Team",
      eta: "10 minutes"
    },
    {
      id: 6,
      title: "Lost Child Report",
      description: "5-year-old child separated from parents in crowd. Security teams conducting search. Parents providing description and last known location.",
      type: "security",
      severity: "medium",
      status: "in-progress",
      location: "Temple Courtyard",
      reporter: "Visitor Services",
      timestamp: new Date(Date.now() - 840000),
      assignedTo: "Security Team Gamma",
      eta: "Ongoing search"
    }
  ]);

  // Mock staff data
  const [staffMembers] = useState([
    {
      id: 1,
      name: "Dr. Priya Sharma",
      role: "medical",
      badgeId: "MED001",
      status: "responding",
      experience: 8,
      currentLocation: "Main Shrine",
      currentIncident: "Medical Emergency #001",
      avgResponseTime: 3.2,
      lastSeen: new Date(Date.now() - 120000),
      skills: ["Emergency Medicine", "CPR", "Trauma Care"]
    },
    {
      id: 2,
      name: "Rajesh Kumar",
      role: "security",
      badgeId: "SEC012",
      status: "available",
      experience: 12,
      currentLocation: "Security Office",
      avgResponseTime: 2.8,
      lastSeen: new Date(Date.now() - 60000),
      skills: ["Crowd Control", "Emergency Response", "First Aid"]
    },
    {
      id: 3,
      name: "Amit Patel",
      role: "fire",
      badgeId: "FIRE05",
      status: "dispatched",
      experience: 6,
      currentLocation: "Storage Area",
      currentIncident: "Fire Safety Check #003",
      avgResponseTime: 4.1,
      lastSeen: new Date(Date.now() - 300000),
      skills: ["Fire Safety", "Hazmat", "Evacuation Procedures"]
    },
    {
      id: 4,
      name: "Sunita Verma",
      role: "coordinator",
      badgeId: "COORD02",
      status: "available",
      experience: 10,
      currentLocation: "Command Center",
      avgResponseTime: 1.5,
      lastSeen: new Date(Date.now() - 30000),
      skills: ["Crisis Management", "Communication", "Resource Allocation"]
    },
    {
      id: 5,
      name: "Vikram Singh",
      role: "security",
      badgeId: "SEC008",
      status: "responding",
      experience: 5,
      currentLocation: "Administrative Wing",
      currentIncident: "Security Breach #002",
      avgResponseTime: 3.5,
      lastSeen: new Date(Date.now() - 180000),
      skills: ["Surveillance", "Access Control", "Incident Response"]
    },
    {
      id: 6,
      name: "Dr. Anil Gupta",
      role: "medical",
      badgeId: "MED003",
      status: "off-duty",
      experience: 15,
      avgResponseTime: 2.9,
      lastSeen: new Date(Date.now() - 14400000),
      skills: ["Cardiology", "Emergency Medicine", "Medical Supervision"]
    }
  ]);

  // Mock crowd density zones
  const [crowdZones] = useState([
    {
      id: 1,
      name: "Main Prayer Hall",
      type: "main-hall",
      currentDensity: 2847,
      maxCapacity: 3000,
      flow: -15,
      lastUpdate: new Date(Date.now() - 30000),
      alerts: ["Capacity Warning", "High Density"]
    },
    {
      id: 2,
      name: "Temple Entrance",
      type: "entrance",
      currentDensity: 456,
      maxCapacity: 800,
      flow: 25,
      lastUpdate: new Date(Date.now() - 45000),
      alerts: []
    },
    {
      id: 3,
      name: "Main Courtyard",
      type: "courtyard",
      currentDensity: 1234,
      maxCapacity: 2000,
      flow: 8,
      lastUpdate: new Date(Date.now() - 60000),
      alerts: []
    },
    {
      id: 4,
      name: "Parking Area A",
      type: "parking",
      currentDensity: 187,
      maxCapacity: 200,
      flow: -3,
      lastUpdate: new Date(Date.now() - 90000),
      alerts: ["Near Capacity"]
    },
    {
      id: 5,
      name: "Queue Management Zone",
      type: "queue",
      currentDensity: 892,
      maxCapacity: 1200,
      flow: 12,
      lastUpdate: new Date(Date.now() - 120000),
      alerts: []
    },
    {
      id: 6,
      name: "Secondary Entrance",
      type: "entrance",
      currentDensity: 234,
      maxCapacity: 600,
      flow: 18,
      lastUpdate: new Date(Date.now() - 150000),
      alerts: []
    },
    {
      id: 7,
      name: "Prasadam Distribution",
      type: "queue",
      currentDensity: 567,
      maxCapacity: 800,
      flow: -8,
      lastUpdate: new Date(Date.now() - 180000),
      alerts: []
    },
    {
      id: 8,
      name: "Parking Area B",
      type: "parking",
      currentDensity: 156,
      maxCapacity: 180,
      flow: 2,
      lastUpdate: new Date(Date.now() - 210000),
      alerts: ["High Utilization"]
    }
  ]);

  // Simulate real-time updates
  useEffect(() => {
    const interval = setInterval(() => {
      setRealTimeData({
        lastUpdate: new Date(),
        connectionStatus: Math.random() > 0.1 ? 'connected' : 'reconnecting'
      });
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  const handleIncidentSelect = (incident) => {
    console.log('Selected incident:', incident);
  };

  const handleIncidentEscalate = (incident) => {
    console.log('Escalating incident:', incident);
  };

  const handleStaffDispatch = (staff) => {
    console.log('Dispatching staff:', staff);
  };

  const handleStaffRecall = (staff) => {
    console.log('Recalling staff:', staff);
  };

  const handleZoneSelect = (zone) => {
    console.log('Selected zone:', zone);
  };

  const handleCapacityAlert = (zone) => {
    console.log('Capacity alert for zone:', zone);
  };

  const handleEmergencyProtocol = (protocol) => {
    console.log('Activating emergency protocol:', protocol);
  };

  const handleBroadcast = (message) => {
    console.log('Broadcasting message:', message);
  };

  const handleSystemOverride = (action) => {
    console.log('System override action:', action);
  };

  return (
    <div className="min-h-screen bg-background">
      <Helmet>
        <title>Emergency Response Center - Temple Analytics</title>
        <meta name="description" content="Critical real-time monitoring for security personnel and medical staff, focusing on incident management and rapid response coordination." />
      </Helmet>
      <Header />
      <Sidebar 
        isCollapsed={sidebarCollapsed} 
        onToggle={() => setSidebarCollapsed(!sidebarCollapsed)} 
      />
      <main className={`transition-sacred ${sidebarCollapsed ? 'ml-16' : 'ml-64'} mt-20 p-6`}>
        <div className="max-w-full mx-auto space-y-6">
          {/* Alert Banner */}
          <AlertBanner 
            activeAlerts={activeAlerts}
            systemStatus={systemStatus}
          />

          {/* Status Metrics Row */}
          <StatusMetricsRow metrics={metrics} />

          {/* Main Content Grid */}
          <div className="grid grid-cols-1 xl:grid-cols-16 gap-6">
            {/* Incident Timeline - 12 columns */}
            <div className="xl:col-span-12">
              <IncidentTimeline
                incidents={incidents}
                onIncidentSelect={handleIncidentSelect}
                onEscalate={handleIncidentEscalate}
              />
            </div>

            {/* Staff Dispatch Tracker - 4 columns */}
            <div className="xl:col-span-4">
              <StaffDispatchTracker
                staffMembers={staffMembers}
                onDispatch={handleStaffDispatch}
                onRecall={handleStaffRecall}
              />
            </div>
          </div>

          {/* Crowd Density Heat Map - Full Width */}
          <CrowdDensityHeatMap
            zones={crowdZones}
            onZoneSelect={handleZoneSelect}
            onCapacityAlert={handleCapacityAlert}
          />

          {/* Quick Action Panel - Mobile/Tablet View */}
          <div className="xl:hidden">
            <QuickActionPanel
              onEmergencyProtocol={handleEmergencyProtocol}
              onBroadcast={handleBroadcast}
              onSystemOverride={handleSystemOverride}
            />
          </div>
        </div>

        {/* Fixed Quick Actions for Desktop */}
        <div className="hidden xl:block fixed right-6 top-32 w-80 max-h-[calc(100vh-10rem)] overflow-y-auto">
          <QuickActionPanel
            onEmergencyProtocol={handleEmergencyProtocol}
            onBroadcast={handleBroadcast}
            onSystemOverride={handleSystemOverride}
          />
        </div>

        {/* Connection Status Indicator */}
        <div className="fixed bottom-6 right-6 z-50">
          <div className={`flex items-center space-x-2 px-3 py-2 rounded-lg sacred-shadow-sm ${
            realTimeData?.connectionStatus === 'connected' ?'bg-success text-success-foreground' :'bg-warning text-warning-foreground'
          }`}>
            <div className={`w-2 h-2 rounded-full ${
              realTimeData?.connectionStatus === 'connected' ? 'bg-white breathing-animation' : 'bg-white'
            }`} />
            <span className="text-xs font-mono">
              {realTimeData?.connectionStatus === 'connected' ? 'Live' : 'Reconnecting...'}
            </span>
          </div>
        </div>
      </main>
    </div>
  );
};

export default EmergencyResponseCenter;