const { prisma } = require('../prisma/client');
const { sendSuccess, sendError } = require('../utils/response');

const userSelect = { select: { id: true, name: true, email: true, role: true } };

const create = async (req, res, next) => {
  try {
    const task = await prisma.task.findUnique({ where: { id: req.params.taskId } });
    if (!task) return sendError(res, 'Task not found', 404);

    const comment = await prisma.comment.create({
      data: { content: req.body.content, taskId: req.params.taskId, userId: req.user.userId },
      include: { user: userSelect },
    });
    return sendSuccess(res, comment, 'Comment added', 201);
  } catch (err) { next(err); }
};

const getByTask = async (req, res, next) => {
  try {
    const comments = await prisma.comment.findMany({
      where: { taskId: req.params.taskId },
      include: { user: userSelect },
      orderBy: { createdAt: 'desc' },
    });
    return sendSuccess(res, comments);
  } catch (err) { next(err); }
};

const remove = async (req, res, next) => {
  try {
    const comment = await prisma.comment.findUnique({ where: { id: req.params.id } });
    if (!comment) return sendError(res, 'Comment not found', 404);
    if (req.user.role !== 'ADMIN' && comment.userId !== req.user.userId) {
      return sendError(res, 'You can only delete your own comments', 403);
    }
    await prisma.comment.delete({ where: { id: req.params.id } });
    return sendSuccess(res, null, 'Comment deleted');
  } catch (err) { next(err); }
};

module.exports = { create, getByTask, remove };
