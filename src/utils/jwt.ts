import { JWT_EXPIRES_IN } from '../config/jwt';
import { JWT_SECRET } from '../config/jwt';
import jwt from 'jsonwebtoken';

export const createJWTToken = (user: { id: string; user_type: string }) =>
  jwt.sign(
    {
      user_id: user.id,
      user_type: user.user_type,
    },
    JWT_SECRET,
    {
      expiresIn: JWT_EXPIRES_IN, // token expires 2 hour
    }
  );
