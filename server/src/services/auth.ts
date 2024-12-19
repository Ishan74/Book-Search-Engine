import type { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
dotenv.config();

interface JwtPayload {
  _id: unknown;
  username: string;
  email: string;
}

export const authenticateToken = (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization || req.body?.authorization;

  if (authHeader) {
    const token = authHeader.split(' ')[1];
    const secretKey = process.env.JWT_SECRET_KEY || '';

    jwt.verify(token, secretKey, (err, user) => {
      if (err) {
        return res.status(403).json({ error: 'Forbidden: Invalid or expired token' });
      }

      req.user = user as JwtPayload;
      return next();
    });
  } else {
    return res.status(401).json({ error: 'Unauthorized: Token is missing' });
  }
};

// Utility function to create tokens for authentication
export const signToken = (username: string, email: string, _id: unknown) => {
  const payload = { username, email, _id };
  const secretKey = process.env.JWT_SECRET_KEY || '';

  return jwt.sign(payload, secretKey, { expiresIn: '1h' });
};


import { ApolloServer } from 'apollo-server-express';

const server = new ApolloServer({
  schema: yourGraphQLSchema,
  context: ({ req }) => {
    // Attach the authenticated user to the context
    return { user: req.user };
  },
});
