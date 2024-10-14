import tsValidMongoDb, { Schema } from 'ts-valid-mongodb';
import { z } from 'zod';

const UserSchema = z.object({
  email: z.string().email().trim(),
  password: z.string().min(8),
  createdAt: z.date(),
  updatedAt: z.date()
});

type IUser = z.infer<typeof UserSchema>;

const createUserModel = (db: tsValidMongoDb) =>
  db.createModel(
    new Schema('users', UserSchema, {
      versionKey: true
    })
  );

export { IUser, createUserModel, UserSchema };
