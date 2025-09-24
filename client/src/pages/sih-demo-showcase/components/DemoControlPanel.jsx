import React from 'react';
import { motion } from 'framer-motion';
import { Play, Pause, RotateCcw, Settings, Volume2, VolumeX, Zap } from 'lucide-react';
import Button from '../../../components/ui/Button';

const DemoControlPanel = ({ 
  isAutoPlaying, 
  onPlayPause, 
  onReset, 
  demoSpeed, 
  onSpeedChange, 
  scenarios, 
  selectedScenario, 
  onScenarioChange,
  demoProgress,
  currentScene,
  demoScenes,
  onSceneSelect,
  voiceEnabled,
  onVoiceToggle 
}) => {
  const speedOptions = [0.5, 1, 1.5, 2, 3];

  return (
    <motion.div
      initial={{ x: -50, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      transition={{ duration: 0.6 }}
      className="bg-card rounded-lg sacred-shadow p-6 space-y-6"
    >
      {/* Demo Controls */}
      <div>
        <h3 className="text-lg font-semibold mb-4 text-sw1049-primary flex items-center">
          <Settings className="mr-2 h-5 w-5" />
          Demo Controls
        </h3>
        
        <div className="space-y-4">
          {/* Play/Pause & Reset */}
          <div className="flex space-x-2">
            <Button
              onClick={onPlayPause}
              className={`flex-1 ${
                isAutoPlaying 
                  ? 'bg-error hover:bg-error/90' :'sw1049-gradient hover:opacity-90'
              }`}
            >
              {isAutoPlaying ? (
                <>
                  <Pause className="mr-2 h-4 w-4" />
                  Pause
                </>
              ) : (
                <>
                  <Play className="mr-2 h-4 w-4" />
                  Play
                </>
              )}
            </Button>
            
            <Button
              variant="outline"
              onClick={onReset}
              className="border-temple-gold hover:bg-temple-gold/10"
            >
              <RotateCcw className="h-4 w-4" />
            </Button>
          </div>

          {/* Demo Progress */}
          <div>
            <div className="flex justify-between text-sm text-muted-foreground mb-2">
              <span>Progress</span>
              <span>{Math.round(demoProgress)}%</span>
            </div>
            <div className="w-full bg-muted rounded-full h-2">
              <motion.div
                className="h-2 sw1049-gradient rounded-full demo-glow"
                initial={{ width: 0 }}
                animate={{ width: `${demoProgress}%` }}
                transition={{ duration: 0.3 }}
              />
            </div>
          </div>

          {/* Speed Control */}
          <div>
            <label className="text-sm font-medium mb-2 block">Demo Speed</label>
            <div className="grid grid-cols-5 gap-1">
              {speedOptions?.map(speed => (
                <Button
                  key={speed}
                  variant={demoSpeed === speed ? "default" : "outline"}
                  size="sm"
                  onClick={() => onSpeedChange(speed)}
                  className={`text-xs ${
                    demoSpeed === speed 
                      ? 'sw1049-gradient' :'border-temple-gold hover:bg-temple-gold/10'
                  }`}
                >
                  {speed}x
                </Button>
              ))}
            </div>
          </div>

          {/* Voice Toggle */}
          <Button
            variant="outline"
            onClick={() => onVoiceToggle(!voiceEnabled)}
            className={`w-full ${
              voiceEnabled 
                ? 'border-temple-gold bg-temple-gold/10' :'border-muted'
            }`}
          >
            {voiceEnabled ? (
              <>
                <Volume2 className="mr-2 h-4 w-4" />
                Voice On
              </>
            ) : (
              <>
                <VolumeX className="mr-2 h-4 w-4" />
                Voice Off
              </>
            )}
          </Button>
        </div>
      </div>
      {/* Scenario Selection */}
      <div>
        <h4 className="font-medium mb-3 text-primary flex items-center">
          <Zap className="mr-2 h-4 w-4" />
          Scenarios
        </h4>
        <div className="space-y-2">
          {scenarios?.map(scenario => (
            <motion.button
              key={scenario?.id}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => onScenarioChange(scenario?.id)}
              className={`w-full p-3 rounded-lg text-left transition-sacred ${
                selectedScenario === scenario?.id
                  ? 'sw1049-gradient text-white' :'bg-muted hover:bg-temple-gold/10'
              }`}
            >
              <div className="font-medium">{scenario?.name}</div>
              <div className="text-xs opacity-80">{scenario?.description}</div>
            </motion.button>
          ))}
        </div>
      </div>
      {/* Scene Quick Select */}
      <div>
        <h4 className="font-medium mb-3 text-primary">Quick Scene Jump</h4>
        <div className="grid grid-cols-2 gap-2">
          {demoScenes?.map((scene, index) => (
            <Button
              key={scene?.id}
              variant={currentScene === index ? "default" : "outline"}
              size="sm"
              onClick={() => onSceneSelect(index)}
              className={`text-xs ${
                currentScene === index 
                  ? 'sw1049-gradient' :'border-temple-gold hover:bg-temple-gold/10'
              }`}
            >
              {scene?.title?.split(' ')?.[0]}
            </Button>
          ))}
        </div>
      </div>
    </motion.div>
  );
};

export default DemoControlPanel;