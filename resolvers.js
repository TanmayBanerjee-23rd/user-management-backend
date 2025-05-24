const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const resolvers = {
  Query: {
    employees: async (parent, args, context) => {
      if (!context.user || context.user.role !== 'admin') {
        throw new Error('Unauthorized');
      }
      const { filter, page = 1, limit = 10, sortBy = 'id', order = 'asc' } = args;
      const skip = (page - 1) * limit;
      const orderBy = { [sortBy]: order };
      return prisma.user.findMany({
        where: filter,
        skip,
        take: limit,
        orderBy,
      });
    },
    employee: async (parent, { uuid }, context) => {
      if (!context.user) {
        throw new Error('Unauthorized');
      }
      const user = await prisma.user.findUnique({ where: { loginUuid: uuid } });
      if (!user) {
        throw new Error('User not found');
      }
      return user;
    },
  },
  Mutation: {
    addEmployee: async (parent, { input }, context) => {
      if (!context.user || context.user.role !== 'admin') {
        throw new Error('Unauthorized');
      }
      const passwordSalt = await bcrypt.genSalt();
      input.password = await bcrypt.hash(input.password, passwordSalt);
      return prisma.user.create({ data: input });
    },
    login: async (parent, { email, password }) => {
      const user = await prisma.user.findUnique({ where: { email } });
      if (!user) {
        throw new Error('User not found');
      }
      const valid = await bcrypt.compare(password, user.password); // Assume password field exists
      if (!valid) {
        throw new Error('Invalid password');
      }
      const token = jwt.sign({ loginUuid: user.loginUuid, role: user.role }, 'your-secret-key', { expiresIn: '1h' });
      return { token, user };
    },
    updateEmployee: async (parent, { uuid, input }, context) => {
      if (!context.user || context.user.role !== 'admin') {
        throw new Error('Unauthorized');
      }
      if (input.password) {
        const passwordSalt = await bcrypt.genSalt();
        input.password = await bcrypt.hash(input.password, passwordSalt);
      }
      return prisma.user.update({ where: { loginUuid: uuid }, data: input });
    },
  },
  User: {
    location: (parent) => ({
      city: parent.locationCity,
      country: parent.locationCountry,
      postcode: parent.locationPostcode,
      state: parent.locationState,
      street: {
        number: parent.locationStreetNumber,
        name: parent.locationStreetName,
      },
    }),
    login: (parent) => ({
      uuid: parent.loginUuid,
    }),
    name: (parent) => ({
      title: parent.nameTitle,
      first: parent.nameFirst,
      last: parent.nameLast,
    }),
    picture: (parent) => ({
      large: parent.pictureLarge,
    }),
    registered: (parent) => ({
      date: parent.registeredDate,
      age: parent.registeredAge,
    }),
  },
};

module.exports = resolvers;