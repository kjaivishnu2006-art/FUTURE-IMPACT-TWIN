import React from 'react';
import { ImpactScore, Recommendation } from '../types';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  LineChart, Line, AreaChart, Area
} from 'recharts';
import { motion } from 'framer-motion';
import { Award, Zap, Trash2, Wind, Globe as GlobeIcon } from 'lucide-react';

interface DashboardProps {
  score: ImpactScore;
  recommendations: Recommendation;
}

const Dashboard: React.FC<DashboardProps> = ({ score, recommendations }) => {
  const chartData = [
    { name: 'Carbon', value: score.carbonScore, color: '#00D9FF' },
    { name: 'Waste', value: score.wasteScore, color: '#7B61FF' },
    { name: 'Energy', value: score.energyScore, color: '#00FF9C' },
  ];

  const trendData = [
    { name: 'Jan', score: 45 },
    { name: 'Feb', score: 52 },
    { name: 'Mar', score: score.sustainabilityScore },
  ];

  return (
    <div className="space-y-8">
      {/* Top Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <StatCard icon={<GlobeIcon className="text-emerald-400" />} label="Total Score" value={score.sustainabilityScore} color="emerald" />
        <StatCard icon={<Wind className="text-blue-400" />} label="Carbon" value={score.carbonScore} color="blue" />
        <StatCard icon={<Trash2 className="text-purple-400" />} label="Waste" value={score.wasteScore} color="purple" />
        <StatCard icon={<Zap className="text-yellow-400" />} label="Energy" value={score.energyScore} color="yellow" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Impact Breakdown */}
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="bg-white/5 backdrop-blur-xl p-6 rounded-3xl border border-white/10"
        >
          <h3 className="text-xl font-bold mb-6 text-white uppercase tracking-wider">Impact Breakdown</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" vertical={false} />
                <XAxis dataKey="name" stroke="#ffffff60" />
                <YAxis stroke="#ffffff60" />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#0A0A0A', border: '1px solid #ffffff20', borderRadius: '12px' }}
                  itemStyle={{ color: '#fff' }}
                />
                <Bar dataKey="value" radius={[8, 8, 0, 0]}>
                  {chartData.map((entry, index) => (
                    <rect key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        {/* Sustainability Trend */}
        <motion.div 
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="bg-white/5 backdrop-blur-xl p-6 rounded-3xl border border-white/10"
        >
          <h3 className="text-xl font-bold mb-6 text-white uppercase tracking-wider">Sustainability Trend</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={trendData}>
                <defs>
                  <linearGradient id="colorScore" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#00FF9C" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#00FF9C" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" vertical={false} />
                <XAxis dataKey="name" stroke="#ffffff60" />
                <YAxis stroke="#ffffff60" />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#0A0A0A', border: '1px solid #ffffff20', borderRadius: '12px' }}
                />
                <Area type="monotone" dataKey="score" stroke="#00FF9C" fillOpacity={1} fill="url(#colorScore)" strokeWidth={3} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </motion.div>
      </div>

      {/* AI Recommendations */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-4"
      >
        <h3 className="text-xl font-bold text-white uppercase tracking-wider flex items-center gap-2">
          <Zap className="text-yellow-400" /> AI Insights & Recommendations
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {recommendations.suggestions.map((suggestion, index) => (
            <div 
              key={index}
              className="bg-white/5 backdrop-blur-xl p-4 rounded-2xl border border-white/10 hover:border-emerald-400/50 transition-all group"
            >
              <p className="text-white/80 group-hover:text-white transition-colors">{suggestion}</p>
            </div>
          ))}
        </div>
      </motion.div>

      {/* Butterfly Effect Simulator */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-r from-blue-500/10 to-emerald-500/10 p-6 rounded-3xl border border-white/10"
      >
        <h3 className="text-xl font-bold mb-4 text-white uppercase tracking-wider flex items-center gap-2">
          <Zap className="text-yellow-400" /> Butterfly Effect Simulator
        </h3>
        <p className="text-sm text-white/60 mb-6">
          Simulating how your small daily actions ripple through global ecosystems to prevent future disasters.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <EffectCard label="Glacier Stability" value="+0.0004%" desc="Preventing Arctic melt" />
          <EffectCard label="Species Survival" value="+12" desc="Future generations saved" />
          <EffectCard label="Disaster Mitigation" value="-2.4%" desc="Flood probability reduced" />
        </div>
      </motion.div>

      {/* Community Comparison */}
      <div className="bg-white/5 backdrop-blur-xl p-6 rounded-3xl border border-white/10">
        <h3 className="text-xl font-bold mb-6 text-white uppercase tracking-wider flex items-center gap-2">
          <GlobeIcon className="text-blue-400" /> Community Comparison
        </h3>
        <div className="space-y-4">
          <ComparisonRow label="Your Score" value={score.sustainabilityScore} isUser />
          <ComparisonRow label="City Average" value={62} />
          <ComparisonRow label="Global Average" value={48} />
        </div>
      </div>

      {/* Achievements */}
      <div className="bg-white/5 backdrop-blur-xl p-6 rounded-3xl border border-white/10">
        <h3 className="text-xl font-bold mb-6 text-white uppercase tracking-wider flex items-center gap-2">
          <Award className="text-purple-400" /> Achievements
        </h3>
        <div className="flex flex-wrap gap-4">
          <Badge label="Carbon Saver" active={score.carbonScore > 70} />
          <Badge label="Plastic Free Hero" active={score.wasteScore > 70} />
          <Badge label="Energy Guardian" active={score.energyScore > 70} />
          <Badge label="Earth Protector" active={score.sustainabilityScore > 80} />
        </div>
      </div>
    </div>
  );
};

const StatCard = ({ icon, label, value, color }: { icon: React.ReactNode, label: string, value: number, color: string }) => (
  <div className="bg-white/5 backdrop-blur-xl p-4 rounded-2xl border border-white/10 text-center">
    <div className="flex justify-center mb-2">{icon}</div>
    <p className="text-xs text-white/50 uppercase tracking-widest mb-1">{label}</p>
    <p className="text-2xl font-bold text-white">{value}</p>
  </div>
);

const EffectCard = ({ label, value, desc }: { label: string, value: string, desc: string }) => (
  <div className="bg-black/40 p-4 rounded-2xl border border-white/5">
    <p className="text-[10px] text-white/40 uppercase tracking-widest font-bold mb-1">{label}</p>
    <p className="text-xl font-black text-emerald-400 mb-1">{value}</p>
    <p className="text-[10px] text-white/60 italic">{desc}</p>
  </div>
);

const Badge = ({ label, active }: { label: string, active: boolean }) => (
  <div className={`px-4 py-2 rounded-full border transition-all ${active ? 'bg-purple-500/20 border-purple-500 text-purple-400 shadow-[0_0_15px_rgba(168,85,247,0.4)]' : 'bg-white/5 border-white/10 text-white/30'}`}>
    <span className="text-sm font-bold uppercase tracking-wider">{label}</span>
  </div>
);

const ComparisonRow = ({ label, value, isUser }: { label: string, value: number, isUser?: boolean }) => (
  <div className="space-y-1">
    <div className="flex justify-between text-xs font-bold uppercase tracking-widest">
      <span className={isUser ? 'text-emerald-400' : 'text-white/50'}>{label}</span>
      <span className={isUser ? 'text-emerald-400' : 'text-white/50'}>{value}</span>
    </div>
    <div className="h-1.5 bg-white/5 rounded-full overflow-hidden">
      <div 
        className={`h-full transition-all duration-1000 ${isUser ? 'bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.5)]' : 'bg-white/20'}`}
        style={{ width: `${value}%` }}
      />
    </div>
  </div>
);

export default Dashboard;
