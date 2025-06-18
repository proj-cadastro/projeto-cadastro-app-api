import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
  const unidades = [
    { id: "003", nome: 'Fatec Sorocaba', latitude: -23.482440, longitude: -47.426990 },
    { id: "301", nome: 'Fatec Votorantim', latitude: -23.544600, longitude: -47.444700 },
    { id: "132", nome: 'Fatec Tatuí', latitude: -23.348600, longitude: -47.848500 },
    { id: "131", nome: 'Fatec Itapetininga', latitude: -23.591000, longitude: -48.054000 },
    { id: "174", nome: 'Fatec Capão Bonito', latitude: -24.273900, longitude: -48.591600 },
    { id: "178", nome: 'Fatec Itu', latitude: -23.261800, longitude: -47.293500 },
    { id: "112", nome: 'Fatec Botucatu', latitude: -22.884300, longitude: -48.445800 },
    { id: "265", nome: 'Fatec São Roque', latitude: -23.529500, longitude: -47.138700 },
    { id: "299", nome: 'Fatec Registro', latitude: -24.487300, longitude: -47.844000 },
  ];

  for (const unidade of unidades) {
    await prisma.unidade.upsert({
      where: { id: unidade.id },
      update: {
        nome: unidade.nome,
        latitude: unidade.latitude,
        longitude: unidade.longitude,
      },
      create: unidade,
    });
    console.log(`✅ Unidade ${unidade.nome} com id ${unidade.id} adicionada/atualizada`);
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
