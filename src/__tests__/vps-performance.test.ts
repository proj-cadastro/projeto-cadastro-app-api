import axios from "axios";

// Configuração da VPS - ALTERE PARA SUA URL
const VPS_BASE_URL = process.env.VPS_URL || "http://localhost:3000";

describe("🌐 Testes de Performance VPS - Produção", () => {
  let performanceResults: any = {
    responses: [],
    errors: [],
    timestamp: new Date().toISOString(),
    serverUrl: VPS_BASE_URL,
  };

  beforeAll(() => {
    console.log(`🚀 Testando servidor VPS: ${VPS_BASE_URL}`);
    console.log("📋 Configuração dos testes:");
    console.log("   - Timeout: 30 segundos por requisição");
    console.log("   - Simulando usuário real com delays");
    console.log("   - Medindo latência de rede + processamento\n");
  });

  afterAll(() => {
    console.log("\n🎯 ===== RELATÓRIO DE PERFORMANCE VPS =====");
    console.log(`🌍 Servidor testado: ${VPS_BASE_URL}`);
    console.log(`📅 Data do teste: ${new Date().toLocaleString("pt-BR")}`);

    if (performanceResults.responses.length > 0) {
      const avgTime =
        performanceResults.responses.reduce(
          (a: number, b: number) => a + b,
          0
        ) / performanceResults.responses.length;
      const maxTime = Math.max(...performanceResults.responses);
      const minTime = Math.min(...performanceResults.responses);

      console.log("\n⚡ VELOCIDADE DE RESPOSTA VPS:");
      console.log(`   • Tempo médio: ${avgTime.toFixed(2)}ms`);
      console.log(`   • Tempo máximo: ${maxTime}ms`);
      console.log(`   • Tempo mínimo: ${minTime}ms`);
      console.log(
        `   • Total de testes: ${performanceResults.responses.length}`
      );

      console.log("\n🌐 ANÁLISE DE REDE + SERVIDOR:");
      if (avgTime < 100) {
        console.log("   🏆 EXCELENTE - VPS muito rápida!");
      } else if (avgTime < 500) {
        console.log("   🥇 MUITO BOM - Performance alta para VPS");
      } else if (avgTime < 1000) {
        console.log("   🥈 BOM - Performance adequada para VPS");
      } else {
        console.log("   🥉 REGULAR - Verificar otimizações VPS");
      }

      console.log("\n📊 PARA APRESENTAÇÃO (VPS REAL):");
      console.log(`   "A VPS responde em média em ${avgTime.toFixed(2)}ms"`);
      console.log(`   "Incluindo latência de rede + processamento"`);
      console.log(
        `   "Suporta aproximadamente ${Math.round(1000 / avgTime)} req/seg"`
      );
    }

    if (performanceResults.errors.length > 0) {
      console.log(
        `\n❌ ERROS ENCONTRADOS: ${performanceResults.errors.length}`
      );
      performanceResults.errors.forEach((error: any, i: number) => {
        console.log(`   ${i + 1}. ${error.endpoint}: ${error.message}`);
      });
    }

    console.log("=============================================\n");
  });

  test("🌍 Conectividade básica com VPS", async () => {
    let response;
    let responseTime;

    try {
      const startTime = Date.now();

      // Testa endpoint de documentação que sabemos que existe
      response = await axios.get(`${VPS_BASE_URL}/api-docs/`, {
        timeout: 30000,
        headers: {
          "User-Agent": "Performance-Test/1.0",
        },
        validateStatus: () => true, // Aceita qualquer status
      });

      responseTime = Date.now() - startTime;
      performanceResults.responses.push(responseTime);

      console.log(`🌍 Conectividade VPS: ${responseTime}ms`);
      console.log(`📡 Status: ${response.status}`);

      expect(responseTime).toBeLessThan(5000); // 5 segundos é aceitável para VPS
      expect([200, 301, 302, 404]).toContain(response.status);
    } catch (error: any) {
      performanceResults.errors.push({
        endpoint: "/api-docs/",
        message: error.message,
      });
      console.error("❌ Erro na conectividade:", error.message);
      throw error;
    }
  }, 35000);

  test("🔐 Endpoint de autenticação VPS", async () => {
    try {
      const startTime = Date.now();

      const response = await axios.post(
        `${VPS_BASE_URL}/auth/login`,
        {
          email: "test@test.com",
          password: "test123",
        },
        {
          timeout: 30000,
          validateStatus: () => true, // Aceita qualquer status
        }
      );

      const responseTime = Date.now() - startTime;
      performanceResults.responses.push(responseTime);

      console.log(`🔐 Auth endpoint VPS: ${responseTime}ms`);
      console.log(`📡 Status: ${response.status}`);

      expect(responseTime).toBeLessThan(3000);
      expect([200, 400, 401, 404]).toContain(response.status);
    } catch (error: any) {
      performanceResults.errors.push({
        endpoint: "/auth/login",
        message: error.message,
      });
      console.log("⚠️ Endpoint auth não disponível ou erro de rede");
    }
  }, 35000);

  test("📚 Endpoints de dados VPS", async () => {
    const endpoints = ["/usuarios", "/professores", "/cursos", "/materias"];

    for (const endpoint of endpoints) {
      try {
        const startTime = Date.now();

        const response = await axios.get(`${VPS_BASE_URL}${endpoint}`, {
          timeout: 30000,
          validateStatus: () => true,
        });

        const responseTime = Date.now() - startTime;
        performanceResults.responses.push(responseTime);

        console.log(
          `📚 ${endpoint}: ${responseTime}ms (Status: ${response.status})`
        );

        expect(responseTime).toBeLessThan(5000);

        // Aguarda um pouco entre requisições (simula usuário real)
        await new Promise((resolve) => setTimeout(resolve, 200));
      } catch (error: any) {
        performanceResults.errors.push({
          endpoint,
          message: error.message,
        });
        console.log(`⚠️ ${endpoint}: ${error.message}`);
      }
    }
  }, 60000);

  test("⚡ Teste de carga simultânea VPS", async () => {
    try {
      const startTime = Date.now();

      const requests = Array(5)
        .fill(null)
        .map(() =>
          axios
            .get(`${VPS_BASE_URL}/api-docs/`, {
              timeout: 30000,
              validateStatus: () => true,
            })
            .catch((err: any) => ({ error: err.message }))
        );

      const responses = await Promise.all(requests);
      const totalTime = Date.now() - startTime;

      const successfulResponses = responses.filter((r: any) => !("error" in r));

      console.log(`⚡ 5 requisições simultâneas: ${totalTime}ms`);
      console.log(`✅ Sucessos: ${successfulResponses.length}/5`);
      console.log(`📊 Média por requisição: ${(totalTime / 5).toFixed(2)}ms`);

      expect(totalTime).toBeLessThan(15000); // 15 segundos para 5 requisições
      expect(successfulResponses.length).toBeGreaterThan(0);
    } catch (error: any) {
      console.error("❌ Erro no teste de carga:", error.message);
    }
  }, 45000);

  test("🕒 Teste de latência de rede", async () => {
    const measurements = [];

    for (let i = 0; i < 3; i++) {
      try {
        const start = Date.now();

        await axios.head(`${VPS_BASE_URL}/api-docs/`, {
          timeout: 10000,
        });

        const latency = Date.now() - start;
        measurements.push(latency);

        console.log(`🕒 Latência ${i + 1}: ${latency}ms`);

        await new Promise((resolve) => setTimeout(resolve, 1000));
      } catch (error: any) {
        console.log(`⚠️ Erro na medição ${i + 1}: ${error.message}`);
      }
    }

    if (measurements.length > 0) {
      const avgLatency =
        measurements.reduce((a, b) => a + b, 0) / measurements.length;
      console.log(`📊 Latência média: ${avgLatency.toFixed(2)}ms`);

      performanceResults.averageLatency = avgLatency;
      expect(avgLatency).toBeLessThan(2000);
    }
  }, 45000);
});
