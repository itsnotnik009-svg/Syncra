const { prisma } = require('../prisma/client');
const { sendSuccess } = require('../utils/response');

const taskInclude = {
  project: { select: { id: true, title: true } },
  assignee: { select: { id: true, name: true, email: true } },
};

const getStats = async (req, res, next) => {
  try {
    const isAdmin = req.user.role === 'ADMIN';
    const taskFilter = isAdmin ? {} : { assignedTo: req.user.userId };
    const projectFilter = isAdmin ? {} : { tasks: { some: { assignedTo: req.user.userId } } };

    // Due this week calculation
    const now = new Date();
    const endOfWeek = new Date(now);
    endOfWeek.setDate(now.getDate() + (7 - now.getDay()));
    endOfWeek.setHours(23, 59, 59, 999);

    const [totalProjects, totalTasks, completedTasks, pendingTasks, overdueTasks, dueThisWeek] = await Promise.all([
      prisma.project.count({ where: projectFilter }),
      prisma.task.count({ where: taskFilter }),
      prisma.task.count({ where: { ...taskFilter, status: 'COMPLETED' } }),
      prisma.task.count({ where: { ...taskFilter, status: { in: ['TODO', 'IN_PROGRESS', 'REVIEW'] } } }),
      prisma.task.count({ where: { ...taskFilter, dueDate: { lt: new Date() }, status: { not: 'COMPLETED' } } }),
      prisma.task.count({ where: { ...taskFilter, dueDate: { gte: now, lte: endOfWeek }, status: { not: 'COMPLETED' } } }),
    ]);

    const completionPercentage = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

    return sendSuccess(res, { totalProjects, totalTasks, completedTasks, pendingTasks, overdueTasks, dueThisWeek, completionPercentage });
  } catch (err) { next(err); }
};

const getOverdue = async (req, res, next) => {
  try {
    const taskFilter = req.user.role === 'ADMIN' ? {} : { assignedTo: req.user.userId };
    const tasks = await prisma.task.findMany({
      where: { ...taskFilter, dueDate: { lt: new Date() }, status: { not: 'COMPLETED' } },
      include: taskInclude,
      orderBy: { dueDate: 'asc' },
    });
    return sendSuccess(res, tasks);
  } catch (err) { next(err); }
};

const getActivity = async (req, res, next) => {
  try {
    const taskFilter = req.user.role === 'ADMIN' ? {} : { assignedTo: req.user.userId };
    const tasks = await prisma.task.findMany({ where: taskFilter, take: 20, include: taskInclude, orderBy: { createdAt: 'desc' } });
    return sendSuccess(res, tasks);
  } catch (err) { next(err); }
};

module.exports = { getStats, getOverdue, getActivity };
