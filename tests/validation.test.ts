import { describe, it, expect } from 'vitest';
import { validatePhone, normalizePhone, formatPhone } from '../server/src/utils/validation';

describe('Phone Validation', () => {
  describe('validatePhone', () => {
    it('should accept valid +998 format', () => {
      expect(validatePhone('+998901234567')).toBe(true);
      expect(validatePhone('+998911234567')).toBe(true);
      expect(validatePhone('+998931234567')).toBe(true);
      expect(validatePhone('+998941234567')).toBe(true);
      expect(validatePhone('+998951234567')).toBe(true);
      expect(validatePhone('+998971234567')).toBe(true);
      expect(validatePhone('+998981234567')).toBe(true);
      expect(validatePhone('+998991234567')).toBe(true);
    });

    it('should accept 998 format without +', () => {
      expect(validatePhone('998901234567')).toBe(true);
    });

    it('should reject invalid prefixes', () => {
      expect(validatePhone('+998001234567')).toBe(false);
      expect(validatePhone('+998101234567')).toBe(false);
      expect(validatePhone('+998881234567')).toBe(false);
    });

    it('should reject wrong length', () => {
      expect(validatePhone('+99890123456')).toBe(false); // too short
      expect(validatePhone('+9989012345678')).toBe(false); // too long
    });

    it('should reject non-Uzbekistan numbers', () => {
      expect(validatePhone('+12345678901')).toBe(false);
      expect(validatePhone('+79001234567')).toBe(false);
    });

    it('should reject empty/invalid input', () => {
      expect(validatePhone('')).toBe(false);
      expect(validatePhone('abc')).toBe(false);
      expect(validatePhone('123')).toBe(false);
    });
  });

  describe('normalizePhone', () => {
    it('should normalize to +998XXXXXXXXX format', () => {
      expect(normalizePhone('+998 90 123 45 67')).toBe('+998901234567');
      expect(normalizePhone('998901234567')).toBe('+998901234567');
      expect(normalizePhone('+998901234567')).toBe('+998901234567');
    });

    it('should remove spaces and special characters', () => {
      expect(normalizePhone('+998 (90) 123-45-67')).toBe('+998901234567');
    });
  });

  describe('formatPhone', () => {
    it('should format for display', () => {
      expect(formatPhone('+998901234567')).toBe('+998 90 123 45 67');
    });
  });
});
