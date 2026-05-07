const { Router } = require('express');
const ctrl = require('../controllers/user.controller');
const { authenticate, authorize } = require('../middleware/auth.middleware');
const { validate } = require('../middleware/validate.middleware');
const { z } = require('zod');

const roleSchema = z.object({ role: z.enum(['ADMIN', 'MEMBER']) });

const router = Router();
router.use(authenticate);

router.get('/', ctrl.getAll);
router.put('/:id/role', authorize('ADMIN'), validate(roleSchema), ctrl.updateRole);

module.exports = router;
