const { prisma } = require('../prisma/client');
const { sendSuccess, sendError } = require('../utils/response');

const creatorSelect = { select: { id: true, name: true, email: true, role: true } };

const create = async (req, res, next) => {
  try {
    const project = await prisma.project.create({
      data: { title: req.body.title, description: req.body.description, createdBy: req.user.userId },
      include: { creator: creatorSelect },
    });
    return sendSuccess(res, project, 'Project created', 201);
  } catch (err) { next(err); }
};

const getAll = async (req, res, next) => {
  try {
    const where = req.user.role === 'ADMIN' ? {} : { tasks: { some: { assignedTo: req.user.userId } } };
    const projects = await prisma.project.findMany({
      where,
      include: { creator: { select: { id: true, name: true, email: true } }, _count: { select: { tasks: true } } },
      orderBy: { createdAt: 'desc' },
    });
    return sendSuccess(res, projects);
  } catch (err) { next(err); }
};

const getById = async (req, res, next) => {
  try {
    const project = await prisma.project.findUnique({
      where: { id: req.params.id },
      include: {
        creator: creatorSelect,
        tasks: {
          include: {
            assignee: { select: { id: true, name: true, email: true } },
            project: { select: { id: true, title: true } },
          },
          orderBy: { createdAt: 'desc' },
        },
      },
    });
    if (!project) return sendError(res, 'Project not found', 404);
    return sendSuccess(res, project);
  } catch (err) { next(err); }
};

const update = async (req, res, next) => {
  try {
    const exists = await prisma.project.findUnique({ where: { id: req.params.id } });
    if (!exists) return sendError(res, 'Project not found', 404);

    const project = await prisma.project.update({
      where: { id: req.params.id },
      data: req.body,
      include: { creator: { select: { id: true, name: true, email: true } } },
    });
    return sendSuccess(res, project, 'Project updated');
  } catch (err) { next(err); }
};

const remove = async (req, res, next) => {
  try {
    const exists = await prisma.project.findUnique({ where: { id: req.params.id } });
    if (!exists) return sendError(res, 'Project not found', 404);
    await prisma.project.delete({ where: { id: req.params.id } });
    return sendSuccess(res, null, 'Project deleted');
  } catch (err) { next(err); }
};

module.exports = { create, getAll, getById, update, remove };
