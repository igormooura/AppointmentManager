import { CodeModel } from "../model/code";
import { validateCode } from "../utilities/code";
import { generateToken } from "../utilities/jwt";

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

    // code was used, delete it
    await CodeModel.deleteMany({ email });

    // JWT
    const token: string = generateToken({ email, mfaCompleted: validated}) 

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
