import { gql } from 'graphql-tag';

export const typeDefs = gql`
  type Query {
    hello: String
  }

  type Mutation {
    sayHello(name: String!): String
  }
`;
