import { generateToken, verifyToken } from '../../utils/jwt';

describe("JWT Utils - Integration Tests", () => {
  describe("generateToken", () => {
    it("should generate a valid JWT token", () => {
      const payload = { userId: '123', email: 'test@example.com' };
      const token = generateToken(payload);

      expect(token).toBeDefined();
      expect(typeof token).toBe('string');
      expect(token.split('.').length).toBe(3); // JWT has 3 parts
    });

    it("should generate different tokens for different payloads", () => {
      const payload1 = { userId: '123' };
      const payload2 = { userId: '456' };

      const token1 = generateToken(payload1);
      const token2 = generateToken(payload2);

      expect(token1).not.toBe(token2);
    });

    it("should generate token with custom expiration", () => {
      const payload = { userId: '123' };
      const token = generateToken(payload, '10m');

      expect(token).toBeDefined();
      expect(typeof token).toBe('string');
    });
  });

  describe("verifyToken", () => {
    it("should verify a valid token", () => {
      const payload = { userId: '123', email: 'test@example.com' };
      const token = generateToken(payload);

      const decoded = verifyToken(token) as any;

      expect(decoded).toBeDefined();
      expect(decoded.userId).toBe('123');
      expect(decoded.email).toBe('test@example.com');
    });

    it("should include standard JWT claims", () => {
      const payload = { userId: '123' };
      const token = generateToken(payload);

      const decoded = verifyToken(token) as any;

      expect(decoded.iat).toBeDefined(); // issued at
      expect(decoded.exp).toBeDefined(); // expiration
    });

    it("should throw error for invalid token", () => {
      const invalidToken = 'invalid.token.here';

      expect(() => verifyToken(invalidToken)).toThrow();
    });

    it("should throw error for tampered token", () => {
      const payload = { userId: '123' };
      const token = generateToken(payload);
      const tamperedToken = token.slice(0, -5) + 'xxxxx';

      expect(() => verifyToken(tamperedToken)).toThrow();
    });
  });

  describe("token roundtrip", () => {
    it("should encode and decode complex payload", () => {
      const complexPayload = {
        userId: '123',
        email: 'test@example.com',
        role: 'ADMIN',
        permissions: ['read', 'write']
      };

      const token = generateToken(complexPayload);
      const decoded = verifyToken(token) as any;

      expect(decoded.userId).toBe(complexPayload.userId);
      expect(decoded.email).toBe(complexPayload.email);
      expect(decoded.role).toBe(complexPayload.role);
      expect(decoded.permissions).toEqual(complexPayload.permissions);
    });
  });
});
