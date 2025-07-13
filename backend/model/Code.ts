import { Schema, model } from "mongoose";
import { ICode } from "../interfaces/interface";


const codeSchema = new Schema<ICode>({
  email: { type: String, required: true },
  code: { type: Number, required: true },
  createdAt: { type: Date, default: Date.now },
  expiresAt: { type: Date, required: true },
});


codeSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

export const CodeModel = model<ICode>("Code", codeSchema);
