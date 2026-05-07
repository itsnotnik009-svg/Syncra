const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding database...');

  // Create admin user
  const adminPassword = await bcrypt.hash('admin123456', 12);
  const admin = await prisma.user.upsert({
    where: { email: 'admin@syncra.com' },
    update: {},
    create: {
      name: 'Admin User',
      email: 'admin@syncra.com',
      password: adminPassword,
      role: 'ADMIN',
    },
  });

  // Create member user
  const memberPassword = await bcrypt.hash('member123456', 12);
  const member = await prisma.user.upsert({
    where: { email: 'member@syncra.com' },
    update: {},
    create: {
      name: 'Team Member',
      email: 'member@syncra.com',
      password: memberPassword,
      role: 'MEMBER',
    },
  });

  // Create sample project
  const project = await prisma.project.create({
    data: {
      title: 'LLM Evaluation Pipeline',
      description: 'Evaluate and benchmark large language models across safety, accuracy, and latency metrics.',
      createdBy: admin.id,
    },
  });

  // Create sample tasks
  const tasks = await Promise.all([
    prisma.task.create({
      data: {
        title: 'Define evaluation criteria',
        description: 'Document the scoring rubric for model evaluation.',
        status: 'COMPLETED',
        priority: 'HIGH',
        projectId: project.id,
        assignedTo: member.id,
        dueDate: new Date('2026-05-10'),
      },
    }),
    prisma.task.create({
      data: {
        title: 'Set up test harness',
        description: 'Build the automated test runner for batch inference.',
        status: 'IN_PROGRESS',
        priority: 'CRITICAL',
        projectId: project.id,
        assignedTo: member.id,
        dueDate: new Date('2026-05-15'),
      },
    }),
    prisma.task.create({
      data: {
        title: 'Collect benchmark datasets',
        description: 'Curate and validate datasets for safety and accuracy benchmarks.',
        status: 'TODO',
        priority: 'MEDIUM',
        projectId: project.id,
        assignedTo: null,
        dueDate: new Date('2026-04-01'), // intentionally overdue
      },
    }),
  ]);

  console.log('Seed complete:');
  console.log(`  Users: ${admin.email} (ADMIN), ${member.email} (MEMBER)`);
  console.log(`  Project: ${project.title}`);
  console.log(`  Tasks: ${tasks.length} created`);
}

main()
  .catch((e) => {
    console.error('Seed failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
