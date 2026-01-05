import { jest, describe, it, expect, afterEach } from "@jest/globals";
import request from "supertest";

/**
 * Mock puppeteer BEFORE importing app
 */
const launchMock = jest.fn();

jest.unstable_mockModule("puppeteer", () => ({
  default: {
    launch: launchMock,
  },
}));

/**
 * Dynamically import AFTER mocking
 */
const puppeteer = await import("puppeteer");
const { default: app } = await import("../app.js");

describe("Markdown to PDF API", () => {
  beforeAll(() => {
    jest.spyOn(console, "error").mockImplementation(() => {});
  });

  afterAll(() => {
    console.error.mockRestore();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe("GET /", () => {
    it("should return the main page", async () => {
      const res = await request(app).get("/");
      expect(res.status).toBe(200);
    });
  });

  describe("POST /convert", () => {
    it("should return 400 if markdown is empty", async () => {
      const res = await request(app)
        .post("/convert")
        .send({ markdown: "" });

      expect(res.status).toBe(400);
      expect(res.text).toBe("Markdown is empty");
    });

    it("should generate a PDF from markdown", async () => {
      launchMock.mockResolvedValueOnce({
        newPage: async () => ({
          setContent: jest.fn(),
          pdf: async () => Buffer.from("fake-pdf"),
        }),
        close: jest.fn(),
      });

      const res = await request(app)
        .post("/convert")
        .send({ markdown: "# Hello" });

      expect(res.status).toBe(200);
      expect(res.headers["content-type"]).toBe("application/pdf");
      expect(launchMock).toHaveBeenCalled();
    });

    it("should return 500 if puppeteer throws", async () => {
      launchMock.mockRejectedValueOnce(new Error("Puppeteer failed"));

      const res = await request(app)
        .post("/convert")
        .send({ markdown: "# Fail" });

      expect(res.status).toBe(500);
      expect(res.text).toBe("Error generating PDF");
    });
  });
});
