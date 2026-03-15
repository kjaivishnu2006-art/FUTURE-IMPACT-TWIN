import React, { useState } from 'react';
import { LifestyleData, TransportType, DietType, PlasticUsage, ShoppingHabits } from '../types';
import { motion } from 'framer-motion';

interface HabitFormProps {
  onSubmit: (data: LifestyleData) => void;
  isLoading: boolean;
}

const HabitForm: React.FC<HabitFormProps> = ({ onSubmit, isLoading }) => {
  const [formData, setFormData] = useState<LifestyleData>({
    transportType: 'car',
    dietType: 'non-vegetarian',
    electricityUsage: 300,
    plasticUsage: 'medium',
    shoppingHabits: 'average',
    travelFrequency: 1,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <motion.form 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      onSubmit={handleSubmit} 
      className="space-y-6 bg-white/5 backdrop-blur-xl p-8 rounded-3xl border border-white/10 shadow-2xl"
    >
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Transport */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-blue-400 uppercase tracking-wider">Transportation</label>
          <select 
            value={formData.transportType}
            onChange={(e) => setFormData({ ...formData, transportType: e.target.value as TransportType })}
            className="w-full bg-black/50 border border-white/20 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-emerald-400 transition-colors"
          >
            <option value="car">Car</option>
            <option value="bike">Bike</option>
            <option value="public_transport">Public Transport</option>
            <option value="walking">Walking</option>
          </select>
        </div>

        {/* Diet */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-blue-400 uppercase tracking-wider">Diet</label>
          <select 
            value={formData.dietType}
            onChange={(e) => setFormData({ ...formData, dietType: e.target.value as DietType })}
            className="w-full bg-black/50 border border-white/20 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-emerald-400 transition-colors"
          >
            <option value="non-vegetarian">Non-Vegetarian</option>
            <option value="vegetarian">Vegetarian</option>
            <option value="vegan">Vegan</option>
          </select>
        </div>

        {/* Electricity */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-blue-400 uppercase tracking-wider">Electricity (kWh/month)</label>
          <input 
            type="number"
            value={formData.electricityUsage}
            onChange={(e) => setFormData({ ...formData, electricityUsage: parseInt(e.target.value) })}
            className="w-full bg-black/50 border border-white/20 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-emerald-400 transition-colors"
          />
        </div>

        {/* Plastic */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-blue-400 uppercase tracking-wider">Plastic Usage</label>
          <select 
            value={formData.plasticUsage}
            onChange={(e) => setFormData({ ...formData, plasticUsage: e.target.value as PlasticUsage })}
            className="w-full bg-black/50 border border-white/20 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-emerald-400 transition-colors"
          >
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
          </select>
        </div>

        {/* Shopping */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-blue-400 uppercase tracking-wider">Shopping Habits</label>
          <select 
            value={formData.shoppingHabits}
            onChange={(e) => setFormData({ ...formData, shoppingHabits: e.target.value as ShoppingHabits })}
            className="w-full bg-black/50 border border-white/20 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-emerald-400 transition-colors"
          >
            <option value="minimal">Minimal</option>
            <option value="average">Average</option>
            <option value="frequent">Frequent</option>
          </select>
        </div>

        {/* Travel */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-blue-400 uppercase tracking-wider">Flights per Year</label>
          <input 
            type="number"
            value={formData.travelFrequency}
            onChange={(e) => setFormData({ ...formData, travelFrequency: parseInt(e.target.value) })}
            className="w-full bg-black/50 border border-white/20 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-emerald-400 transition-colors"
          />
        </div>
      </div>

      <button 
        type="submit" 
        disabled={isLoading}
        className="w-full bg-emerald-500 hover:bg-emerald-400 text-black font-bold py-4 rounded-xl transition-all transform hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed uppercase tracking-widest"
      >
        {isLoading ? 'Analyzing Digital Twin...' : 'Analyze My Impact'}
      </button>
    </motion.form>
  );
};

export default HabitForm;
