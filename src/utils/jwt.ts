import { JWT_EXPIRES_IN } from '../config/jwt';
import { JWT_SECRET } from '../config/jwt';
import jwt from 'jsonwebtoken';

export const createJWTToken = (user: { id: string; type: string }) =>
  jwt.sign(
    {
      user_id: user.id,
      type: user.type,
    },
    JWT_SECRET,
    {
      expiresIn: JWT_EXPIRES_IN, // token expires 2 hour
    }
  );
