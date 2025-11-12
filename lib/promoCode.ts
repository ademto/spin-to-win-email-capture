/**
 * Generate a unique promo code
 * Format: PREFIX-XXXXXX (e.g., GIFT50-A7X9K2)
 */
export const generatePromoCode = (prefix: string = 'GIFT50'): string => {
  const random = Math.random().toString(36).substring(2, 8).toUpperCase();
  const timestamp = Date.now().toString(36).substring(-3).toUpperCase();
  
  // Combine random chars with timestamp for better uniqueness
  const uniqueCode = (random + timestamp).substring(0, 6);
  
  return `${prefix}-${uniqueCode}`;
};

/**
 * Generate promo code based on prize type
 */
export const generatePrizePromoCode = (prizeLabel: string): string | null => {
  switch (prizeLabel) {
    case '$50 Gift':
      return generatePromoCode('GIFT50');
    case '20% OFF':
      return generatePromoCode('OFF20');
    case 'Free Product':
      return generatePromoCode('FREE');
    default:
      return null;
  }
};
