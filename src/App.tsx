import React, { useState, useEffect } from 'react';
import { onAuthStateChanged, signInWithPopup, GoogleAuthProvider, User } from 'firebase/auth';
import { doc, setDoc, getDoc, onSnapshot } from 'firebase/firestore';
import { auth, db } from './firebase';
import { LifestyleData, ImpactScore, Recommendation } from './types';
import { generateRecommendations } from './services/geminiService';
import Globe from './components/Globe';
import HabitForm from './components/HabitForm';
import Dashboard from './components/Dashboard';
import SimulationLab from './components/SimulationLab';
import SignIn from './components/SignIn';
import { motion, AnimatePresence } from 'framer-motion';
import { Globe as GlobeIcon, ArrowRight, LogIn, Leaf, Shield, Zap, Clock } from 'lucide-react';

export default function App() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [analyzing, setAnalyzing] = useState(false);
  const [lifestyle, setLifestyle] = useState<LifestyleData | null>(null);
  const [score, setScore] = useState<ImpactScore | null>(null);
  const [recommendations, setRecommendations] = useState<Recommendation | null>(null);
  const [view, setView] = useState<'landing' | 'form' | 'dashboard' | 'simulation'>('landing');

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (u) => {
      setUser(u);
      setLoading(false);
      if (u) {
        // Load existing data
        loadUserData(u.uid);
      }
    });
    return () => unsubscribe();
  }, []);

  const loadUserData = async (uid: string) => {
    const lifestyleDoc = await getDoc(doc(db, `users/${uid}/lifestyle/current`));
    const scoreDoc = await getDoc(doc(db, `users/${uid}/scores/current`));
    const recDoc = await getDoc(doc(db, `users/${uid}/recommendations/current`));

    if (lifestyleDoc.exists()) setLifestyle(lifestyleDoc.data() as LifestyleData);
    if (scoreDoc.exists()) setScore(scoreDoc.data() as ImpactScore);
    if (recDoc.exists()) setRecommendations(recDoc.data() as Recommendation);
    
    if (lifestyleDoc.exists() && scoreDoc.exists()) {
      setView('dashboard');
    }
  };

  const handleLogin = async () => {
    const provider = new GoogleAuthProvider();
    try {
      await signInWithPopup(auth, provider);
    } catch (error) {
      console.error("Login error:", error);
    }
  };

  const handleHabitSubmit = async (data: LifestyleData) => {
    if (!user) return;
    setAnalyzing(true);

    try {
      // 1. Calculate scores via Backend API
      const response = await fetch('/api/calculate-impact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      const scores = await response.json();

      // 2. Generate AI Recommendations
      const suggestions = await generateRecommendations(data, scores);

      // 3. Save to Firestore
      const timestamp = new Date().toISOString();
      await setDoc(doc(db, `users/${user.uid}/lifestyle/current`), { ...data, updatedAt: timestamp });
      await setDoc(doc(db, `users/${user.uid}/scores/current`), { ...scores, updatedAt: timestamp });
      await setDoc(doc(db, `users/${user.uid}/recommendations/current`), { suggestions, updatedAt: timestamp });

      setLifestyle(data);
      setScore(scores);
      setRecommendations({ suggestions });
      setView('dashboard');
    } catch (error) {
      console.error("Analysis error:", error);
    } finally {
      setAnalyzing(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0A0A0A] flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-emerald-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0A0A0A] text-white font-sans selection:bg-emerald-500/30">
      {/* Navigation */}
      <nav className="fixed top-0 w-full z-50 bg-black/50 backdrop-blur-md border-b border-white/5 px-6 py-4 flex justify-between items-center">
        <div className="flex items-center gap-2 group cursor-pointer" onClick={() => setView('landing')}>
          <div className="p-2 bg-emerald-500/10 rounded-lg group-hover:bg-emerald-500/20 transition-colors">
            <Leaf className="text-emerald-400 w-6 h-6" />
          </div>
          <span className="text-xl font-black tracking-tighter uppercase">Future Impact <span className="text-emerald-400">Twin</span></span>
        </div>
        <div>
          {user ? (
            <div className="flex items-center gap-4">
              <span className="hidden md:block text-sm text-white/60">{user.displayName}</span>
              <button onClick={() => auth.signOut()} className="text-sm font-bold uppercase tracking-widest hover:text-emerald-400 transition-colors">Sign Out</button>
            </div>
          ) : (
            <button onClick={handleLogin} className="flex items-center gap-2 bg-white text-black px-6 py-2 rounded-full font-bold hover:bg-emerald-400 transition-all">
              <LogIn size={18} /> Sign In
            </button>
          )}
        </div>
      </nav>

      <main className="pt-24 pb-12 px-6 max-w-7xl mx-auto">
        <AnimatePresence mode="wait">
          {!user && (
            <motion.div
              key="signin"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <SignIn onGoogleSignIn={handleLogin} />
            </motion.div>
          )}

          {user && view === 'landing' && (
            <motion.div 
              key="landing"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center min-h-[80vh]"
            >
              <div className="space-y-8">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                >
                  <span className="text-emerald-400 font-bold uppercase tracking-[0.3em] text-sm mb-4 block">Climate Intelligence v1.0</span>
                  <h1 className="text-6xl md:text-8xl font-black leading-[0.9] tracking-tighter mb-6">
                    WELCOME BACK, <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-blue-500">{user.displayName?.split(' ')[0]}</span>
                  </h1>
                  <p className="text-xl text-white/60 max-w-xl leading-relaxed">
                    Your digital twin is ready for further simulation. Continue your journey towards planetary restoration.
                  </p>
                </motion.div>

                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                  className="flex flex-wrap gap-4"
                >
                  <button 
                    onClick={() => setView('dashboard')}
                    className="group bg-emerald-500 hover:bg-emerald-400 text-black px-8 py-4 rounded-2xl font-black uppercase tracking-widest flex items-center gap-3 transition-all shadow-[0_0_30px_rgba(16,185,129,0.3)]"
                  >
                    Go to Dashboard <ArrowRight className="group-hover:translate-x-1 transition-transform" />
                  </button>
                  <button 
                    onClick={() => setView('form')}
                    className="px-8 py-4 rounded-2xl font-bold uppercase tracking-widest border border-white/10 hover:bg-white/5 transition-all"
                  >
                    Update Habits
                  </button>
                </motion.div>

                <div className="grid grid-cols-3 gap-8 pt-8 border-t border-white/5">
                  <FeatureItem icon={<Shield size={20} />} label="Secure Data" />
                  <FeatureItem icon={<Zap size={20} />} label="AI Powered" />
                  <FeatureItem icon={<GlobeIcon size={20} />} label="Global Impact" />
                </div>
              </div>

              <div className="relative h-[500px] md:h-[600px] flex items-center justify-center">
                <div className="absolute inset-0 bg-emerald-500/10 blur-[120px] rounded-full"></div>
                <Globe sustainabilityScore={score?.sustainabilityScore || 50} />
              </div>
            </motion.div>
          )}

          {user && view === 'form' && (
            <motion.div 
              key="form"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="max-w-3xl mx-auto"
            >
              <div className="text-center mb-12">
                <h2 className="text-4xl font-black uppercase tracking-tighter mb-4">Digital Twin Configuration</h2>
                <p className="text-white/60">Enter your lifestyle habits to generate your environmental profile.</p>
              </div>
              <HabitForm onSubmit={handleHabitSubmit} isLoading={analyzing} />
            </motion.div>
          )}

          {user && view === 'dashboard' && score && recommendations && (
            <motion.div 
              key="dashboard"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="space-y-12"
            >
              <div className="flex flex-col md:flex-row justify-between items-end gap-6">
                <div>
                  <h2 className="text-4xl font-black uppercase tracking-tighter">Impact Dashboard</h2>
                  <p className="text-white/60">Real-time analysis of your environmental digital twin.</p>
                </div>
                <button 
                  onClick={() => setView('simulation')}
                  className="bg-emerald-500 hover:bg-emerald-400 text-black px-6 py-3 rounded-xl font-bold transition-all flex items-center gap-2"
                >
                  <Clock size={18} /> Enter Simulation Lab
                </button>
                <button 
                  onClick={() => setView('form')}
                  className="bg-white/5 hover:bg-white/10 border border-white/10 px-6 py-3 rounded-xl font-bold transition-all"
                >
                  Update Habits
                </button>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2">
                  <Dashboard score={score} recommendations={recommendations} />
                </div>
                <div className="space-y-8">
                  <div className="bg-white/5 backdrop-blur-xl p-6 rounded-3xl border border-white/10 h-[400px] relative overflow-hidden">
                    <h3 className="text-xl font-bold mb-4 uppercase tracking-wider">Planetary Health</h3>
                    <Globe sustainabilityScore={score.sustainabilityScore} />
                    <div className="absolute bottom-6 left-6 right-6 text-center">
                      <p className="text-xs text-white/40 uppercase tracking-widest">Digital Twin Visualization</p>
                    </div>
                  </div>
                  
                  <div className="bg-gradient-to-br from-emerald-500/20 to-blue-500/20 p-6 rounded-3xl border border-white/10">
                    <h3 className="text-xl font-bold mb-4 uppercase tracking-wider">Future Simulation</h3>
                    <p className="text-sm text-white/70 leading-relaxed mb-6">
                      Based on your current habits, your 10-year carbon footprint will be equivalent to planting <span className="text-emerald-400 font-bold">{(100 - score.carbonScore) * 12} trees</span>.
                    </p>
                    <div className="space-y-4">
                      <SimulationBar label="Current Path" value={score.sustainabilityScore} color="bg-blue-500" />
                      <SimulationBar label="Sustainable Path" value={95} color="bg-emerald-500" />
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {user && view === 'simulation' && score && (
            <motion.div 
              key="simulation"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <div className="flex items-center gap-4 mb-8">
                <button 
                  onClick={() => setView('dashboard')}
                  className="p-2 bg-white/5 rounded-lg hover:bg-white/10 transition-colors"
                >
                  <ArrowRight className="rotate-180" />
                </button>
                <h2 className="text-2xl font-black uppercase tracking-tighter">Simulation Lab</h2>
              </div>
              <SimulationLab baseScore={score} />
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* Footer */}
      <footer className="border-t border-white/5 py-8 text-center text-white/30 text-sm uppercase tracking-[0.2em]">
        &copy; 2026 Future Impact Twin &bull; Built for Hackathon
      </footer>
    </div>
  );
}

const FeatureItem = ({ icon, label }: { icon: React.ReactNode, label: string }) => (
  <div className="flex items-center gap-3 text-white/40">
    {icon}
    <span className="text-xs font-bold uppercase tracking-widest">{label}</span>
  </div>
);

const SimulationBar = ({ label, value, color }: { label: string, value: number, color: string }) => (
  <div className="space-y-1">
    <div className="flex justify-between text-[10px] uppercase tracking-widest font-bold">
      <span>{label}</span>
      <span>{value}%</span>
    </div>
    <div className="h-2 bg-white/10 rounded-full overflow-hidden">
      <motion.div 
        initial={{ width: 0 }}
        animate={{ width: `${value}%` }}
        className={`h-full ${color}`}
      />
    </div>
  </div>
);
