import jwt from "jsonwebtoken";


const SECRET=process.env.JWT_SECRET

export function generateToken(paylod:any){
    return jwt.sign(paylod,SECRET,{expiresIn:'1d'})
}

export function verifyToken(token:string){
    return jwt.verify(token,SECRET)
}