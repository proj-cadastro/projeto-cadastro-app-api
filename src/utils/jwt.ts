import jwt from 'jsonwebtoken';

const secret = process.env.JWT_SECRET || 'secreto123';



export function generateToken(payload: object, expiresIn: string | number = '1h') {
  return jwt.sign(payload, secret, { expiresIn } as jwt.SignOptions);
}

export function verifyToken(token: string) {
  return jwt.verify(token, secret);
}
