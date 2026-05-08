const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  // Get admin user to be the project creator
  const admin = await prisma.user.findFirst({ where: { role: 'ADMIN' } });
  if (!admin) { console.error('No admin user found. Run the main seed first.'); process.exit(1); }

  const projects = [
    { title: 'API Gateway Migration', description: 'Migrate legacy REST endpoints to the new API gateway with rate limiting and caching.' },
    { title: 'Design System v2', description: 'Rebuild the component library with updated tokens, accessibility improvements, and dark mode support.' },
    { title: 'Data Pipeline Refactor', description: 'Restructure ETL jobs for better throughput and error recovery.' },
    { title: 'Mobile App MVP', description: 'Build the first version of the mobile client targeting iOS and Android.' },
    { title: 'Security Audit Q2', description: 'Run penetration tests, fix vulnerabilities, and update dependency versions.' },
    { title: 'Customer Dashboard', description: 'Build a self-service analytics dashboard for enterprise customers.' },
    { title: 'CI/CD Pipeline Improvements', description: 'Speed up build times, add staging environments, and improve deployment reliability.' },
  ];

  const taskTemplates = [
    // API Gateway Migration
    [
      { title: 'Audit existing endpoints', priority: 'HIGH', status: 'COMPLETED', days: -5 },
      { title: 'Set up Kong gateway config', priority: 'CRITICAL', status: 'IN_PROGRESS', days: 3 },
      { title: 'Implement rate limiting rules', priority: 'MEDIUM', status: 'TODO', days: 7 },
      { title: 'Write integration tests for gateway', priority: 'MEDIUM', status: 'TODO', days: 10 },
      { title: 'Document API versioning strategy', priority: 'LOW', status: 'TODO', days: 14 },
    ],
    // Design System v2
    [
      { title: 'Define new color tokens', priority: 'HIGH', status: 'COMPLETED', days: -3 },
      { title: 'Build Button and Input components', priority: 'HIGH', status: 'REVIEW', days: 2 },
      { title: 'Add dark mode toggle logic', priority: 'MEDIUM', status: 'IN_PROGRESS', days: 5 },
      { title: 'Run accessibility audit (WCAG 2.1)', priority: 'CRITICAL', status: 'TODO', days: 8 },
      { title: 'Publish Storybook documentation', priority: 'LOW', status: 'TODO', days: 12 },
    ],
    // Data Pipeline Refactor
    [
      { title: 'Profile current pipeline bottlenecks', priority: 'HIGH', status: 'COMPLETED', days: -7 },
      { title: 'Redesign Kafka topic partitioning', priority: 'CRITICAL', status: 'IN_PROGRESS', days: 4 },
      { title: 'Implement dead-letter queue handling', priority: 'HIGH', status: 'TODO', days: 6 },
      { title: 'Add Prometheus metrics for throughput', priority: 'MEDIUM', status: 'TODO', days: 9 },
    ],
    // Mobile App MVP
    [
      { title: 'Set up React Native project', priority: 'HIGH', status: 'COMPLETED', days: -4 },
      { title: 'Build authentication screens', priority: 'HIGH', status: 'IN_PROGRESS', days: 3 },
      { title: 'Implement task list view', priority: 'CRITICAL', status: 'TODO', days: 5 },
      { title: 'Add push notification support', priority: 'MEDIUM', status: 'TODO', days: 10 },
      { title: 'Beta testing with internal team', priority: 'LOW', status: 'TODO', days: 18 },
      { title: 'App store submission prep', priority: 'MEDIUM', status: 'TODO', days: 21 },
    ],
    // Security Audit Q2
    [
      { title: 'Run OWASP ZAP scan on staging', priority: 'CRITICAL', status: 'IN_PROGRESS', days: 2 },
      { title: 'Update vulnerable npm packages', priority: 'HIGH', status: 'TODO', days: 4 },
      { title: 'Review JWT token rotation policy', priority: 'HIGH', status: 'TODO', days: 6 },
      { title: 'Patch SQL injection vectors', priority: 'CRITICAL', status: 'TODO', days: 3 },
      { title: 'Generate compliance report', priority: 'MEDIUM', status: 'TODO', days: 14 },
    ],
    // Customer Dashboard
    [
      { title: 'Gather requirements from product', priority: 'HIGH', status: 'COMPLETED', days: -6 },
      { title: 'Design wireframes in Figma', priority: 'HIGH', status: 'COMPLETED', days: -2 },
      { title: 'Build chart components (bar, line, pie)', priority: 'CRITICAL', status: 'IN_PROGRESS', days: 5 },
      { title: 'Integrate with analytics API', priority: 'HIGH', status: 'TODO', days: 8 },
      { title: 'Add date range filter controls', priority: 'MEDIUM', status: 'TODO', days: 10 },
      { title: 'Performance optimization for large datasets', priority: 'MEDIUM', status: 'TODO', days: 15 },
    ],
    // CI/CD Pipeline
    [
      { title: 'Parallelize test suite execution', priority: 'HIGH', status: 'REVIEW', days: 1 },
      { title: 'Add staging environment to workflow', priority: 'CRITICAL', status: 'IN_PROGRESS', days: 4 },
      { title: 'Set up Docker layer caching', priority: 'MEDIUM', status: 'TODO', days: 6 },
      { title: 'Implement canary deployment strategy', priority: 'HIGH', status: 'TODO', days: 12 },
    ],
  ];

  let totalTasks = 0;

  for (let i = 0; i < projects.length; i++) {
    const project = await prisma.project.create({
      data: { title: projects[i].title, description: projects[i].description, createdBy: admin.id },
    });

    for (const t of taskTemplates[i]) {
      const due = new Date();
      due.setDate(due.getDate() + t.days);
      await prisma.task.create({
        data: {
          title: t.title,
          status: t.status,
          priority: t.priority,
          projectId: project.id,
          assignedTo: null,
          dueDate: due,
        },
      });
      totalTasks++;
    }
    console.log(`  ✓ ${projects[i].title} — ${taskTemplates[i].length} tasks`);
  }

  console.log(`\nDone! Created ${projects.length} projects with ${totalTasks} unassigned tasks.`);
}

main()
  .catch((e) => { console.error(e); process.exit(1); })
  .finally(() => prisma.$disconnect());
