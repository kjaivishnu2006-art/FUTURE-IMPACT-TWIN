import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { SimulationYear, SimulationState, ImpactScore } from '../types';
import { Clock, Users, Zap, AlertTriangle, Thermometer, Droplets, TreePine } from 'lucide-react';
import Globe from './Globe';

interface SimulationLabProps {
  baseScore: ImpactScore;
}

const SimulationLab: React.FC<SimulationLabProps> = ({ baseScore }) => {
  const [selectedYear, setSelectedYear] = useState<SimulationYear>(2026);
  const [simulation, setSimulation] = useState<SimulationState>({
    year: 2026,
    planetaryHealth: baseScore.sustainabilityScore,
    seaLevelRise: 0,
    biodiversityLoss: 0
  });

  useEffect(() => {
    // Calculate simulation based on year and base score
    const yearsFromNow = selectedYear - 2026;
    const impactFactor = (100 - baseScore.sustainabilityScore) / 100;
    
    setSimulation({
      year: selectedYear,
      planetaryHealth: Math.max(0, baseScore.sustainabilityScore - (yearsFromNow * impactFactor * 2)),
      seaLevelRise: parseFloat((yearsFromNow * impactFactor * 0.05).toFixed(2)),
      biodiversityLoss: Math.min(100, Math.round(yearsFromNow * impactFactor * 3))
    });
  }, [selectedYear, baseScore]);

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row justify-between items-center gap-6">
        <div>
          <h2 className="text-4xl font-black uppercase tracking-tighter flex items-center gap-3">
            <Clock className="text-emerald-400" /> Temporal Impact Rift
          </h2>
          <p className="text-white/60">Simulating planetary outcomes based on your current digital twin trajectory.</p>
        </div>
        
        <div className="flex bg-white/5 p-1 rounded-2xl border border-white/10">
          {[2026, 2030, 2040, 2050].map((year) => (
            <button
              key={year}
              onClick={() => setSelectedYear(year as SimulationYear)}
              className={`px-6 py-2 rounded-xl font-bold transition-all ${selectedYear === year ? 'bg-emerald-500 text-black shadow-lg' : 'text-white/40 hover:text-white'}`}
            >
              {year}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left: Simulation Metrics */}
        <div className="space-y-4">
          <MetricCard 
            icon={<Thermometer className="text-orange-400" />} 
            label="Planetary Health" 
            value={`${Math.round(simulation.planetaryHealth)}%`}
            trend={simulation.planetaryHealth < 50 ? 'Critical' : 'Stable'}
            color={simulation.planetaryHealth < 40 ? 'text-red-400' : 'text-emerald-400'}
          />
          <MetricCard 
            icon={<Droplets className="text-blue-400" />} 
            label="Sea Level Rise" 
            value={`+${simulation.seaLevelRise}m`}
            trend="Projected"
            color="text-blue-400"
          />
          <MetricCard 
            icon={<TreePine className="text-emerald-400" />} 
            label="Biodiversity Loss" 
            value={`${simulation.biodiversityLoss}%`}
            trend="Species Risk"
            color="text-orange-400"
          />
          
          <div className="bg-red-500/10 border border-red-500/20 p-6 rounded-3xl space-y-3">
            <div className="flex items-center gap-2 text-red-400 font-bold uppercase tracking-widest text-xs">
              <AlertTriangle size={16} /> Sentinel Disaster Alert
            </div>
            <p className="text-sm text-white/70 leading-relaxed">
              {selectedYear === 2050 && simulation.planetaryHealth < 40 
                ? "CRITICAL: High probability of localized flooding and extreme heat events in your region by this date."
                : "STABLE: Current trajectory maintains regional climate stability for this temporal window."}
            </p>
          </div>
        </div>

        {/* Center: Immersive Globe */}
        <div className="lg:col-span-2 bg-white/5 backdrop-blur-xl rounded-3xl border border-white/10 relative overflow-hidden h-[600px]">
          <div className="absolute top-6 left-6 z-10">
            <div className="bg-black/50 backdrop-blur-md px-4 py-2 rounded-full border border-white/10 flex items-center gap-2">
              <div className={`w-2 h-2 rounded-full animate-pulse ${simulation.planetaryHealth < 40 ? 'bg-red-500' : 'bg-emerald-500'}`} />
              <span className="text-[10px] font-black uppercase tracking-[0.2em]">Simulation Active: {selectedYear}</span>
            </div>
          </div>
          
          <Globe sustainabilityScore={simulation.planetaryHealth} />
          
          <div className="absolute bottom-6 right-6 z-10 max-w-xs text-right">
            <h4 className="text-lg font-bold uppercase tracking-wider mb-2">Gaia Pulse Analysis</h4>
            <p className="text-xs text-white/50 leading-relaxed">
              {selectedYear === 2050 
                ? "The simulation shows a 42% reduction in Arctic ice volume. Your specific contribution to this melt is calculated at 0.00004%."
                : "Ecosystems are currently in a state of dynamic equilibrium. Small habit shifts now will amplify planetary recovery by 2040."}
            </p>
          </div>
        </div>
      </div>

      {/* Legacy Lineage Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="bg-gradient-to-br from-purple-500/10 to-blue-500/10 p-8 rounded-3xl border border-white/10 space-y-6">
          <div className="flex items-center gap-3">
            <Users className="text-purple-400" />
            <h3 className="text-2xl font-black uppercase tracking-tighter">Legacy Lineage</h3>
          </div>
          <p className="text-white/60 leading-relaxed">
            AI-synthesized projection of the world your descendants will inherit in 2070 based on your current lifestyle choices.
          </p>
          <div className="flex items-center gap-4 p-4 bg-black/40 rounded-2xl border border-white/5">
            <div className="w-12 h-12 rounded-full bg-gradient-to-tr from-purple-500 to-blue-500 flex items-center justify-center font-bold">L</div>
            <div>
              <p className="text-sm font-bold">Message from 2070</p>
              <p className="text-xs text-white/40 italic">"The air is clear today, thanks to the choices you made back in the 20s..."</p>
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-emerald-500/10 to-teal-500/10 p-8 rounded-3xl border border-white/10 space-y-6">
          <div className="flex items-center gap-3">
            <Zap className="text-emerald-400" />
            <h3 className="text-2xl font-black uppercase tracking-tighter">Routine Rewrite</h3>
          </div>
          <p className="text-white/60 leading-relaxed">
            AI-powered protocol to automatically optimize your daily routines for maximum planetary healing.
          </p>
          <button className="w-full bg-emerald-500 text-black font-bold py-3 rounded-xl uppercase tracking-widest text-sm hover:bg-emerald-400 transition-all">
            Activate Protocol
          </button>
        </div>
      </div>
    </div>
  );
};

const MetricCard = ({ icon, label, value, trend, color }: { icon: React.ReactNode, label: string, value: string, trend: string, color: string }) => (
  <div className="bg-white/5 backdrop-blur-xl p-6 rounded-3xl border border-white/10 flex items-center justify-between group hover:border-white/20 transition-all">
    <div className="flex items-center gap-4">
      <div className="p-3 bg-white/5 rounded-2xl group-hover:scale-110 transition-transform">{icon}</div>
      <div>
        <p className="text-[10px] text-white/40 uppercase tracking-[0.2em] font-bold">{label}</p>
        <p className={`text-2xl font-black ${color}`}>{value}</p>
      </div>
    </div>
    <div className="text-right">
      <span className="text-[10px] bg-white/5 px-2 py-1 rounded-full text-white/40 uppercase tracking-widest font-bold">{trend}</span>
    </div>
  </div>
);

export default SimulationLab;
