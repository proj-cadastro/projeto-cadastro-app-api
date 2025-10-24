import { hashPassword, comparePassword } from "../../utils/hash";

describe("Hash Utils - Integration Tests", () => {
  describe("hashPassword", () => {
    it("should hash password successfully", async () => {
      const password = "password123";
      const hashedPassword = await hashPassword(password);

      expect(hashedPassword).toBeDefined();
      expect(hashedPassword).not.toBe(password);
      expect(hashedPassword.length).toBeGreaterThan(20);
      expect(hashedPassword).toMatch(/^\$2b\$/);
    });

    it("should generate different hashes for same password", async () => {
      const password = "password123";
      const hash1 = await hashPassword(password);
      const hash2 = await hashPassword(password);

      expect(hash1).not.toBe(hash2);
    });
  });

  describe("comparePassword", () => {
    it("should return true for matching password", async () => {
      const password = "mySecretPassword";
      const hashedPassword = await hashPassword(password);

      const result = await comparePassword(password, hashedPassword);

      expect(result).toBe(true);
    });

    it("should return false for non-matching password", async () => {
      const password = "mySecretPassword";
      const wrongPassword = "wrongPassword";
      const hashedPassword = await hashPassword(password);

      const result = await comparePassword(wrongPassword, hashedPassword);

      expect(result).toBe(false);
    });

    it("should work with complex passwords", async () => {
      const complexPassword = "P@ssw0rd!#2024$";
      const hashedPassword = await hashPassword(complexPassword);

      const result = await comparePassword(complexPassword, hashedPassword);

      expect(result).toBe(true);
    });
  });
});
