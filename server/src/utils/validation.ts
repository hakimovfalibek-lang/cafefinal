/**
 * Phone number validation and normalization for Uzbekistan
 * Format: +998 XX XXX XX XX
 */

// Uzbekistan mobile prefixes
const VALID_PREFIXES = [
  '90', '91', '93', '94', '95', '97', '98', '99', // Mobile
  '69', '70', '71', '72', '73', '74', '75', '76', '77', '78', '79' // Landline
];

/**
 * Validate Uzbekistan phone number
 * Accepts: +998XXXXXXXXX, 998XXXXXXXXX, +998 XX XXX XX XX
 */
export function validatePhone(phone: string): boolean {
  if (!phone || typeof phone !== 'string') return false;

  // Remove all non-digit characters except leading +
  const cleaned = phone.replace(/[^\d+]/g, '');
  
  // Must start with +998 or 998
  let digits = cleaned;
  if (digits.startsWith('+998')) {
    digits = digits.slice(1); // Remove +
  } else if (digits.startsWith('998')) {
    // OK
  } else {
    return false;
  }

  // After 998, should have 9 digits
  const subscriberPart = digits.slice(3);
  if (subscriberPart.length !== 9) return false;

  // Check prefix
  const prefix = subscriberPart.slice(0, 2);
  if (!VALID_PREFIXES.includes(prefix)) return false;

  // All remaining should be digits
  if (!/^\d{9}$/.test(subscriberPart)) return false;

  return true;
}

/**
 * Normalize phone to canonical format: +998XXXXXXXXX
 */
export function normalizePhone(phone: string): string {
  // Remove all non-digit characters
  const cleaned = phone.replace(/[^\d]/g, '');
  
  let digits = cleaned;
  
  // Remove leading 998 if present
  if (digits.startsWith('998')) {
    digits = digits.slice(3);
  }
  
  // Format: +998 + 9 digits
  return `+998${digits}`;
}

/**
 * Format phone for display: +998 XX XXX XX XX
 */
export function formatPhone(phone: string): string {
  const normalized = normalizePhone(phone);
  const digits = normalized.slice(4); // Remove +998
  
  if (digits.length !== 9) return normalized;
  
  return `+998 ${digits.slice(0, 2)} ${digits.slice(2, 5)} ${digits.slice(5, 7)} ${digits.slice(7, 9)}`;
}

/**
 * Validate input is safe (no XSS, etc.)
 */
export function sanitizeString(input: string): string {
  return input
    .replace(/[<>]/g, '')
    .trim()
    .slice(0, 500);
}

/**
 * Validate amount (must be positive integer)
 */
export function validateAmount(amount: unknown): amount is number {
  return typeof amount === 'number' && Number.isInteger(amount) && amount > 0;
}
