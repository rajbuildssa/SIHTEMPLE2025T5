import React from 'react';
import Icon from '../../../components/AppIcon';
import Image from '../../../components/AppImage';

const TopDonorsPanel = ({ donors }) => {
  const formatCurrency = (amount) => `₹${amount?.toLocaleString('en-IN')}`;

  const getDonorTypeIcon = (type) => {
    switch (type) {
      case 'individual': return 'User';
      case 'corporate': return 'Building';
      case 'trust': return 'Shield';
      default: return 'Heart';
    }
  };

  const getDonorTypeBadge = (type) => {
    const badges = {
      individual: 'bg-blue-100 text-blue-800',
      corporate: 'bg-purple-100 text-purple-800',
      trust: 'bg-green-100 text-green-800'
    };
    return badges?.[type] || 'bg-gray-100 text-gray-800';
  };

  return (
    <div className="bg-card p-6 rounded-lg border border-border sacred-shadow-sm">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-heading font-semibold text-foreground">Top Donors</h3>
          <p className="text-sm font-caption text-muted-foreground">Highest contributors this month</p>
        </div>
        <Icon name="Award" size={20} className="text-secondary" />
      </div>
      <div className="space-y-4">
        {donors?.map((donor, index) => (
          <div key={donor?.id} className="flex items-center space-x-4 p-3 rounded-lg hover:bg-muted/50 transition-sacred">
            <div className="relative">
              <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                index === 0 ? 'bg-yellow-100' : index === 1 ? 'bg-gray-100' : index === 2 ? 'bg-orange-100' : 'bg-muted'
              }`}>
                {donor?.avatar ? (
                  <Image 
                    src={donor?.avatar} 
                    alt={donor?.name}
                    className="w-10 h-10 rounded-full object-cover"
                  />
                ) : (
                  <Icon name={getDonorTypeIcon(donor?.type)} size={20} className={
                    index === 0 ? 'text-yellow-600' : index === 1 ? 'text-gray-600' : index === 2 ? 'text-orange-600' : 'text-muted-foreground'
                  } />
                )}
              </div>
              {index < 3 && (
                <div className={`absolute -top-1 -right-1 w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold ${
                  index === 0 ? 'bg-yellow-500 text-white' : index === 1 ? 'bg-gray-500 text-white' : 'bg-orange-500 text-white'
                }`}>
                  {index + 1}
                </div>
              )}
            </div>

            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between">
                <h4 className="font-body font-medium text-sm text-foreground truncate">{donor?.name}</h4>
                <span className="font-mono font-bold text-sm text-primary">{formatCurrency(donor?.totalAmount)}</span>
              </div>
              <div className="flex items-center justify-between mt-1">
                <span className={`px-2 py-0.5 text-xs font-caption rounded-full ${getDonorTypeBadge(donor?.type)}`}>
                  {donor?.type}
                </span>
                <span className="text-xs font-caption text-muted-foreground">
                  {donor?.donationCount} donations
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
      <div className="mt-6 pt-4 border-t border-border">
        <div className="flex items-center justify-between text-sm">
          <span className="font-caption text-muted-foreground">Total from top 10</span>
          <span className="font-mono font-semibold text-foreground">
            ₹{donors?.reduce((sum, donor) => sum + donor?.totalAmount, 0)?.toLocaleString('en-IN')}
          </span>
        </div>
      </div>
    </div>
  );
};

export default TopDonorsPanel;