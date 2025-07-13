import jwt  from 'jsonwebtoken';

export interface UserPayload {
    email: string;
    mfaCompleted?: boolean;
}

const JWT_KEY = process.env.JWT_KEY as string

export const generateToken = (userPayload: UserPayload) =>{
    if(!JWT_KEY) throw new Error('No JWT_KEY')

    return jwt.sign(userPayload, JWT_KEY, {expiresIn: '1h'})
}

export const verifyToken = (token: string): UserPayload =>{
    try{
        return jwt.verify(token, JWT_KEY) as UserPayload
    } catch{ 
        throw new Error ('Invalid token')
    }
}
