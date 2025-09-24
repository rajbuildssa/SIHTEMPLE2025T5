import React, { useState, useEffect } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const MLPredictionPanel = ({ predictionData }) => {
  const [selectedModel, setSelectedModel] = useState('ensemble');
  const [confidenceLevel, setConfidenceLevel] = useState(85);
  const [modelMetrics, setModelMetrics] = useState({
    accuracy: 92.5,
    precision: 89.3,
    recall: 94.1,
    f1Score: 91.6,
    lastTrained: new Date(Date.now() - 86400000 * 2), // 2 days ago
    dataPoints: 125000,
    modelVersion: 'v2.3.1'
  });

  const models = [
    {
      id: 'ensemble',
      name: 'Ensemble Model',
      description: 'Combined LSTM + Random Forest',
      accuracy: 92.5,
      confidence: 94.2,
      status: 'active'
    },
    {
      id: 'lstm',
      name: 'LSTM Neural Network',
      description: 'Deep learning time series',
      accuracy: 89.7,
      confidence: 91.8,
      status: 'active'
    },
    {
      id: 'randomforest',
      name: 'Random Forest',
      description: 'Tree-based ensemble',
      accuracy: 87.3,
      confidence: 88.9,
      status: 'backup'
    },
    {
      id: 'arima',
      name: 'ARIMA',
      description: 'Statistical forecasting',
      accuracy: 82.1,
      confidence: 85.4,
      status: 'legacy'
    }
  ];

  const predictionScenarios = [
    {
      id: 'normal',
      name: 'Normal Day',
      probability: 0.75,
      expectedVisitors: 1250,
      peakHour: '10:00',
      confidence: 92
    },
    {
      id: 'festival',
      name: 'Festival Impact',
      probability: 0.15,
      expectedVisitors: 2800,
      peakHour: '08:00',
      confidence: 87
    },
    {
      id: 'weather',
      name: 'Weather Disruption',
      probability: 0.08,
      expectedVisitors: 650,
      peakHour: '11:00',
      confidence: 79
    },
    {
      id: 'special',
      name: 'Special Event',
      probability: 0.02,
      expectedVisitors: 4200,
      peakHour: '07:00',
      confidence: 94
    }
  ];

  const getModelStatusColor = (status) => {
    switch (status) {
      case 'active': return 'text-success';
      case 'backup': return 'text-warning';
      case 'legacy': return 'text-muted-foreground';
      default: return 'text-muted-foreground';
    }
  };

  const getModelStatusBg = (status) => {
    switch (status) {
      case 'active': return 'bg-success/10';
      case 'backup': return 'bg-warning/10';
      case 'legacy': return 'bg-muted';
      default: return 'bg-muted';
    }
  };

  const getConfidenceColor = (confidence) => {
    if (confidence >= 90) return 'text-success';
    if (confidence >= 80) return 'text-warning';
    return 'text-error';
  };

  const retrainModel = () => {
    // Mock retrain functionality
    console.log('Retraining model...');
  };

  const exportPredictions = () => {
    // Mock export functionality
    console.log('Exporting predictions...');
  };

  return (
    <div className="space-y-6">
      {/* Model Selection */}
      <div className="bg-card rounded-lg p-6 sacred-shadow-sm border border-border">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-3">
            <Icon name="Brain" size={20} className="text-primary" />
            <div>
              <h3 className="font-heading font-semibold text-lg text-card-foreground">
                ML Model Performance
              </h3>
              <p className="text-sm font-caption text-muted-foreground">
                Prediction accuracy and model metrics
              </p>
            </div>
          </div>
          <Button
            variant="outline"
            size="sm"
            iconName="RefreshCw"
            iconPosition="left"
            onClick={retrainModel}
          >
            Retrain
          </Button>
        </div>

        <div className="space-y-4">
          {models?.map((model) => (
            <div
              key={model?.id}
              className={`p-4 rounded-lg border cursor-pointer transition-sacred ${
                selectedModel === model?.id
                  ? 'border-primary bg-primary/5' :'border-border hover:border-primary/50'
              }`}
              onClick={() => setSelectedModel(model?.id)}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className={`w-3 h-3 rounded-full ${
                    model?.status === 'active' ? 'bg-success breathing-animation' : 
                    model?.status === 'backup' ? 'bg-warning' : 'bg-muted-foreground'
                  }`} />
                  <div>
                    <h4 className="font-heading font-medium text-card-foreground">
                      {model?.name}
                    </h4>
                    <p className="text-sm font-caption text-muted-foreground">
                      {model?.description}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-lg font-mono font-bold text-card-foreground">
                    {model?.accuracy}%
                  </div>
                  <div className="text-xs font-caption text-muted-foreground">
                    Accuracy
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
      {/* Model Metrics */}
      <div className="bg-card rounded-lg p-6 sacred-shadow-sm border border-border">
        <div className="flex items-center space-x-3 mb-4">
          <Icon name="BarChart3" size={20} className="text-accent" />
          <h3 className="font-heading font-semibold text-lg text-card-foreground">
            Performance Metrics
          </h3>
        </div>

        <div className="grid grid-cols-2 gap-4 mb-6">
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm font-body text-muted-foreground">Accuracy</span>
              <span className="font-mono font-medium text-card-foreground">
                {modelMetrics?.accuracy}%
              </span>
            </div>
            <div className="w-full bg-muted rounded-full h-2">
              <div 
                className="h-2 bg-success rounded-full transition-sacred"
                style={{ width: `${modelMetrics?.accuracy}%` }}
              />
            </div>
          </div>

          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm font-body text-muted-foreground">Precision</span>
              <span className="font-mono font-medium text-card-foreground">
                {modelMetrics?.precision}%
              </span>
            </div>
            <div className="w-full bg-muted rounded-full h-2">
              <div 
                className="h-2 bg-primary rounded-full transition-sacred"
                style={{ width: `${modelMetrics?.precision}%` }}
              />
            </div>
          </div>

          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm font-body text-muted-foreground">Recall</span>
              <span className="font-mono font-medium text-card-foreground">
                {modelMetrics?.recall}%
              </span>
            </div>
            <div className="w-full bg-muted rounded-full h-2">
              <div 
                className="h-2 bg-warning rounded-full transition-sacred"
                style={{ width: `${modelMetrics?.recall}%` }}
              />
            </div>
          </div>

          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm font-body text-muted-foreground">F1 Score</span>
              <span className="font-mono font-medium text-card-foreground">
                {modelMetrics?.f1Score}%
              </span>
            </div>
            <div className="w-full bg-muted rounded-full h-2">
              <div 
                className="h-2 bg-accent rounded-full transition-sacred"
                style={{ width: `${modelMetrics?.f1Score}%` }}
              />
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
          <div className="flex items-center space-x-2">
            <Icon name="Calendar" size={16} className="text-muted-foreground" />
            <div>
              <span className="text-muted-foreground">Last Trained:</span>
              <div className="font-mono text-card-foreground">
                {modelMetrics?.lastTrained?.toLocaleDateString('en-IN')}
              </div>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <Icon name="Database" size={16} className="text-muted-foreground" />
            <div>
              <span className="text-muted-foreground">Data Points:</span>
              <div className="font-mono text-card-foreground">
                {modelMetrics?.dataPoints?.toLocaleString('en-IN')}
              </div>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <Icon name="Tag" size={16} className="text-muted-foreground" />
            <div>
              <span className="text-muted-foreground">Version:</span>
              <div className="font-mono text-card-foreground">
                {modelMetrics?.modelVersion}
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* Prediction Scenarios */}
      <div className="bg-card rounded-lg p-6 sacred-shadow-sm border border-border">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-3">
            <Icon name="Zap" size={20} className="text-secondary" />
            <h3 className="font-heading font-semibold text-lg text-card-foreground">
              Prediction Scenarios
            </h3>
          </div>
          <Button
            variant="outline"
            size="sm"
            iconName="Download"
            iconPosition="left"
            onClick={exportPredictions}
          >
            Export
          </Button>
        </div>

        <div className="space-y-3">
          {predictionScenarios?.map((scenario) => (
            <div key={scenario?.id} className="p-4 bg-muted rounded-lg border border-border">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-primary rounded-full" />
                  <h4 className="font-heading font-medium text-card-foreground">
                    {scenario?.name}
                  </h4>
                  <span className={`text-sm font-mono ${getConfidenceColor(scenario?.confidence)}`}>
                    {scenario?.confidence}% confidence
                  </span>
                </div>
                <div className="text-right">
                  <div className="text-sm font-mono text-card-foreground">
                    {(scenario?.probability * 100)?.toFixed(1)}% probability
                  </div>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div className="flex items-center space-x-2">
                  <Icon name="Users" size={14} className="text-primary" />
                  <span className="text-muted-foreground">Expected:</span>
                  <span className="font-mono text-card-foreground">
                    {scenario?.expectedVisitors?.toLocaleString('en-IN')}
                  </span>
                </div>
                <div className="flex items-center space-x-2">
                  <Icon name="Clock" size={14} className="text-accent" />
                  <span className="text-muted-foreground">Peak:</span>
                  <span className="font-mono text-card-foreground">
                    {scenario?.peakHour}
                  </span>
                </div>
              </div>
              
              <div className="mt-3">
                <div className="w-full bg-background rounded-full h-2">
                  <div 
                    className="h-2 bg-primary rounded-full transition-sacred"
                    style={{ width: `${scenario?.probability * 100}%` }}
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
      {/* Confidence Interval Adjustment */}
      <div className="bg-card rounded-lg p-6 sacred-shadow-sm border border-border">
        <div className="flex items-center space-x-3 mb-4">
          <Icon name="Target" size={20} className="text-warning" />
          <h3 className="font-heading font-semibold text-lg text-card-foreground">
            Confidence Settings
          </h3>
        </div>

        <div className="space-y-4">
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-sm font-body text-card-foreground">
                Confidence Threshold
              </label>
              <span className="text-sm font-mono text-primary font-medium">
                {confidenceLevel}%
              </span>
            </div>
            <input
              type="range"
              min="50"
              max="99"
              value={confidenceLevel}
              onChange={(e) => setConfidenceLevel(parseInt(e?.target?.value))}
              className="w-full h-2 bg-muted rounded-lg appearance-none cursor-pointer"
            />
            <div className="flex justify-between text-xs font-caption text-muted-foreground mt-1">
              <span>50% (Low)</span>
              <span>75% (Medium)</span>
              <span>90% (High)</span>
              <span>99% (Very High)</span>
            </div>
          </div>

          <div className="p-3 bg-muted rounded-lg">
            <div className="text-sm font-body text-card-foreground">
              <strong>Impact:</strong> Higher confidence levels reduce false positives but may miss edge cases. 
              Current setting balances accuracy with sensitivity for temple operations.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MLPredictionPanel;