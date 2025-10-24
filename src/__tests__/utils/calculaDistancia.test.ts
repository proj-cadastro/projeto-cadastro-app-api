import { calculateDistanceKm } from "../../utils/calculaDistancia";

describe("calculateDistanceKm", () => {
  it("should calculate distance between two points correctly", () => {
    // Arrange - São Paulo to Rio de Janeiro (approximately 358 km)
    const lat1 = -23.5505; // São Paulo
    const lon1 = -46.6333;
    const lat2 = -22.9068; // Rio de Janeiro
    const lon2 = -43.1729;

    // Act
    const distance = calculateDistanceKm(lat1, lon1, lat2, lon2);

    // Assert - Allow some tolerance for floating point calculations
    expect(distance).toBeCloseTo(358, -1); // Within 10 km tolerance
  });

  it("should return 0 for same coordinates", () => {
    // Arrange
    const lat = -23.5505;
    const lon = -46.6333;

    // Act
    const distance = calculateDistanceKm(lat, lon, lat, lon);

    // Assert
    expect(distance).toBe(0);
  });

  it("should calculate distance between coordinates with different hemispheres", () => {
    // Arrange - New York to Sydney (approximately 15993 km)
    const lat1 = 40.7128; // New York
    const lon1 = -74.006;
    const lat2 = -33.8688; // Sydney
    const lon2 = 151.2093;

    // Act
    const distance = calculateDistanceKm(lat1, lon1, lat2, lon2);

    // Assert
    expect(distance).toBeCloseTo(15993, -2); // Within 100 km tolerance
  });

  it("should handle negative coordinates correctly", () => {
    // Arrange
    const lat1 = -10.0;
    const lon1 = -20.0;
    const lat2 = -15.0;
    const lon2 = -25.0;

    // Act
    const distance = calculateDistanceKm(lat1, lon1, lat2, lon2);

    // Assert
    expect(distance).toBeGreaterThan(0);
    expect(typeof distance).toBe("number");
  });
});
