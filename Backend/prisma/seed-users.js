const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding additional users...');
  
  const password = await bcrypt.hash('password123', 12);

  const usersToSeed = [
    { name: 'Sarah Admin', email: 'sarah.admin@syncra.com', role: 'ADMIN' },
    { name: 'John Doe', email: 'john.doe@syncra.com', role: 'MEMBER' },
    { name: 'Jane Smith', email: 'jane.smith@syncra.com', role: 'MEMBER' },
    { name: 'Alex Johnson', email: 'alex.johnson@syncra.com', role: 'MEMBER' },
    { name: 'Emily Davis', email: 'emily.davis@syncra.com', role: 'MEMBER' },
    { name: 'Michael Brown', email: 'michael.brown@syncra.com', role: 'MEMBER' },
    { name: 'Jessica Wilson', email: 'jessica.wilson@syncra.com', role: 'MEMBER' },
    { name: 'David Taylor', email: 'david.taylor@syncra.com', role: 'ADMIN' }
  ];

  let createdCount = 0;
  
  for (const userData of usersToSeed) {
    await prisma.user.upsert({
      where: { email: userData.email },
      update: {},
      create: {
        name: userData.name,
        email: userData.email,
        password: password,
        role: userData.role,
      },
    });
    createdCount++;
    console.log(`  ✓ ${userData.name} (${userData.email}) - ${userData.role}`);
  }

  console.log(`\nDone! Created ${createdCount} users with password 'password123'.`);
}

main()
  .catch((e) => {
    console.error('Seed failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
