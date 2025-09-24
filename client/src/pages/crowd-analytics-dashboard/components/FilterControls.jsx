import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Select from '../../../components/ui/Select';

const FilterControls = ({ filters, onFiltersChange }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const dateRangeOptions = [
    { value: 'today', label: 'Today' },
    { value: 'yesterday', label: 'Yesterday' },
    { value: 'last7days', label: 'Last 7 Days' },
    { value: 'last30days', label: 'Last 30 Days' },
    { value: 'thisMonth', label: 'This Month' },
    { value: 'lastMonth', label: 'Last Month' },
    { value: 'thisYear', label: 'This Year' },
    { value: 'custom', label: 'Custom Range' }
  ];

  const seasonalPresets = [
    { value: 'all', label: 'All Seasons' },
    { value: 'summer', label: 'Summer (Mar-Jun)' },
    { value: 'monsoon', label: 'Monsoon (Jul-Sep)' },
    { value: 'winter', label: 'Winter (Oct-Feb)' },
    { value: 'festival', label: 'Festival Seasons' }
  ];

  const weatherOptions = [
    { value: 'all', label: 'All Weather' },
    { value: 'sunny', label: 'Sunny Days' },
    { value: 'rainy', label: 'Rainy Days' },
    { value: 'cloudy', label: 'Cloudy Days' },
    { value: 'extreme', label: 'Extreme Weather' }
  ];

  const comparisonOptions = [
    { value: 'none', label: 'No Comparison' },
    { value: 'previousPeriod', label: 'Previous Period' },
    { value: 'lastYear', label: 'Same Period Last Year' },
    { value: 'average', label: 'Historical Average' },
    { value: 'benchmark', label: 'Benchmark Period' }
  ];

  const handleFilterChange = (key, value) => {
    onFiltersChange({
      ...filters,
      [key]: value
    });
  };

  const resetFilters = () => {
    onFiltersChange({
      dateRange: 'last7days',
      seasonal: 'all',
      festivalImpact: false,
      weatherCorrelation: 'all',
      comparisonMode: 'none'
    });
  };

  const exportData = (format) => {
    // Mock export functionality
    console.log(`Exporting data in ${format} format`);
  };

  return (
    <div className="bg-card rounded-lg p-6 sacred-shadow-sm border border-border mb-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-3">
          <Icon name="Filter" size={20} className="text-primary" />
          <h2 className="font-heading font-semibold text-lg text-card-foreground">
            Analytics Filters
          </h2>
        </div>
        <div className="flex items-center space-x-2">
          <Button
            variant="ghost"
            size="sm"
            iconName={isExpanded ? "ChevronUp" : "ChevronDown"}
            iconPosition="right"
            onClick={() => setIsExpanded(!isExpanded)}
          >
            {isExpanded ? 'Collapse' : 'Expand'}
          </Button>
          <Button
            variant="outline"
            size="sm"
            iconName="RotateCcw"
            iconPosition="left"
            onClick={resetFilters}
          >
            Reset
          </Button>
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
        <Select
          label="Date Range"
          options={dateRangeOptions}
          value={filters?.dateRange}
          onChange={(value) => handleFilterChange('dateRange', value)}
          className="w-full"
        />

        <Select
          label="Seasonal Filter"
          options={seasonalPresets}
          value={filters?.seasonal}
          onChange={(value) => handleFilterChange('seasonal', value)}
          className="w-full"
        />

        <Select
          label="Weather Impact"
          options={weatherOptions}
          value={filters?.weatherCorrelation}
          onChange={(value) => handleFilterChange('weatherCorrelation', value)}
          className="w-full"
        />

        <Select
          label="Comparison Mode"
          options={comparisonOptions}
          value={filters?.comparisonMode}
          onChange={(value) => handleFilterChange('comparisonMode', value)}
          className="w-full"
        />
      </div>
      {isExpanded && (
        <div className="border-t border-border pt-4 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <label className="flex items-center space-x-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={filters?.festivalImpact}
                  onChange={(e) => handleFilterChange('festivalImpact', e?.target?.checked)}
                  className="w-4 h-4 text-primary bg-background border-border rounded focus:ring-primary focus:ring-2"
                />
                <span className="text-sm font-body text-card-foreground">
                  Include Festival Impact Analysis
                </span>
              </label>
              
              <label className="flex items-center space-x-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={filters?.realTimeUpdates}
                  onChange={(e) => handleFilterChange('realTimeUpdates', e?.target?.checked)}
                  className="w-4 h-4 text-primary bg-background border-border rounded focus:ring-primary focus:ring-2"
                />
                <span className="text-sm font-body text-card-foreground">
                  Real-time Updates (5min)
                </span>
              </label>
            </div>

            <div className="flex items-center space-x-2">
              <Button
                variant="outline"
                size="sm"
                iconName="Download"
                iconPosition="left"
                onClick={() => exportData('pdf')}
              >
                Export PDF
              </Button>
              <Button
                variant="outline"
                size="sm"
                iconName="FileSpreadsheet"
                iconPosition="left"
                onClick={() => exportData('csv')}
              >
                Export CSV
              </Button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-body text-card-foreground">
                Confidence Threshold
              </label>
              <input
                type="range"
                min="50"
                max="99"
                value={filters?.confidenceThreshold || 85}
                onChange={(e) => handleFilterChange('confidenceThreshold', parseInt(e?.target?.value))}
                className="w-full h-2 bg-muted rounded-lg appearance-none cursor-pointer"
              />
              <div className="flex justify-between text-xs font-caption text-muted-foreground">
                <span>50%</span>
                <span className="text-primary font-medium">
                  {filters?.confidenceThreshold || 85}%
                </span>
                <span>99%</span>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-body text-card-foreground">
                Prediction Horizon (Hours)
              </label>
              <input
                type="range"
                min="1"
                max="168"
                value={filters?.predictionHorizon || 24}
                onChange={(e) => handleFilterChange('predictionHorizon', parseInt(e?.target?.value))}
                className="w-full h-2 bg-muted rounded-lg appearance-none cursor-pointer"
              />
              <div className="flex justify-between text-xs font-caption text-muted-foreground">
                <span>1h</span>
                <span className="text-primary font-medium">
                  {filters?.predictionHorizon || 24}h
                </span>
                <span>168h</span>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-body text-card-foreground">
                Data Granularity
              </label>
              <select
                value={filters?.granularity || 'hourly'}
                onChange={(e) => handleFilterChange('granularity', e?.target?.value)}
                className="w-full px-3 py-2 bg-background border border-border rounded-lg text-sm font-body text-card-foreground focus:outline-none focus:ring-2 focus:ring-primary"
              >
                <option value="15min">15 Minutes</option>
                <option value="30min">30 Minutes</option>
                <option value="hourly">Hourly</option>
                <option value="daily">Daily</option>
                <option value="weekly">Weekly</option>
              </select>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default FilterControls;