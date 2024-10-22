const MOCK_USER = {
  _id: "userId123",
  email: "alex@gmail.com",
  password: "123456",
  comparePassword: jest.fn(),
};

const MOCK_JWT_TOKEN =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiJ1c2VySWQxMjMifQ.8zJgN3J3jgUe5K6iMlT6jX4V7WkKQYv3Z7P9w1y4v7w";

module.exports = {
  MOCK_USER,
  MOCK_JWT_TOKEN,
};
