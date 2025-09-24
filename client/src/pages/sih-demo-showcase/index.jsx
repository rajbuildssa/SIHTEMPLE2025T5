import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

import Button from '../../components/ui/Button';
import DemoHeader from './components/DemoHeader';
import DemoControlPanel from './components/DemoControlPanel';
import MainVisualization from './components/MainVisualization';
import DemoNarrative from './components/DemoNarrative';
import LiveMetricsTicker from './components/LiveMetricsTicker';

const SIHDemoShowcase = () => {
  const [isAutoPlaying, setIsAutoPlaying] = useState(false);
  const [currentScene, setCurrentScene] = useState(0);
  const [demoSpeed, setDemoSpeed] = useState(1);
  const [selectedScenario, setSelectedScenario] = useState('normal');
  const [demoProgress, setDemoProgress] = useState(0);
  const [voiceEnabled, setVoiceEnabled] = useState(false);

  const demoScenes = [
    { id: 'operations', title: 'Temple Operations Overview', duration: 30 },
    { id: 'crowd', title: 'Crowd Analytics', duration: 30 },
    { id: 'emergency', title: 'Emergency Response', duration: 30 },
    { id: 'financial', title: 'Financial Analytics', duration: 30 }
  ];

  const scenarios = [
    { id: 'normal', name: 'Normal Day', description: 'Regular temple operations' },
    { id: 'festival', name: 'Festival', description: 'High crowd scenarios' },
    { id: 'emergency', name: 'Emergency', description: 'Crisis management' }
  ];

  // Auto demo progression
  useEffect(() => {
    if (!isAutoPlaying) return;

    const interval = setInterval(() => {
      setDemoProgress(prev => {
        const newProgress = prev + (100 / (demoScenes?.[currentScene]?.duration || 30)) * demoSpeed;
        if (newProgress >= 100) {
          setCurrentScene((prevScene) => (prevScene + 1) % demoScenes?.length);
          return 0;
        }
        return newProgress;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [isAutoPlaying, currentScene, demoSpeed, demoScenes]);

  const handlePlayPause = () => {
    setIsAutoPlaying(!isAutoPlaying);
  };

  const handleReset = () => {
    setIsAutoPlaying(false);
    setCurrentScene(0);
    setDemoProgress(0);
  };

  const handleSceneSelect = (sceneIndex) => {
    setCurrentScene(sceneIndex);
    setDemoProgress(0);
  };

  const handleSpeedChange = (speed) => {
    setDemoSpeed(speed);
  };

  const handleScenarioChange = (scenario) => {
    setSelectedScenario(scenario);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-surface to-muted">
      {/* SIH Header */}
      <DemoHeader teamId="SW1049" />
      <div className="container mx-auto px-4 py-8">
        {/* Main Demo Area */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Demo Control Panel */}
          <div className="lg:col-span-3">
            <DemoControlPanel
              isAutoPlaying={isAutoPlaying}
              onPlayPause={handlePlayPause}
              onReset={handleReset}
              demoSpeed={demoSpeed}
              onSpeedChange={handleSpeedChange}
              scenarios={scenarios}
              selectedScenario={selectedScenario}
              onScenarioChange={handleScenarioChange}
              demoProgress={demoProgress}
              currentScene={currentScene}
              demoScenes={demoScenes}
              onSceneSelect={handleSceneSelect}
              voiceEnabled={voiceEnabled}
              onVoiceToggle={setVoiceEnabled}
            />
          </div>

          {/* Main Visualization Area */}
          <div className="lg:col-span-6">
            <MainVisualization
              currentScene={demoScenes?.[currentScene]}
              scenario={selectedScenario}
              isAutoPlaying={isAutoPlaying}
              demoProgress={demoProgress}
            />
          </div>

          {/* Demo Narrative Panel */}
          <div className="lg:col-span-3">
            <DemoNarrative
              currentScene={demoScenes?.[currentScene]}
              scenario={selectedScenario}
              voiceEnabled={voiceEnabled}
            />
          </div>
        </div>

        {/* Live Metrics Ticker */}
        <div className="mt-8">
          <LiveMetricsTicker
            scenario={selectedScenario}
            isPlaying={isAutoPlaying}
          />
        </div>

        {/* Scene Navigation */}
        <div className="mt-8 bg-card rounded-lg p-6 sacred-shadow">
          <h3 className="text-lg font-semibold mb-4 text-sw1049-primary">Demo Scenes</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {demoScenes?.map((scene, index) => (
              <motion.div
                key={scene?.id}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <Button
                  variant={currentScene === index ? "default" : "outline"}
                  size="sm"
                  fullWidth
                  onClick={() => handleSceneSelect(index)}
                  className={`${
                    currentScene === index 
                      ? 'sw1049-gradient text-white' :'border-temple-gold hover:bg-temple-gold/10'
                  }`}
                >
                  {scene?.title}
                </Button>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SIHDemoShowcase;