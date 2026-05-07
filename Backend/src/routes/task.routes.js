const { Router } = require('express');
const ctrl = require('../controllers/task.controller');
const { authenticate, authorize } = require('../middleware/auth.middleware');
const { validate } = require('../middleware/validate.middleware');
const { createTaskSchema, updateTaskSchema } = require('../validators/task.validator');

const router = Router();
router.use(authenticate);

router.post('/', authorize('ADMIN'), validate(createTaskSchema), ctrl.create);
router.get('/', ctrl.getAll);
router.get('/:id', ctrl.getById);
router.put('/:id', validate(updateTaskSchema), ctrl.update);
router.delete('/:id', authorize('ADMIN'), ctrl.remove);

module.exports = router;
