export interface Prize {
  id: string;
  label: string;
  color: string;
  textColor?: string;
  probability?: number;
  message: string; // Custom message to display
  emailRequired?: boolean; // Whether to send email with promo code
  needsPromoCode?: boolean; // Whether this prize needs a unique promo code
}

export const prizes: Prize[] = [
  {
    id: '1',
    label: '50% OFF',
    color: '#2C3E50',
    textColor: '#FFFFFF',
    probability: 0.1,
    message: 'Congratulations! You\'ve won a coupon. Please check your email to receive it.',
    emailRequired: true,
    needsPromoCode: true,
  },
  {
    id: '2',
    label: '20% OFF',
    color: '#800020',
    textColor: '#FFFFFF',
    probability: 0.3,
    message: 'Congratulations! Check your email to receive your coupon.',
    emailRequired: true,
    needsPromoCode: true,
  },
  {
    id: '3',
    label: 'Free Product',
    color: '#000000',
    textColor: '#FFFFFF',
    probability: 0.2,
    message: 'Congratulations! You\'ve won a free product! Please collect it from the Echo & Ember team.',
    emailRequired: false,
    needsPromoCode: false,
  },
  {
    id: '4',
    label: 'No Luck',
    color: '#98D8C8',
    textColor: '#2C3E50',
    probability: 0.4,
    message: 'Better luck next time!',
    emailRequired: false,
    needsPromoCode: false,
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
