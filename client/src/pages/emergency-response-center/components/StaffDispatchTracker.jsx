import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const StaffDispatchTracker = ({ staffMembers, onDispatch, onRecall }) => {
  const [selectedStaff, setSelectedStaff] = useState(null);
  const [filterStatus, setFilterStatus] = useState('all');

  const getStatusColor = (status) => {
    switch (status) {
      case 'available': return 'text-success bg-success/10 border-success';
      case 'dispatched': return 'text-warning bg-warning/10 border-warning';
      case 'responding': return 'text-primary bg-primary/10 border-primary';
      case 'off-duty': return 'text-muted-foreground bg-muted/10 border-muted';
      default: return 'text-foreground bg-background border-border';
    }
  };

  const getRoleIcon = (role) => {
    switch (role) {
      case 'medical': return 'Heart';
      case 'security': return 'Shield';
      case 'fire': return 'Flame';
      case 'technical': return 'Wrench';
      case 'coordinator': return 'Radio';
      default: return 'User';
    }
  };

  const filteredStaff = filterStatus === 'all' 
    ? staffMembers 
    : staffMembers?.filter(staff => staff?.status === filterStatus);

  const formatResponseTime = (time) => {
    if (!time) return 'N/A';
    return `${time}m`;
  };

  const formatLastSeen = (timestamp) => {
    const now = new Date();
    const lastSeen = new Date(timestamp);
    const diffMinutes = Math.floor((now - lastSeen) / (1000 * 60));
    
    if (diffMinutes < 1) return 'Just now';
    if (diffMinutes < 60) return `${diffMinutes}m ago`;
    const hours = Math.floor(diffMinutes / 60);
    return `${hours}h ago`;
  };

  return (
    <div className="bg-card border border-border rounded-lg sacred-shadow-sm">
      <div className="p-4 border-b border-border">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-2">
            <Icon name="Users" size={20} className="text-primary" />
            <h3 className="font-heading font-semibold text-lg">Staff Dispatch</h3>
          </div>
          
          <Button variant="outline" size="sm" iconName="Plus" iconPosition="left">
            Add Staff
          </Button>
        </div>
        
        <div className="flex items-center space-x-2">
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e?.target?.value)}
            className="px-3 py-1 border border-border rounded-md text-sm font-caption bg-background flex-1"
          >
            <option value="all">All Status</option>
            <option value="available">Available</option>
            <option value="dispatched">Dispatched</option>
            <option value="responding">Responding</option>
            <option value="off-duty">Off Duty</option>
          </select>
        </div>
      </div>
      <div className="max-h-96 overflow-y-auto">
        <div className="p-4 space-y-3">
          {filteredStaff?.map((staff) => (
            <div
              key={staff?.id}
              className={`border rounded-lg p-3 cursor-pointer transition-hover hover-lift ${
                selectedStaff?.id === staff?.id ? 'ring-2 ring-primary' : ''
              } ${getStatusColor(staff?.status)}`}
              onClick={() => setSelectedStaff(staff)}
            >
              <div className="flex items-start justify-between">
                <div className="flex items-start space-x-3 flex-1">
                  <div className="w-10 h-10 bg-gradient-to-br from-primary to-secondary rounded-full flex items-center justify-center">
                    <Icon name={getRoleIcon(staff?.role)} size={16} className="text-white" />
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center space-x-2 mb-1">
                      <h4 className="font-heading font-medium text-sm truncate">
                        {staff?.name}
                      </h4>
                      <span className="px-2 py-0.5 bg-background/50 rounded-full text-xs font-mono">
                        {staff?.role?.toUpperCase()}
                      </span>
                    </div>
                    
                    <div className="space-y-1">
                      <div className="flex items-center space-x-4 text-xs font-mono text-muted-foreground">
                        <span>ID: {staff?.badgeId}</span>
                        <span>Exp: {staff?.experience}y</span>
                        {staff?.currentLocation && (
                          <span>Location: {staff?.currentLocation}</span>
                        )}
                      </div>
                      
                      {staff?.currentIncident && (
                        <div className="flex items-center space-x-2 text-xs">
                          <Icon name="AlertCircle" size={12} className="text-warning" />
                          <span className="font-caption text-warning">
                            Assigned: {staff?.currentIncident}
                          </span>
                        </div>
                      )}
                      
                      <div className="flex items-center space-x-4 text-xs font-caption text-muted-foreground">
                        <span>Avg Response: {formatResponseTime(staff?.avgResponseTime)}</span>
                        <span>Last Seen: {formatLastSeen(staff?.lastSeen)}</span>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="flex flex-col items-end space-y-2 ml-4">
                  <span className={`px-2 py-1 rounded-full text-xs font-mono ${getStatusColor(staff?.status)}`}>
                    {staff?.status?.toUpperCase()}
                  </span>
                  
                  <div className="flex space-x-1">
                    {staff?.status === 'available' && (
                      <Button
                        variant="ghost"
                        size="xs"
                        iconName="Send"
                        onClick={(e) => {
                          e?.stopPropagation();
                          onDispatch?.(staff);
                        }}
                        title="Dispatch"
                      />
                    )}
                    
                    {(staff?.status === 'dispatched' || staff?.status === 'responding') && (
                      <Button
                        variant="ghost"
                        size="xs"
                        iconName="RotateCcw"
                        onClick={(e) => {
                          e?.stopPropagation();
                          onRecall?.(staff);
                        }}
                        title="Recall"
                      />
                    )}
                    
                    <Button
                      variant="ghost"
                      size="xs"
                      iconName="MessageCircle"
                      onClick={(e) => {
                        e?.stopPropagation();
                        // Handle communication
                      }}
                      title="Contact"
                    />
                    
                    <Button
                      variant="ghost"
                      size="xs"
                      iconName="MapPin"
                      onClick={(e) => {
                        e?.stopPropagation();
                        // Handle location tracking
                      }}
                      title="Track Location"
                    />
                  </div>
                </div>
              </div>
              
              {staff?.skills && staff?.skills?.length > 0 && (
                <div className="mt-3 pt-3 border-t border-border/50">
                  <div className="flex flex-wrap gap-1">
                    {staff?.skills?.map((skill, index) => (
                      <span
                        key={index}
                        className="px-2 py-0.5 bg-muted/50 text-muted-foreground rounded text-xs font-caption"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
      <div className="p-4 border-t border-border">
        <div className="grid grid-cols-2 gap-4 text-center">
          <div>
            <div className="text-lg font-heading font-bold text-success">
              {staffMembers?.filter(s => s?.status === 'available')?.length}
            </div>
            <div className="text-xs font-caption text-muted-foreground">Available</div>
          </div>
          <div>
            <div className="text-lg font-heading font-bold text-warning">
              {staffMembers?.filter(s => s?.status === 'dispatched' || s?.status === 'responding')?.length}
            </div>
            <div className="text-xs font-caption text-muted-foreground">Active</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StaffDispatchTracker;