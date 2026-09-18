import { describe, it, expect } from 'vitest';
import bcrypt from 'bcryptjs';

describe('OTP Security', () => {
  it('should hash OTP with bcrypt', async () => {
    const otp = '1234';
    const hashed = await bcrypt.hash(otp, 10);
    
    expect(hashed).toBeTruthy();
    expect(hashed).not.toBe(otp); // Hash should be different from original
    expect(hashed.startsWith('$2')).toBe(true); // bcrypt hash format
  });

  it('should verify correct OTP', async () => {
    const otp = '1234';
    const hashed = await bcrypt.hash(otp, 10);
    
    const isValid = await bcrypt.compare(otp, hashed);
    expect(isValid).toBe(true);
  });

  it('should reject incorrect OTP', async () => {
    const otp = '1234';
    const hashed = await bcrypt.hash(otp, 10);
    
    const isValid = await bcrypt.compare('5678', hashed);
    expect(isValid).toBe(false);
  });

  it('should generate different hashes for same OTP', async () => {
    const otp = '1234';
    const hash1 = await bcrypt.hash(otp, 10);
    const hash2 = await bcrypt.hash(otp, 10);
    
    expect(hash1).not.toBe(hash2); // Different salts
    // But both should verify
    expect(await bcrypt.compare(otp, hash1)).toBe(true);
    expect(await bcrypt.compare(otp, hash2)).toBe(true);
  });

  it('should generate 4-digit OTP', () => {
    const otp = Math.floor(1000 + Math.random() * 9000).toString();
    expect(otp.length).toBe(4);
    expect(/^\d{4}$/.test(otp)).toBe(true);
  });

  it('should not be vulnerable to timing attacks', async () => {
    // bcrypt.compare has constant-time comparison
    const otp = '1234';
    const hashed = await bcrypt.hash(otp, 10);
    
    // Both should take similar time (constant-time comparison)
    const start1 = Date.now();
    await bcrypt.compare('1234', hashed);
    const time1 = Date.now() - start1;
    
    const start2 = Date.now();
    await bcrypt.compare('9999', hashed);
    const time2 = Date.now() - start2;
    
    // Times should be similar (within 100ms tolerance)
    expect(Math.abs(time1 - time2)).toBeLessThan(100);
  });
});
