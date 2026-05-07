const { z } = require('zod');

const createTaskSchema = z.object({
  title: z.string().min(1, 'Title is required').max(200),
  description: z.string().max(2000).optional(),
  status: z.enum(['TODO', 'IN_PROGRESS', 'REVIEW', 'COMPLETED']).optional(),
  priority: z.enum(['LOW', 'MEDIUM', 'HIGH', 'CRITICAL']).optional(),
  dueDate: z.string().datetime({ offset: true }).optional().nullable(),
  assignedTo: z.string().uuid('Invalid user ID').optional().nullable(),
  projectId: z.string().uuid('Invalid project ID'),
});

const updateTaskSchema = z.object({
  title: z.string().min(1).max(200).optional(),
  description: z.string().max(2000).optional(),
  status: z.enum(['TODO', 'IN_PROGRESS', 'REVIEW', 'COMPLETED']).optional(),
  priority: z.enum(['LOW', 'MEDIUM', 'HIGH', 'CRITICAL']).optional(),
  dueDate: z.string().datetime({ offset: true }).optional().nullable(),
  assignedTo: z.string().uuid('Invalid user ID').optional().nullable(),
  projectId: z.string().uuid('Invalid project ID').optional(),
});

module.exports = { createTaskSchema, updateTaskSchema };
