const { prisma } = require('../prisma/client');
const { sendSuccess, sendError } = require('../utils/response');

const getAll = async (req, res, next) => {
  try {
    const users = await prisma.user.findMany({
      select: { id: true, name: true, email: true, role: true, createdAt: true, _count: { select: { tasks: true, projects: true } } },
      orderBy: { createdAt: 'desc' },
    });
    return sendSuccess(res, users);
  } catch (err) { next(err); }
};

const updateRole = async (req, res, next) => {
  try {
    const user = await prisma.user.findUnique({ where: { id: req.params.id } });
    if (!user) return sendError(res, 'User not found', 404);

    const updated = await prisma.user.update({
      where: { id: req.params.id },
      data: { role: req.body.role },
      select: { id: true, name: true, email: true, role: true, createdAt: true },
    });
    return sendSuccess(res, updated, 'Role updated');
  } catch (err) { next(err); }
};

module.exports = { getAll, updateRole };
