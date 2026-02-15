import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, Play, Info } from 'lucide-react';
import { useState } from 'react';
import VideoModal from '../components/VideoModal';

const WORKOUT_DATA: Record<string, any> = {
  'Squats': {
    title: 'Squats',
    description: 'Lower body strength building exercise',
    instructions: [
      'Stand with feet shoulder-width apart',
      'Lower your body by bending knees and hips',
      'Keep your chest up and back straight',
      'Go until thighs are parallel to ground',
      'Drive through heels to return to start',
    ],
    muscles: ['Quadriceps', 'Glutes', 'Hamstrings', 'Core'],
    difficulty: 'Beginner',
    youtubeId: 'aclHkTpTWA0',
    tips: [
      'Keep weight in heels',
      'Don\'t let knees cave inward',
      'Maintain upright torso',
      'Full range of motion is key',
    ],
  },
  'Pushups': {
    title: 'Push-ups',
    description: 'Upper body pushing exercise',
    instructions: [
      'Start in plank position with hands shoulder-width apart',
      'Lower body by bending elbows to 90 degrees',
      'Keep body in straight line',
      'Push through palms to return to start',
      'Engage core throughout',
    ],
    muscles: ['Chest', 'Shoulders', 'Triceps', 'Core'],
    difficulty: 'Beginner',
    youtubeId: 'IODxDxX7oi4',
    tips: [
      'Engage your core',
      'Keep elbows at 45 degrees',
      'Full range of motion',
      'Controlled descent',
    ],
  },
  'Plank': {
    title: 'Plank',
    description: 'Core stability isometric exercise',
    instructions: [
      'Start in forearm plank position',
      'Keep body in straight line',
      'Engage core and glutes',
      'Hold position for desired time',
      'Keep head neutral',
    ],
    muscles: ['Core', 'Shoulders', 'Back'],
    difficulty: 'Beginner',
    youtubeId: 'pSHjTRCQxIw',
    tips: [
      'Don\'t sag at hips',
      'Breathe steadily',
      'Engage entire core',
      'Build time gradually',
    ],
  },
  'Lunges': {
    title: 'Lunges',
    description: 'Single-leg lower body exercise',
    instructions: [
      'Stand with feet together',
      'Step forward with one leg',
      'Lower hips until both knees are at 90 degrees',
      'Push back to starting position',
      'Alternate legs',
    ],
    muscles: ['Quadriceps', 'Glutes', 'Hamstrings', 'Balance'],
    difficulty: 'Beginner',
    youtubeId: 'Z2-FQmFAYX8',
    tips: [
      'Keep torso upright',
      'Front knee over ankle',
      'Back knee hovers off ground',
      'Equal weight distribution',
    ],
  },
};

