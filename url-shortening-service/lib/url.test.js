const { validateUrl, generateRandomString } = require("./url");

describe("validateUrl", () => {
  test("should return true for a valid URL with http", () => {
    const url = "http://example.com";
    expect(validateUrl(url)).toBe(true);
  });

  test("should return true for a valid URL with https", () => {
    const url = "https://example.com";
    expect(validateUrl(url)).toBe(true);
  });

  test("should return true for a valid URL with subdomain", () => {
    const url = "https://sub.example.com";
    expect(validateUrl(url)).toBe(true);
  });

  test("should return true for a valid URL with port", () => {
    const url = "https://example.com:8080";
    expect(validateUrl(url)).toBe(true);
  });

  test("should return true for a valid URL with path", () => {
    const url = "https://example.com/path";
    expect(validateUrl(url)).toBe(true);
  });

  test("should return true for a valid URL with query string", () => {
    const url = "https://example.com/path?name=value";
    expect(validateUrl(url)).toBe(true);
  });

  test("should return true for a valid URL with fragment", () => {
    const url = "https://example.com/path#section";
    expect(validateUrl(url)).toBe(true);
  });

  test("should return false for an invalid URL", () => {
    const url = "htp://example";

    try {
      validateUrl(url);
    } catch (error) {
      expect(error.message).toBe("Invalid URL");
    }
  });

  test("should return false for a string that is not a URL", () => {
    const url = "not a url";

    try {
      validateUrl(url);
    } catch (error) {
      expect(error.message).toBe("Invalid URL");
    }
  });

  test("should return false for an empty string", () => {
    const url = "";

    try {
      validateUrl(url);
    } catch (error) {
      expect(error.message).toBe("Invalid URL");
    }
  });
});

describe("generateRandomString", () => {
  test("should generate random string", () => {
    expect(generateRandomString()).toHaveLength(6);
  });

  test("should generate different strings", () => {
    const randomString1 = generateRandomString();
    const randomString2 = generateRandomString();
    expect(randomString1).not.toEqual(randomString2);
  });
});
