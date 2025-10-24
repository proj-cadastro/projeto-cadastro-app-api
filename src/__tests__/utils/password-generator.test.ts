import { generateRandomPassword } from "../../utils/password-generator";

describe("generateRandomPassword", () => {
  it("should generate password with default length of 8 characters", () => {
    // Act
    const password = generateRandomPassword();

    // Assert
    expect(password).toHaveLength(8);
    expect(typeof password).toBe("string");
  });

  it("should generate password with specified length", () => {
    // Arrange
    const length = 12;

    // Act
    const password = generateRandomPassword(length);

    // Assert
    expect(password).toHaveLength(length);
  });

  it("should enforce minimum length of 6 characters", () => {
    // Arrange
    const shortLength = 4;

    // Act
    const password = generateRandomPassword(shortLength);

    // Assert
    expect(password).toHaveLength(6); // Should be 6, not 4
  });

  it("should contain at least one uppercase letter", () => {
    // Act
    const password = generateRandomPassword();

    // Assert
    expect(password).toMatch(/[A-Z]/);
  });

  it("should contain at least one lowercase letter", () => {
    // Act
    const password = generateRandomPassword();

    // Assert
    expect(password).toMatch(/[a-z]/);
  });

  it("should contain at least one number", () => {
    // Act
    const password = generateRandomPassword();

    // Assert
    expect(password).toMatch(/[0-9]/);
  });

  it("should contain at least one special character", () => {
    // Act
    const password = generateRandomPassword();

    // Assert
    expect(password).toMatch(/[!@#$%^&*(),.?":{}|<>]/);
  });

  it("should generate different passwords on multiple calls", () => {
    // Act
    const password1 = generateRandomPassword();
    const password2 = generateRandomPassword();
    const password3 = generateRandomPassword();

    // Assert
    expect(password1).not.toBe(password2);
    expect(password2).not.toBe(password3);
    expect(password1).not.toBe(password3);
  });

  it("should handle larger length correctly", () => {
    // Arrange
    const length = 20;

    // Act
    const password = generateRandomPassword(length);

    // Assert
    expect(password).toHaveLength(length);
    expect(password).toMatch(/[A-Z]/);
    expect(password).toMatch(/[a-z]/);
    expect(password).toMatch(/[0-9]/);
    expect(password).toMatch(/[!@#$%^&*(),.?":{}|<>]/);
  });
});
