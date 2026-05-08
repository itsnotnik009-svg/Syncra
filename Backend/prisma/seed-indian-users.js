const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function main() {
  console.log('Cleaning up previous seed...');
  
  const oldEmails = [
    'sarah.admin@syncra.com', 'john.doe@syncra.com', 'jane.smith@syncra.com',
    'alex.johnson@syncra.com', 'emily.davis@syncra.com', 'michael.brown@syncra.com',
    'jessica.wilson@syncra.com', 'david.taylor@syncra.com'
  ];
  
  await prisma.user.deleteMany({
    where: { email: { in: oldEmails } }
  });

  console.log('Seeding new Indian users...');
  
  const usersToSeed = [
    { name: 'Aarav Sharma', email: 'aarav.sharma@syncra.com', role: 'ADMIN', password: 'aarav' },
    { name: 'Diya Patel', email: 'diya.patel@syncra.com', role: 'ADMIN', password: 'diya' },
    { name: 'Vihaan Singh', email: 'vihaan.singh@syncra.com', role: 'MEMBER', password: 'vihaan' },
    { name: 'Ananya Gupta', email: 'ananya.gupta@syncra.com', role: 'MEMBER', password: 'ananya' },
    { name: 'Rohan Kumar', email: 'rohan.kumar@syncra.com', role: 'MEMBER', password: 'rohan' },
    { name: 'Priya Das', email: 'priya.das@syncra.com', role: 'MEMBER', password: 'priya' },
    { name: 'Kabir Verma', email: 'kabir.verma@syncra.com', role: 'MEMBER', password: 'kabir' },
    { name: 'Meera Reddy', email: 'meera.reddy@syncra.com', role: 'MEMBER', password: 'meera' }
  ];

  let createdCount = 0;
  
  for (const userData of usersToSeed) {
    const passwordHash = await bcrypt.hash(userData.password + '1234', 12);
    await prisma.user.upsert({
      where: { email: userData.email },
      update: {},
      create: {
        name: userData.name,
        email: userData.email,
        password: passwordHash,
        role: userData.role,
      },
    });
    createdCount++;
    console.log(`  ✓ ${userData.name} (${userData.email}) - ${userData.role} [Password: ${userData.password}1234]`);
  }

  console.log(`\nDone! Created ${createdCount} users.`);
}

main()
  .catch((e) => {
    console.error('Seed failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
