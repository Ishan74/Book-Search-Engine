export const resolvers = {
    Query: {
      hello: () => 'Hello, world!',
    },
    Mutation: {
      sayHello: (_, { name }) => `Hello, ${name}!`,
    },
  };
  