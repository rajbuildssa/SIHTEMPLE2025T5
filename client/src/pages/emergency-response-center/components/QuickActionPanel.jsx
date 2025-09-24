import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const QuickActionPanel = ({ onEmergencyProtocol, onBroadcast, onSystemOverride }) => {
  const [activeProtocol, setActiveProtocol] = useState(null);
  const [broadcastMessage, setBroadcastMessage] = useState('');
  const [showBroadcastForm, setShowBroadcastForm] = useState(false);

  const emergencyProtocols = [
    {
      id: 'fire',
      name: 'Fire Emergency',
      icon: 'Flame',
      color: 'bg-error text-error-foreground',
      description: 'Activate fire safety protocols'
    },
    {
      id: 'medical',
      name: 'Medical Emergency',
      icon: 'Heart',
      color: 'bg-warning text-warning-foreground',
      description: 'Deploy medical response teams'
    },
    {
      id: 'security',
      name: 'Security Alert',
      icon: 'Shield',
      color: 'bg-accent text-accent-foreground',
      description: 'Initiate security lockdown'
    },
    {
      id: 'evacuation',
      name: 'Evacuation',
      icon: 'Users',
      color: 'bg-error text-error-foreground',
      description: 'Begin controlled evacuation'
    }
  ];

  const quickActions = [
    {
      id: 'crowd-control',
      name: 'Crowd Control',
      icon: 'Users',
      description: 'Deploy crowd management teams'
    },
    {
      id: 'traffic-redirect',
      name: 'Traffic Redirect',
      icon: 'Navigation',
      description: 'Activate traffic diversion'
    },
    {
      id: 'facility-lockdown',
      name: 'Facility Lockdown',
      icon: 'Lock',
      description: 'Secure all entry points'
    },
    {
      id: 'backup-power',
      name: 'Backup Power',
      icon: 'Zap',
      description: 'Switch to emergency power'
    }
  ];

  const handleProtocolActivation = (protocol) => {
    setActiveProtocol(protocol);
    onEmergencyProtocol?.(protocol);
  };

  const handleBroadcast = () => {
    if (broadcastMessage?.trim()) {
      onBroadcast?.(broadcastMessage);
      setBroadcastMessage('');
      setShowBroadcastForm(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Emergency Protocols */}
      <div className="bg-card border border-border rounded-lg sacred-shadow-sm">
        <div className="p-4 border-b border-border">
          <div className="flex items-center space-x-2">
            <Icon name="AlertTriangle" size={20} className="text-error" />
            <h3 className="font-heading font-semibold text-lg">Emergency Protocols</h3>
          </div>
        </div>
        
        <div className="p-4 space-y-3">
          {emergencyProtocols?.map((protocol) => (
            <Button
              key={protocol?.id}
              variant={activeProtocol?.id === protocol?.id ? 'default' : 'outline'}
              className={`w-full justify-start h-auto p-4 ${
                activeProtocol?.id === protocol?.id ? protocol?.color : ''
              }`}
              onClick={() => handleProtocolActivation(protocol)}
            >
              <div className="flex items-center space-x-3 w-full">
                <Icon name={protocol?.icon} size={20} />
                <div className="text-left flex-1">
                  <div className="font-heading font-medium text-sm">
                    {protocol?.name}
                  </div>
                  <div className="text-xs font-caption opacity-80">
                    {protocol?.description}
                  </div>
                </div>
                {activeProtocol?.id === protocol?.id && (
                  <Icon name="CheckCircle" size={16} />
                )}
              </div>
            </Button>
          ))}
        </div>
      </div>
      {/* Quick Actions */}
      <div className="bg-card border border-border rounded-lg sacred-shadow-sm">
        <div className="p-4 border-b border-border">
          <div className="flex items-center space-x-2">
            <Icon name="Zap" size={20} className="text-primary" />
            <h3 className="font-heading font-semibold text-lg">Quick Actions</h3>
          </div>
        </div>
        
        <div className="p-4 grid grid-cols-1 gap-2">
          {quickActions?.map((action) => (
            <Button
              key={action?.id}
              variant="ghost"
              className="w-full justify-start h-auto p-3"
              onClick={() => onSystemOverride?.(action)}
            >
              <div className="flex items-center space-x-3 w-full">
                <Icon name={action?.icon} size={16} className="text-muted-foreground" />
                <div className="text-left flex-1">
                  <div className="font-heading font-medium text-sm">
                    {action?.name}
                  </div>
                  <div className="text-xs font-caption text-muted-foreground">
                    {action?.description}
                  </div>
                </div>
                <Icon name="ChevronRight" size={14} className="text-muted-foreground" />
              </div>
            </Button>
          ))}
        </div>
      </div>
      {/* Broadcast System */}
      <div className="bg-card border border-border rounded-lg sacred-shadow-sm">
        <div className="p-4 border-b border-border">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Icon name="Radio" size={20} className="text-primary" />
              <h3 className="font-heading font-semibold text-lg">Broadcast System</h3>
            </div>
            
            <Button
              variant="outline"
              size="sm"
              iconName={showBroadcastForm ? "X" : "MessageCircle"}
              iconPosition="left"
              onClick={() => setShowBroadcastForm(!showBroadcastForm)}
            >
              {showBroadcastForm ? 'Cancel' : 'New Message'}
            </Button>
          </div>
        </div>
        
        <div className="p-4">
          {showBroadcastForm ? (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-caption text-muted-foreground mb-2">
                  Broadcast Message
                </label>
                <textarea
                  value={broadcastMessage}
                  onChange={(e) => setBroadcastMessage(e?.target?.value)}
                  placeholder="Enter emergency broadcast message..."
                  className="w-full px-3 py-2 border border-border rounded-md bg-background text-foreground font-body text-sm resize-none"
                  rows={4}
                />
              </div>
              
              <div className="flex space-x-2">
                <Button
                  variant="default"
                  className="flex-1"
                  iconName="Send"
                  iconPosition="left"
                  onClick={handleBroadcast}
                  disabled={!broadcastMessage?.trim()}
                >
                  Send Broadcast
                </Button>
                
                <Button
                  variant="outline"
                  iconName="Volume2"
                  onClick={() => {
                    // Handle audio announcement
                  }}
                  title="Audio Announcement"
                />
              </div>
            </div>
          ) : (
            <div className="space-y-3">
              <Button
                variant="ghost"
                className="w-full justify-start"
                iconName="Volume2"
                iconPosition="left"
                onClick={() => onBroadcast?.('Temple closing in 30 minutes. Please complete your prayers.')}
              >
                Temple Closing Announcement
              </Button>
              
              <Button
                variant="ghost"
                className="w-full justify-start"
                iconName="Users"
                iconPosition="left"
                onClick={() => onBroadcast?.('High crowd density detected. Please maintain social distancing.')}
              >
                Crowd Management Alert
              </Button>
              
              <Button
                variant="ghost"
                className="w-full justify-start"
                iconName="AlertTriangle"
                iconPosition="left"
                onClick={() => onBroadcast?.('Emergency services are responding to an incident. Please remain calm.')}
              >
                Emergency Response Update
              </Button>
            </div>
          )}
        </div>
      </div>
      {/* System Status */}
      <div className="bg-card border border-border rounded-lg sacred-shadow-sm">
        <div className="p-4 border-b border-border">
          <div className="flex items-center space-x-2">
            <Icon name="Settings" size={20} className="text-primary" />
            <h3 className="font-heading font-semibold text-lg">System Status</h3>
          </div>
        </div>
        
        <div className="p-4 space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Icon name="Wifi" size={16} className="text-success" />
              <span className="text-sm font-caption">Network</span>
            </div>
            <span className="text-sm font-mono text-success">Online</span>
          </div>
          
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Icon name="Camera" size={16} className="text-success" />
              <span className="text-sm font-caption">CCTV System</span>
            </div>
            <span className="text-sm font-mono text-success">24/24 Active</span>
          </div>
          
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Icon name="Radio" size={16} className="text-warning" />
              <span className="text-sm font-caption">Communication</span>
            </div>
            <span className="text-sm font-mono text-warning">2/3 Channels</span>
          </div>
          
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Icon name="Zap" size={16} className="text-success" />
              <span className="text-sm font-caption">Power Systems</span>
            </div>
            <span className="text-sm font-mono text-success">Normal</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default QuickActionPanel;