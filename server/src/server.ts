import express from 'express';
import path from 'node:path';
import db from './config/connection.js';
import routes from './routes/index.js';
import { ApolloServer } from '@apollo/server';
import { expressMiddleware } from '@apollo/server/express4';
import { typeDefs } from './graphql/typeDefs.js'; // Define your typeDefs
import { resolvers } from './graphql/resolvers.js'; // Define your resolvers
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware for parsing requests
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Static assets for production
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '../client/build')));
}

// Apollo Server setup
const server = new ApolloServer({
  typeDefs,
  resolvers,
});

await server.start();

app.use(
  '/graphql',
  expressMiddleware(server, {
    context: async ({ req }) => {
      // Attach user to the context for authentication
      const token = req.headers.authorization?.split(' ')[1];
      let user = null;
      if (token) {
        try {
          const secretKey = process.env.JWT_SECRET_KEY || '';
          user = jwt.verify(token, secretKey);
        } catch (err) {
          console.error('Invalid token');
        }
      }
      return { user };
    },
  })
);

// Rest API routes
app.use(routes);

// Connect to the database and start the server
db.once('open', () => {
  app.listen(PORT, () => console.log(`🌍 Now listening on localhost:${PORT}\n🚀 GraphQL at http://localhost:${PORT}/graphql`));
});

