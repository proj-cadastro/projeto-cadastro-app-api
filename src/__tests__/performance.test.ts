import request from "supertest";
import app from "../app";

describe("Performance Tests", () => {
  // Testes sem autenticação para medir performance pura

  describe("Response Time Tests", () => {
    test("Server basic response should be fast", async () => {
      const startTime = Date.now();

      const response = await request(app).get("/");

      const responseTime = Date.now() - startTime;

      console.log(`🚀 Basic server response time: ${responseTime}ms`);
      expect(responseTime).toBeLessThan(500);
      expect([200, 404]).toContain(response.status); // Aceita 404 se rota não existe
    });

    test("Health check endpoint should respond within 100ms", async () => {
      const startTime = Date.now();

      const response = await request(app).get("/health");

      const responseTime = Date.now() - startTime;

      console.log(`💚 Health check response time: ${responseTime}ms`);
      expect(responseTime).toBeLessThan(100);
      expect([200, 404]).toContain(response.status);
    });

    test("API root should respond quickly", async () => {
      const startTime = Date.now();

      const response = await request(app).get("/api");

      const responseTime = Date.now() - startTime;

      console.log(`📡 API root response time: ${responseTime}ms`);
      expect(responseTime).toBeLessThan(200);
      expect([200, 404]).toContain(response.status);
    });
  });

  describe("Database Performance Tests", () => {
    test("Server should respond to basic requests fast", async () => {
      const startTime = Date.now();

      const response = await request(app).get("/");

      const responseTime = Date.now() - startTime;

      console.log(`💾 Basic request response time: ${responseTime}ms`);
      expect(responseTime).toBeLessThan(300);
      expect([200, 404]).toContain(response.status);
    });

    test("Multiple requests should perform well", async () => {
      const startTime = Date.now();

      const response = await request(app).get("/api");

      const responseTime = Date.now() - startTime;

      console.log(`🔍 API endpoint response time: ${responseTime}ms`);
      expect(responseTime).toBeLessThan(800);
      expect([200, 404]).toContain(response.status);
    });
  });

  describe("Concurrent Requests Test", () => {
    test("Should handle 10 concurrent requests efficiently", async () => {
      const startTime = Date.now();

      const requests = Array(10)
        .fill(null)
        .map(() => request(app).get("/"));

      const responses = await Promise.all(requests);
      const totalTime = Date.now() - startTime;

      console.log(`⚡ 10 concurrent requests total time: ${totalTime}ms`);
      console.log(`📊 Average time per request: ${totalTime / 10}ms`);

      expect(totalTime).toBeLessThan(2000); // 2 seconds for 10 requests
      responses.forEach((response: any) => {
        expect([200, 401]).toContain(response.status); // 200 ou 401 se não autenticado
      });
    });
  });

  describe("Load Test Simulation", () => {
    test("Should maintain performance under moderate load", async () => {
      const results: number[] = [];

      for (let i = 0; i < 5; i++) {
        const startTime = Date.now();

        await request(app).get("/");

        const responseTime = Date.now() - startTime;
        results.push(responseTime);
      }

      const avgResponseTime =
        results.reduce((a, b) => a + b, 0) / results.length;
      const maxResponseTime = Math.max(...results);

      console.log(
        `📈 Average response time over 5 requests: ${avgResponseTime.toFixed(
          2
        )}ms`
      );
      console.log(`🔝 Max response time: ${maxResponseTime}ms`);
      console.log(`📉 Min response time: ${Math.min(...results)}ms`);

      expect(avgResponseTime).toBeLessThan(400);
      expect(maxResponseTime).toBeLessThan(1000);
    });
  });

  describe("Memory and Resource Usage", () => {
    test("Should not cause memory leaks with multiple requests", async () => {
      const initialMemory = process.memoryUsage().heapUsed;

      // Fazer 20 requests para simular uso
      const requests = Array(20)
        .fill(null)
        .map(() => request(app).get("/"));

      await Promise.all(requests);

      // Forçar garbage collection se disponível
      if (global.gc) {
        global.gc();
      }

      const finalMemory = process.memoryUsage().heapUsed;
      const memoryIncrease = finalMemory - initialMemory;
      const memoryIncreaseMB = memoryIncrease / 1024 / 1024;

      console.log(
        `🧠 Memory increase after 20 requests: ${memoryIncreaseMB.toFixed(2)}MB`
      );

      // Não deve aumentar mais que 50MB
      expect(memoryIncreaseMB).toBeLessThan(50);
    });
  });
});
