const { prisma } = require('../prisma/client');
const { hashPassword, comparePassword } = require('../utils/password');
const { generateToken } = require('../utils/token');
const { sendSuccess, sendError } = require('../utils/response');

const userSelect = { id: true, name: true, email: true, role: true, createdAt: true };

const register = async (req, res, next) => {
  try {
    const { name, email, password } = req.body;
    const exists = await prisma.user.findUnique({ where: { email } });
    if (exists) return sendError(res, 'A user with this email already exists', 409);

    const user = await prisma.user.create({
      data: { name, email, password: await hashPassword(password), role: 'MEMBER' },
      select: userSelect,
    });

    const token = generateToken({ userId: user.id, role: user.role });
    return sendSuccess(res, { user, token }, 'User registered', 201);
  } catch (err) { next(err); }
};

const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) return sendError(res, 'Invalid email or password', 401);

    const valid = await comparePassword(password, user.password);
    if (!valid) return sendError(res, 'Invalid email or password', 401);

    const { password: _, ...safe } = user;
    const token = generateToken({ userId: user.id, role: user.role });
    return sendSuccess(res, { user: safe, token }, 'Login successful');
  } catch (err) { next(err); }
};

const getMe = async (req, res, next) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.user.userId },
      select: { ...userSelect, _count: { select: { projects: true, tasks: true } } },
    });
    if (!user) return sendError(res, 'User not found', 404);
    return sendSuccess(res, user);
  } catch (err) { next(err); }
};

const updateProfile = async (req, res, next) => {
  try {
    const user = await prisma.user.update({
      where: { id: req.user.userId },
      data: { name: req.body.name },
      select: userSelect,
    });
    return sendSuccess(res, user, 'Profile updated');
  } catch (err) { next(err); }
};

const changePassword = async (req, res, next) => {
  try {
    const user = await prisma.user.findUnique({ where: { id: req.user.userId } });
    if (!user) return sendError(res, 'User not found', 404);

    const valid = await comparePassword(req.body.currentPassword, user.password);
    if (!valid) return sendError(res, 'Current password is incorrect', 400);

    await prisma.user.update({ where: { id: req.user.userId }, data: { password: await hashPassword(req.body.newPassword) } });
    return sendSuccess(res, null, 'Password changed');
  } catch (err) { next(err); }
};

module.exports = { register, login, getMe, updateProfile, changePassword };
