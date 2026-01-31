const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

(async () => {
await prisma.weeklyPlanItem.deleteMany({});
await prisma.weeklyPlan.deleteMany({});
console.log('Cleared WeeklyPlanItem and WeeklyPlan.');
})().catch((e) => {
console.error(e);
process.exit(1);
}).finally(() => prisma.$disconnect());