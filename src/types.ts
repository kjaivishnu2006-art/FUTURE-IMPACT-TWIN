export type TransportType = 'car' | 'bike' | 'public_transport' | 'walking';
export type DietType = 'vegetarian' | 'non-vegetarian' | 'vegan';
export type PlasticUsage = 'low' | 'medium' | 'high';
export type ShoppingHabits = 'minimal' | 'average' | 'frequent';

export interface LifestyleData {
  transportType: TransportType;
  dietType: DietType;
  electricityUsage: number;
  plasticUsage: PlasticUsage;
  shoppingHabits: ShoppingHabits;
  travelFrequency: number;
}

export interface ImpactScore {
  carbonScore: number;
  wasteScore: number;
  energyScore: number;
  sustainabilityScore: number;
}

export interface Recommendation {
  suggestions: string[];
}

export interface UserProfile {
  uid: string;
  email: string;
  displayName: string;
  createdAt: string;
}

export type SimulationYear = 2026 | 2030 | 2040 | 2050;

export interface SimulationState {
  year: SimulationYear;
  planetaryHealth: number; // 0-100
  seaLevelRise: number; // in meters
  biodiversityLoss: number; // percentage
}
