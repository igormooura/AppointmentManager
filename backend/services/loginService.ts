import { CodeModel } from "../model/code";
import { validateCode } from "../utilities/code";

interface LoginResult {
  email: string;
  authenticated: boolean;
  message?: string;
}

export async function loginService(email: string, code: number): Promise<LoginResult | null> {
  try {
    const codeEntry = await CodeModel.findOne({ email }).sort({ expiresAt: -1 }).exec();

    if (!codeEntry) {
      return {
        email,
        authenticated: false,
        message: "Code not found. Please request a new one.",
      };
    }

    const now = new Date();

    const isExpired = now > codeEntry.expiresAt;
    const isMatch = codeEntry.code === code;

    if (!isMatch) {
      return {
        email,
        authenticated: false,
        message: "Incorrect code.",
      };
    }

    if (isExpired) {
      return {
        email,
        authenticated: false,
        message: "Code has expired.",
      };
    }

    // código foi usado, deletar
    await CodeModel.deleteMany({ email });

    return {
      email,
      authenticated: true,
    };
  } catch (error: unknown) {
    console.error("Error in loginService:", error);
    return null;
  }
}
