import { describe, it, expect, beforeAll } from 'vitest';
import jwt from 'jsonwebtoken';

// Set test environment
process.env.NODE_ENV = 'test';
process.env.JWT_SECRET = 'test-secret-for-unit-tests-only';

describe('JWT Authentication', () => {
  const JWT_SECRET = process.env.JWT_SECRET!;

  it('should generate valid token', () => {
    const token = jwt.sign(
      { userId: 'test-user-1', role: 'CUSTOMER' },
      JWT_SECRET,
      { expiresIn: '7d' }
    );
    
    expect(token).toBeTruthy();
    expect(typeof token).toBe('string');
    expect(token.split('.')).toHaveLength(3); // JWT has 3 parts
  });

  it('should verify valid token', () => {
    const token = jwt.sign(
      { userId: 'test-user-1', role: 'CUSTOMER' },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    const decoded = jwt.verify(token, JWT_SECRET) as any;
    expect(decoded.userId).toBe('test-user-1');
    expect(decoded.role).toBe('CUSTOMER');
  });

  it('should reject expired token', () => {
    const token = jwt.sign(
      { userId: 'test-user-1', role: 'CUSTOMER' },
      JWT_SECRET,
      { expiresIn: '0s' } // Already expired
    );

    expect(() => jwt.verify(token, JWT_SECRET)).toThrow();
  });

  it('should reject token with wrong secret', () => {
    const token = jwt.sign(
      { userId: 'test-user-1', role: 'CUSTOMER' },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    expect(() => jwt.verify(token, 'wrong-secret')).toThrow();
  });

  it('should reject tampered token', () => {
    const token = jwt.sign(
      { userId: 'test-user-1', role: 'CUSTOMER' },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    // Tamper with the token
    const parts = token.split('.');
    const tamperedToken = parts[0] + '.' + parts[1] + '.tampered';

    expect(() => jwt.verify(tamperedToken, JWT_SECRET)).toThrow();
  });

  it('should contain correct role in token', () => {
    const roles = ['CUSTOMER', 'CAFE_OWNER', 'CAFE_EMPLOYEE', 'PLATFORM_ADMIN'];
    
    roles.forEach(role => {
      const token = jwt.sign(
        { userId: 'test-user-1', role },
        JWT_SECRET,
        { expiresIn: '7d' }
      );

      const decoded = jwt.verify(token, JWT_SECRET) as any;
      expect(decoded.role).toBe(role);
    });
  });
});
