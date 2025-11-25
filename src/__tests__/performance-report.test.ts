import request from "supertest";
import app from "../app";

describe("📊 Performance Report Generator", () => {
  let performanceResults: any = {
    serverResponses: [],
    concurrentLoad: null,
    memoryUsage: null,
    timestamp: new Date().toISOString(),
  };

  afterAll(() => {
    // Gerar relatório final
    console.log("\n🎯 ===== RELATÓRIO DE PERFORMANCE DO SERVIDOR =====");
    console.log(`📅 Data do teste: ${new Date().toLocaleString("pt-BR")}`);
    console.log("\n⚡ VELOCIDADE DE RESPOSTA:");

    const avgTime =
      performanceResults.serverResponses.reduce(
        (a: number, b: number) => a + b,
        0
      ) / performanceResults.serverResponses.length;
    const maxTime = Math.max(...performanceResults.serverResponses);
    const minTime = Math.min(...performanceResults.serverResponses);

    console.log(`   • Tempo médio: ${avgTime.toFixed(2)}ms`);
    console.log(`   • Tempo máximo: ${maxTime}ms`);
    console.log(`   • Tempo mínimo: ${minTime}ms`);

    if (performanceResults.concurrentLoad) {
      console.log(`\n🔄 CARGA CONCORRENTE:`);
      console.log(
        `   • 10 requisições simultâneas: ${performanceResults.concurrentLoad.total}ms`
      );
      console.log(
        `   • Tempo médio por requisição: ${performanceResults.concurrentLoad.average}ms`
      );
    }

    console.log("\n📈 CLASSIFICAÇÃO DA PERFORMANCE:");
    if (avgTime < 10) {
      console.log("   🏆 EXCELENTE - Servidor muito rápido!");
    } else if (avgTime < 50) {
      console.log("   🥇 MUITO BOM - Performance alta");
    } else if (avgTime < 200) {
      console.log("   🥈 BOM - Performance adequada");
    } else {
      console.log("   🥉 REGULAR - Considere otimizações");
    }

    console.log("\n💡 PARA APRESENTAR AO PROFESSOR:");
    console.log(`   "O servidor responde em média em ${avgTime.toFixed(2)}ms"`);
    console.log(
      `   "Suporta ${Math.round(1000 / avgTime)} requisições por segundo"`
    );
    console.log(
      `   "Tempo de resposta varia entre ${minTime}ms e ${maxTime}ms"`
    );
    console.log("===============================================\n");
  });

  test("🚀 Medição de velocidade - Múltiplas requisições", async () => {
    for (let i = 0; i < 5; i++) {
      const startTime = Date.now();
      await request(app).get("/");
      const responseTime = Date.now() - startTime;
      performanceResults.serverResponses.push(responseTime);
    }

    expect(performanceResults.serverResponses.length).toBe(5);
  });

  test("⚡ Teste de carga concorrente", async () => {
    const startTime = Date.now();

    const requests = Array(10)
      .fill(null)
      .map(() => request(app).get("/"));
    await Promise.all(requests);

    const totalTime = Date.now() - startTime;
    performanceResults.concurrentLoad = {
      total: totalTime,
      average: totalTime / 10,
    };

    expect(totalTime).toBeLessThan(5000); // 5 segundos para 10 requisições
  });

  test("🎯 Teste de velocidade específico", async () => {
    const measurements = [];

    for (let i = 0; i < 3; i++) {
      const start = performance.now();
      await request(app).get("/");
      const end = performance.now();
      measurements.push(end - start);
    }

    const avg = measurements.reduce((a, b) => a + b, 0) / measurements.length;
    console.log(
      `🎯 Medições precisas: ${measurements
        .map((m) => m.toFixed(2))
        .join("ms, ")}ms`
    );
    console.log(`📊 Média precisa: ${avg.toFixed(2)}ms`);

    expect(avg).toBeLessThan(1000);
  });
});
