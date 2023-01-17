const request = require("supertest");
const testData = require("../db/data/test-data");
const { app } = require("../app");
const seed = require("../db/seeds/seed");
const db = require("../db/connection");

beforeEach(() => seed(testData));
afterAll(() => {
  db.end();
});

describe("API Testing", () => {
  describe("Ticket 3: GET /api/topics", () => {
    test("returns an array of topics", () => {
      return request(app)
        .get("/api/topics")
        .expect(200)
        .then(({ body }) => {
          body.topics.forEach((topic) => {
            expect(topic).toEqual(
              expect.objectContaining({
                slug: expect.any(String),
                description: expect.any(String),
              })
            );
          });
        });
    });
  });

  describe.only("Ticket 4: GET /api/articles", () => {
    test("returns an array of articles which is sorted by date in descending order ", () => {
      return request(app)
        .get("/api/articles")
        .expect(200)
        .then(({body}) => {
            const objOfArr = body.articles
            expect(objOfArr.length).toBe(12);
        });
    });
  });
});