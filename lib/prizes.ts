export interface Prize {
  id: string;
  label: string;
  color: string;
  textColor?: string;
  probability?: number; // Optional: for weighted random selection
}

export const prizes: Prize[] = [
  {
    id: '1',
    label: '10% OFF',
    color: '#FF6B6B',
    textColor: '#FFFFFF',
    probability: 0.3,
  },
  {
    id: '2',
    label: '20% OFF',
    color: '#4ECDC4',
    textColor: '#FFFFFF',
    probability: 0.25,
  },
  {
    id: '3',
    label: 'FREE SHIPPING',
    color: '#45B7D1',
    textColor: '#FFFFFF',
    probability: 0.2,
  },
  {
    id: '4',
    label: '5% OFF',
    color: '#FFA07A',
    textColor: '#FFFFFF',
    probability: 0.15,
  },
  {
    id: '5',
    label: 'TRY AGAIN',
    color: '#98D8C8',
    textColor: '#2C3E50',
    probability: 0.05,
  },
  {
    id: '6',
    label: '50% OFF',
    color: '#F7DC6F',
    textColor: '#2C3E50',
    probability: 0.05,
  },
];

// Calculate total degrees for each segment
export const segmentAngle = 360 / prizes.length;

// Helper function to get random prize (weighted)
export const getRandomPrize = (): Prize => {
  const random = Math.random();
  let cumulativeProbability = 0;

  for (const prize of prizes) {
    cumulativeProbability += prize.probability || 1 / prizes.length;
    if (random <= cumulativeProbability) {
      return prize;
    }
  }

  return prizes[0]; // Fallback
};
