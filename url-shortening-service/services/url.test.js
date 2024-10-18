const {
  createShortUrl,
  getOriginalUrl,
  updateShortUrl,
  deleteShortUrl,
  getUrlStats,
} = require("./url");
const { validateUrl, generateRandomString } = require("../lib/url");
const Url = require("../models/url");

require("dotenv").config();

jest.mock("../models/url");
jest.mock("../lib/url");

describe("URL Service", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe("createShortUrl", () => {
    it("should throw an error if the URL is invalid", async () => {
      // Mock the validateUrl function to return false
      validateUrl.mockReturnValue(false);

      try {
        await createShortUrl("invalid-url");
      } catch (error) {
        expect(error.message).toBe("Invalid URL");
      }
    });

    it("should return the existing URL if it already exists", async () => {
      const mockFindOne = {
        url: "http://new-url.com",
      };

      // Mock the validateUrl function to return true
      validateUrl.mockReturnValue(true);

      // Mock the findOne function to return an existing URL
      Url.findOne.mockResolvedValue(mockFindOne);

      const savedUrl = await createShortUrl(mockFindOne.url);

      expect(savedUrl).toEqual(mockFindOne);
    });

    it("should save the URL and return it if it does not exist", async () => {
      const url = "http://new-url.com";
      const newShortCode = "xyz789";

      // Mock validateUrl to return true
      validateUrl.mockReturnValue(true);

      // Mock Url.findOne to return null the first time (URL does not exist)
      // and return the newly saved URL the second time
      Url.findOne = jest
        .fn()
        .mockResolvedValueOnce(null) // First call: URL does not exist
        .mockResolvedValueOnce({ url, shortCode: newShortCode }); // Second call: URL saved

      // Mock generateRandomString to return a fixed short code
      generateRandomString.mockReturnValue(newShortCode);

      // Mock the save method to simulate saving the new URL
      Url.prototype.save = jest.fn().mockResolvedValue();

      const result = await createShortUrl(url);

      expect(result).toEqual({ url, shortCode: newShortCode });

      expect(Url.findOne).toHaveBeenCalledTimes(2);
    });
  });

  describe("deleteShortUrl", () => {
    it("should throw an error if the short code is missing", async () => {
      try {
        await deleteShortUrl();
      } catch (error) {
        expect(error.message).toBe("Short code is required");
      }
    });

    it("should delete the URL if it exists", async () => {
      await deleteShortUrl("abc123");

      expect(Url.findOneAndDelete).toHaveBeenCalledWith({
        shortCode: "abc123",
      });
    });
  });
});
