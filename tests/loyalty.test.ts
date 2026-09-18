import { describe, it, expect } from 'vitest';

describe('Loyalty Calculation', () => {
  // Simulate loyalty calculation logic
  function calculatePoints(amount: number, loyaltyRate: number, multiplier: number = 1): number {
    const basePoints = Math.floor((amount / 1000) * loyaltyRate);
    return Math.floor(basePoints * multiplier);
  }

  it('should calculate correct base points', () => {
    // 5 points per 1000 UZS
    expect(calculatePoints(1000, 5)).toBe(5);
    expect(calculatePoints(5000, 5)).toBe(25);
    expect(calculatePoints(10000, 5)).toBe(50);
    expect(calculatePoints(45000, 5)).toBe(225);
  });

  it('should handle different loyalty rates', () => {
    expect(calculatePoints(10000, 3)).toBe(30); // 3 points per 1000
    expect(calculatePoints(10000, 4)).toBe(40); // 4 points per 1000
    expect(calculatePoints(10000, 6)).toBe(60); // 6 points per 1000
  });

  it('should apply multiplier correctly', () => {
    // Double points promotion
    expect(calculatePoints(10000, 5, 2)).toBe(100);
    // Triple points
    expect(calculatePoints(10000, 5, 3)).toBe(150);
  });

  it('should floor fractional points', () => {
    // 1500 UZS at 5 points per 1000 = 7.5 -> 7
    expect(calculatePoints(1500, 5)).toBe(7);
    // 2500 UZS at 5 points per 1000 = 12.5 -> 12
    expect(calculatePoints(2500, 5)).toBe(12);
  });

  it('should handle zero amount', () => {
    expect(calculatePoints(0, 5)).toBe(0);
  });

  it('should handle small amounts', () => {
    // 999 UZS at 5 points per 1000 = 4.995 -> 4
    expect(calculatePoints(999, 5)).toBe(4);
    // 1 UZS at 5 points per 1000 = 0.005 -> 0
    expect(calculatePoints(1, 5)).toBe(0);
  });

  it('should calculate customer level correctly', () => {
    function getLevel(points: number): string {
      if (points >= 5000) return 'PLATINUM';
      if (points >= 2000) return 'GOLD';
      if (points >= 1000) return 'SILVER';
      return 'BRONZE';
    }

    expect(getLevel(0)).toBe('BRONZE');
    expect(getLevel(500)).toBe('BRONZE');
    expect(getLevel(999)).toBe('BRONZE');
    expect(getLevel(1000)).toBe('SILVER');
    expect(getLevel(1500)).toBe('SILVER');
    expect(getLevel(1999)).toBe('SILVER');
    expect(getLevel(2000)).toBe('GOLD');
    expect(getLevel(3000)).toBe('GOLD');
    expect(getLevel(4999)).toBe('GOLD');
    expect(getLevel(5000)).toBe('PLATINUM');
    expect(getLevel(10000)).toBe('PLATINUM');
  });
});