export default function WorkoutDetailPage() {
  const { exercise } = useParams<{ exercise: string }>();
  const navigate = useNavigate();
  const [showVideo, setShowVideo] = useState(false);

  if (!exercise || !WORKOUT_DATA[exercise]) {
    return (
      <div className="min-h-screen bg-[#0A0A0A] text-white p-8">
        <button onClick={() => navigate('/dashboard')} className="text-neon-red hover:underline">
          ← Back to Dashboard
        </button>
        <div className="mt-8 text-center">
          <p className="text-2xl font-bold">Workout not found</p>
        </div>
      </div>
    );
  }

  const workout = WORKOUT_DATA[exercise];

  return (
    <div className="min-h-screen bg-[#0A0A0A] text-white overflow-hidden">
      {/* Fixed Background */}
      <div className="fixed top-0 left-0 w-full h-full pointer-events-none">
        <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_50%_50%,rgba(0,100,255,0.08),transparent)]" />
        <div className="absolute top-[-20%] right-[-20%] w-96 h-96 bg-blue-500/20 rounded-full blur-3xl animate-glow-pulse" />
        <div className="absolute bottom-[-20%] left-[-20%] w-96 h-96 bg-emerald-500/20 rounded-full blur-3xl animate-glow-pulse" />
      </div>

      <div className="relative z-10 max-w-5xl mx-auto px-8 py-12">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="flex items-center gap-4 mb-12"
        >
          <button
            onClick={() => navigate('/dashboard')}
            className="p-2 rounded-lg hover:bg-white/5 transition-colors"
          >
            <ArrowLeft className="w-6 h-6" />
          </button>
          <div>
            <h1 className="text-4xl font-black text-gradient bg-gradient-to-r from-neon-red to-glow-yellow">
              {workout.title}
            </h1>
            <p className="text-neutral-300 mt-2">{workout.description}</p>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Video Section */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="card-glass p-8 space-y-4"
            >
              <div className="relative bg-neutral-900 rounded-xl overflow-hidden aspect-video">
                <img
                  src={`https://img.youtube.com/vi/${workout.youtubeId}/maxresdefault.jpg`}
                  alt={workout.title}
                  className="w-full h-full object-cover"
                />
                <button
                  onClick={() => setShowVideo(true)}
                  className="absolute inset-0 flex items-center justify-center hover:bg-black/40 transition-colors"
                >
                  <motion.div
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    className="btn-glow-red p-4 rounded-full"
                  >
                    <Play className="w-8 h-8 fill-white" />
                  </motion.div>
                </button>
              </div>
              <p className="text-sm text-neutral-400">Click to watch the video demonstration</p>
            </motion.div>

            {/* Instructions */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="card-glass p-8 space-y-4"
            >
              <h2 className="text-2xl font-bold flex items-center gap-2">
                <Info className="w-6 h-6 text-glow-blue" />
                Proper Form Instructions
              </h2>
              <ol className="space-y-3">
                {workout.instructions.map((instruction: string, i: number) => (
                  <motion.li
                    key={i}
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.1 }}
                    className="flex gap-4 items-start"
                  >
                    <div className="flex-shrink-0 w-8 h-8 rounded-full bg-neon-red/20 border border-neon-red/50 flex items-center justify-center font-bold text-neon-red text-sm">
                      {i + 1}
                    </div>
                    <span className="text-neutral-300 pt-0.5">{instruction}</span>
                  </motion.li>
                ))}
              </ol>
            </motion.div>

            {/* Tips */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="card-glass p-8 space-y-4 border-glow-blue/30"
            >
              <h2 className="text-xl font-bold text-glow-blue">Pro Tips</h2>
              <ul className="space-y-2">
                {workout.tips.map((tip: string, i: number) => (
                  <li key={i} className="flex gap-3 items-start">
                    <span className="text-glow-blue font-bold mt-1">✓</span>
                    <span className="text-neutral-300">{tip}</span>
                  </li>
                ))}
              </ul>
            </motion.div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Quick Stats */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="card-glass p-6 space-y-4"
            >
              <h3 className="font-bold text-lg">Overview</h3>
              <div className="space-y-3">
                <div className="border-t border-white/10 pt-3">
                  <p className="text-sm text-neutral-400 mb-1">Difficulty</p>
                  <p className="font-bold text-glow-yellow">{workout.difficulty}</p>
                </div>
              </div>
            </motion.div>

            {/* Muscles Worked */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="card-glass p-6 space-y-4"
            >
              <h3 className="font-bold text-lg">Muscles Worked</h3>
              <div className="space-y-2">
                {workout.muscles.map((muscle: string, i: number) => (
                  <motion.div
                    key={muscle}
                    initial={{ opacity: 0, x: -10 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.1 }}
                    className="flex items-center gap-2 px-3 py-2 bg-white/5 rounded-lg"
                  >
                    <div className="w-2 h-2 rounded-full bg-glow-emerald" />
                    <span className="text-sm">{muscle}</span>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            {/* CTA */}
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => navigate('/dashboard')}
              className="btn-glow-red w-full"
            >
              Log This Workout
            </motion.button>
          </div>
        </div>
      </div>

      {/* Video Modal */}
      {showVideo && (
        <VideoModal
          isOpen={showVideo}
          title={`${workout.title} - Video Guide`}
          videoUrl={`https://www.youtube.com/embed/${workout.youtubeId}`}
          onClose={() => setShowVideo(false)}
        />
      )}
    </div>
  );
}
