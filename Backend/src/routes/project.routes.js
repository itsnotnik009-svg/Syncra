const { Router } = require('express');
const ctrl = require('../controllers/project.controller');
const { authenticate, authorize } = require('../middleware/auth.middleware');
const { validate } = require('../middleware/validate.middleware');
const { createProjectSchema, updateProjectSchema } = require('../validators/project.validator');

const router = Router();
router.use(authenticate);

router.post('/', authorize('ADMIN'), validate(createProjectSchema), ctrl.create);
router.get('/', ctrl.getAll);
router.get('/:id', ctrl.getById);
router.put('/:id', authorize('ADMIN'), validate(updateProjectSchema), ctrl.update);
router.delete('/:id', authorize('ADMIN'), ctrl.remove);

module.exports = router;
