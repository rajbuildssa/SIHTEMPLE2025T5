import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { MessageSquare, Volume2, VolumeX } from 'lucide-react';
import Button from '../../../components/ui/Button';

const DemoNarrative = ({ currentScene, scenario, voiceEnabled }) => {
  const [narrativeText, setNarrativeText] = useState('');
  const [isReading, setIsReading] = useState(false);

  const narratives = {
    operations: {
      normal: "Our Temple Operations Overview provides real-time monitoring of all temple activities. The dashboard shows current devotee count, active services, and operational status. Smart sensors throughout the temple complex gather data to ensure smooth operations and optimal devotee experience.",
      festival: "During festival periods, our system automatically scales to handle 3x the normal capacity. Real-time crowd monitoring helps manage the increased devotee flow while maintaining safety protocols. Predictive analytics anticipate bottlenecks before they occur.",
      emergency: "In emergency situations, the system immediately switches to crisis management mode. All staff are automatically alerted, evacuation routes are optimized, and emergency services are notified. Safety is our top priority."
    },
    crowd: {
      normal: "Advanced crowd analytics using AI-powered computer vision tracks devotee movement patterns. Heat maps show high-density areas, helping temple staff optimize queues and reduce wait times. Real-time capacity monitoring ensures comfortable darshan experience.",
      festival: "Festival crowd analytics leverage machine learning to predict peak hours and crowd surges. Dynamic queue management and real-time routing suggestions help distribute devotees evenly across temple areas, preventing overcrowding.",
      emergency: "Emergency crowd control activates automatic evacuation protocols. The system calculates optimal evacuation routes and provides real-time guidance to staff and security personnel for safe crowd dispersal."
    },
    emergency: {
      normal: "Our Emergency Response Center remains on standby with 24/7 monitoring capabilities. Integrated with local emergency services, the system can quickly coordinate responses to any incidents. Medical assistance, lost person alerts, and safety notifications are handled seamlessly.",
      festival: "During festivals, emergency response capabilities are enhanced with additional staff coordination and faster incident response times. Crowd density monitoring helps prevent emergency situations before they escalate.",
      emergency: "Full emergency response activation includes immediate staff dispatch, coordination with emergency services, and real-time incident tracking. The system provides command center functionality for crisis management."
    },
    financial: {
      normal: "Financial Analytics provides comprehensive insights into temple revenue streams including donations, darshan tickets, and prasadam sales. Real-time transaction monitoring and trend analysis help optimize temple operations and resource allocation.",
      festival: "Festival financial analytics show significant revenue increases with detailed breakdowns by category. Donation pattern analysis helps temple administration plan for future events and manage resources effectively.",
      emergency: "During emergencies, financial systems continue secure operations while providing refund processing for affected services. Transaction security remains paramount even during crisis situations."
    }
  };

  useEffect(() => {
    if (currentScene && scenario) {
      const text = narratives?.[currentScene?.id]?.[scenario] || "Demo narrative loading...";
      setNarrativeText(text);
      
      if (voiceEnabled && 'speechSynthesis' in window) {
        setIsReading(true);
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.rate = 0.8;
        utterance.pitch = 1.0;
        utterance.volume = 0.8;
        utterance.onend = () => setIsReading(false);
        
        // Stop any ongoing speech
        speechSynthesis.cancel();
        speechSynthesis.speak(utterance);
      }
    }
  }, [currentScene, scenario, voiceEnabled]);

  const handleToggleVoice = () => {
    if (isReading) {
      speechSynthesis.cancel();
      setIsReading(false);
    } else if (narrativeText && 'speechSynthesis' in window) {
      setIsReading(true);
      const utterance = new SpeechSynthesisUtterance(narrativeText);
      utterance.rate = 0.8;
      utterance.pitch = 1.0;
      utterance.volume = 0.8;
      utterance.onend = () => setIsReading(false);
      speechSynthesis.speak(utterance);
    }
  };

  const getScenarioColor = () => {
    switch (scenario) {
      case 'festival': return 'text-temple-saffron';
      case 'emergency': return 'text-error';
      default: return 'text-temple-gold';
    }
  };

  const getScenarioIcon = () => {
    switch (scenario) {
      case 'festival': return '🎉';
      case 'emergency': return '🚨';
      default: return '🏛️';
    }
  };

  return (
    <motion.div
      initial={{ x: 50, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      transition={{ duration: 0.6, delay: 0.2 }}
      className="bg-card rounded-lg sacred-shadow p-6 h-96 flex flex-col"
    >
      {/* Header */}
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold text-sw1049-primary flex items-center">
          <MessageSquare className="mr-2 h-5 w-5" />
          Demo Narrative
        </h3>
        
        {narrativeText && (
          <Button
            variant="outline"
            size="sm"
            onClick={handleToggleVoice}
            className={`border-temple-gold hover:bg-temple-gold/10 ${
              isReading ? 'bg-temple-gold/20' : ''
            }`}
            disabled={!('speechSynthesis' in window)}
          >
            {isReading ? (
              <>
                <VolumeX className="h-4 w-4 mr-1" />
                Stop
              </>
            ) : (
              <>
                <Volume2 className="h-4 w-4 mr-1" />
                Read
              </>
            )}
          </Button>
        )}
      </div>
      {/* Scenario Badge */}
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        className="flex items-center justify-center mb-4"
      >
        <div className="bg-muted rounded-full px-4 py-2 flex items-center space-x-2">
          <span className="text-lg">{getScenarioIcon()}</span>
          <span className={`font-semibold capitalize ${getScenarioColor()}`}>
            {scenario} Scenario
          </span>
        </div>
      </motion.div>
      {/* Narrative Content */}
      <div className="flex-1 overflow-y-auto">
        <motion.div
          key={currentScene?.id + scenario}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="space-y-4"
        >
          {/* Scene Title */}
          <div className="text-center mb-4">
            <h4 className="text-xl font-bold text-primary">
              {currentScene?.title || 'Demo Scene'}
            </h4>
            <div className="w-16 h-1 temple-gradient mx-auto mt-2 rounded-full" />
          </div>

          {/* Narrative Text */}
          <motion.div
            className={`text-muted-foreground leading-relaxed text-sm ${
              isReading ? 'bg-temple-gold/5 p-3 rounded-lg border border-temple-gold/20' : ''
            }`}
            animate={{
              backgroundColor: isReading 
                ? 'rgba(218, 165, 32, 0.05)' 
                : 'transparent'
            }}
          >
            {narrativeText?.split('. ')?.map((sentence, index) => (
              <motion.span
                key={index}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: index * 0.1 }}
                className="block mb-2"
              >
                {sentence}{sentence && '. '}
              </motion.span>
            ))}
          </motion.div>

          {/* Technical Details */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="mt-6 p-4 bg-muted/50 rounded-lg"
          >
            <h5 className="font-semibold text-sm text-primary mb-2">
              💡 Technical Highlights
            </h5>
            <ul className="text-xs text-muted-foreground space-y-1">
              <li>• Real-time data processing with WebSocket connections</li>
              <li>• AI-powered predictive analytics and forecasting</li>
              <li>• Scalable microservices architecture</li>
              <li>• Mobile-responsive progressive web application</li>
            </ul>
          </motion.div>
        </motion.div>
      </div>
      {/* Voice Status Indicator */}
      {isReading && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="mt-4 flex items-center justify-center space-x-2 text-xs text-temple-gold"
        >
          <div className="flex space-x-1">
            {[0, 1, 2]?.map(i => (
              <motion.div
                key={i}
                className="w-1 h-4 bg-temple-gold rounded-full"
                animate={{
                  scaleY: [1, 2, 1],
                  opacity: [0.5, 1, 0.5]
                }}
                transition={{
                  duration: 1,
                  repeat: Infinity,
                  delay: i * 0.2
                }}
              />
            ))}
          </div>
          <span>AI narration in progress...</span>
        </motion.div>
      )}
    </motion.div>
  );
};

export default DemoNarrative;