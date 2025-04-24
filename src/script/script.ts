import { PrismaService } from 'src/global/prisma.service';

function main() {
  const PrismaClient = new PrismaService();
  console.log(PrismaClient.company.findMany({}));
}
main();
