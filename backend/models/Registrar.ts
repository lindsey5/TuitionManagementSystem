import mongoose, { Schema, Document, Types } from 'mongoose';
import { hashPassword } from '../utils/auth';

export interface IRegistrar extends Document {
  firstname: string;
  lastname: string;
  email: string;
  password: string;
}

// Define the schema
const RegistrarSchema: Schema<IRegistrar> = new Schema(
  {
    firstname: {
      type: String,
      required: true,
      trim: true,
    },
    lastname: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      required: true,
      minlength: 6,
    },
  },
  { timestamps: true }
);

// Hash password before save
RegistrarSchema.pre<IRegistrar>('save', async function (next) {
  if (!this.isModified('password')) {
    return next();
  }
  this.password = await hashPassword(this.password);
  next();
});

// Create the model
const Registrar = mongoose.model<IRegistrar>('Registrar', RegistrarSchema);

export default Registrar;