const { prisma } = require('../prisma/client');
const { sendSuccess, sendError } = require('../utils/response');

const taskInclude = {
  project: { select: { id: true, title: true } },
  assignee: { select: { id: true, name: true, email: true } },
};

const create = async (req, res, next) => {
  try {
    const data = req.body;
    const project = await prisma.project.findUnique({ where: { id: data.projectId } });
    if (!project) return sendError(res, 'Project not found', 404);

    if (data.assignedTo) {
      const assignee = await prisma.user.findUnique({ where: { id: data.assignedTo } });
      if (!assignee) return sendError(res, 'Assigned user not found', 404);
    }

    const task = await prisma.task.create({
      data: {
        title: data.title,
        description: data.description,
        status: data.status || 'TODO',
        priority: data.priority || 'MEDIUM',
        dueDate: data.dueDate ? new Date(data.dueDate) : null,
        assignedTo: data.assignedTo || null,
        projectId: data.projectId,
      },
      include: taskInclude,
    });

    return sendSuccess(res, task, 'Task created', 201);
  } catch (err) { next(err); }
};

const getAll = async (req, res, next) => {
  try {
    const { status, priority, projectId, search } = req.query;
    const where = {};
    if (req.user.role !== 'ADMIN') where.assignedTo = req.user.userId;
    if (status) where.status = status;
    if (priority) where.priority = priority;
    if (projectId) where.projectId = projectId;
    if (search) where.title = { contains: search, mode: 'insensitive' };

    const tasks = await prisma.task.findMany({ where, include: taskInclude, orderBy: { createdAt: 'desc' } });
    return sendSuccess(res, tasks);
  } catch (err) { next(err); }
};

const getById = async (req, res, next) => {
  try {
    const task = await prisma.task.findUnique({ where: { id: req.params.id }, include: taskInclude });
    if (!task) return sendError(res, 'Task not found', 404);
    return sendSuccess(res, task);
  } catch (err) { next(err); }
};

const update = async (req, res, next) => {
  try {
    const task = await prisma.task.findUnique({ where: { id: req.params.id } });
    if (!task) return sendError(res, 'Task not found', 404);

    if (req.user.role !== 'ADMIN' && task.assignedTo !== req.user.userId) {
      return sendError(res, 'You can only update tasks assigned to you', 403);
    }

    if (req.user.role !== 'ADMIN') {
      const forbidden = Object.keys(req.body).filter((f) => f !== 'status');
      if (forbidden.length) return sendError(res, 'Members can only update status', 403);
    }

    const updateData = { ...req.body };
    if (updateData.dueDate !== undefined) {
      updateData.dueDate = updateData.dueDate ? new Date(updateData.dueDate) : null;
    }

    const updated = await prisma.task.update({ where: { id: req.params.id }, data: updateData, include: taskInclude });
    return sendSuccess(res, updated, 'Task updated');
  } catch (err) { next(err); }
};

const remove = async (req, res, next) => {
  try {
    const task = await prisma.task.findUnique({ where: { id: req.params.id } });
    if (!task) return sendError(res, 'Task not found', 404);
    await prisma.task.delete({ where: { id: req.params.id } });
    return sendSuccess(res, null, 'Task deleted');
  } catch (err) { next(err); }
};

module.exports = { create, getAll, getById, update, remove };
