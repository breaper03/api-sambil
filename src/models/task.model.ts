import tsValidMongoDb, { Schema } from 'ts-valid-mongodb';
import { z } from 'zod';

const objectIdRegex = /^[0-9a-fA-F]{24}$/;

const TaskSchema = z.object({
  owner: z.string().refine((val) => objectIdRegex.test(val), {
    message: 'Invalid MongoDB ObjectId',
  }),
  title: z.string().min(3).max(15),
  description: z.string().min(5).max(20),
  state: z.enum(['completed', 'pending', 'progressing']),
  createdAt: z.date(),
  updatedAt: z.date(),
});

type ITask = z.infer<typeof TaskSchema>;

const createTaskModel = (db: tsValidMongoDb) =>
  db.createModel(
    new Schema('task', TaskSchema, {
      versionKey: true,
      indexes: [{ key: { id: 1 }, unique: true }],
    }),
  );

export { createTaskModel, ITask, TaskSchema };
