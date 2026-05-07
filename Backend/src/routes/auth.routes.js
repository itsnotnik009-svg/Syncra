const { Router } = require('express');
const ctrl = require('../controllers/auth.controller');
const { validate } = require('../middleware/validate.middleware');
const { authenticate } = require('../middleware/auth.middleware');
const { registerSchema, loginSchema } = require('../validators/auth.validator');
const { z } = require('zod');

const profileSchema = z.object({ name: z.string().min(2, 'Name must be at least 2 characters') });
const passwordSchema = z.object({
  currentPassword: z.string().min(1, 'Current password is required'),
  newPassword: z.string().min(8, 'New password must be at least 8 characters'),
});

const router = Router();

router.post('/register', validate(registerSchema), ctrl.register);
router.post('/login', validate(loginSchema), ctrl.login);
router.get('/me', authenticate, ctrl.getMe);
router.put('/profile', authenticate, validate(profileSchema), ctrl.updateProfile);
router.put('/password', authenticate, validate(passwordSchema), ctrl.changePassword);

module.exports = router;
