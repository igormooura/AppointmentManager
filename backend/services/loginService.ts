import { CodeModel } from "../model/code";
import jwt from "jsonwebtoken"
import { validateCode } from "../utilities/code";

interface LoginResult {
  email: string;
  authenticated: boolean;
  message?: string;
  token?: string;
}

export async function loginService(email: string, code: number): Promise<LoginResult | null> {
  try {
    
    const validated = await validateCode(email, code)

    if(!validated){
       return { email, authenticated: false, message: "expired/invalid code." };
    }

    // código foi usado, deletar
    await CodeModel.deleteMany({ email });

    const token = jwt.sign({ email }, process.env.JWT_SECRET!, { expiresIn: "1h" });

    return {
      email,
      authenticated: true,
      token
    };
  } catch (error: unknown) {
    console.error("Error in loginService:", error);
    return null;
  }
}
