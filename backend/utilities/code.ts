import { randomInt } from "crypto";
import { ICode } from "../interfaces/interface";
import { CodeModel } from "../model/code";

const FIVE_MINUTES = 1000 * 60 * 5;

export async function generateCode(email: string): Promise<number> {
  const createdAt = new Date();
  const expiresAt = new Date(createdAt.getTime() + FIVE_MINUTES); 

  const code = randomInt(100000, 1000000);

  const codeDoc: ICode = { email, code, createdAt, expiresAt };

  try {
    await CodeModel.deleteMany({ email });
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error("Error deleting old codes:", error.message);
      throw new Error(error.message);
    } else {
      throw new Error("Unknown error deleting old codes");
    }
  }

  await CodeModel.create(codeDoc);

  return code;
}

export async function validateCode(email: string, code: number): Promise<boolean> {
  try {
    const entry = await CodeModel.findOne({ email }).sort({ expiresAt: -1 }).exec();

    if (!entry) return false;

    const now = new Date();
    const isValid = now <= entry.expiresAt && entry.code === code;

    return isValid;
  } catch (error) {
    console.error("Error in validaiton: ", error);
    return false;
  }
}