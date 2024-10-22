const { login, signUp } = require("../../services/auth");
const User = require("../../models/user");
const { signToken } = require("../../libs/jwt");
const { MOCK_USER, MOCK_JWT_TOKEN } = require("../mockData");

jest.mock("../../models/user");
jest.mock("../../libs/jwt");

const { _id, email, password, comparePassword } = MOCK_USER;

describe("Auth Service", () => {
  describe("login", () => {
    it("should throw an error if user is not found", async () => {
      try {
        User.findOne.mockResolvedValue(null);
      } catch (error) {
        expect(login(email, password)).rejects.toThrow("User not found");
      }
    });

    it("should throw an error if password is invalid", async () => {
      try {
        User.findOne.mockResolvedValue({ comparePassword: comparePassword });

        comparePassword.mockResolvedValue(false);
      } catch (error) {
        expect(login(email, password)).rejects.toThrow("Invalid password");
      }
    });

    it("should return a token if login is successful", async () => {
      User.findOne.mockResolvedValue({ _id, comparePassword: comparePassword });

      comparePassword.mockResolvedValue(true);
      signToken.mockReturnValue(MOCK_JWT_TOKEN);

      const token = await login(email, password);

      expect(token).toBe(MOCK_JWT_TOKEN);
      expect(signToken).toHaveBeenCalledWith(_id);
    });
  });

  describe("signUp", () => {
    it("should return a token if sign up is successful", async () => {
      User.mockReturnValue({ save: jest.fn() });
      signToken.mockReturnValue(MOCK_JWT_TOKEN);

      const token = await signUp(email, password);

      expect(token).toBe(MOCK_JWT_TOKEN);
      expect(signToken).toHaveBeenCalledWith(_id);
    });
  });
});
