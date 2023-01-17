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

  describe("Ticket 4: GET /api/articles", () => {
    test("returns an array of articles which is sorted by date in descending order ", () => {
      return request(app)
        .get("/api/articles")
        .expect(200)
        .then(({ body }) => {
          const objOfArr = body.articles;
          expect(objOfArr.length).toBe(12);
        });
    });
  });

  describe("Ticket 5: GET /api/articles/:article_id", () => {
    test("returns an array of article 1", () => {
      return request(app)
        .get("/api/articles/1")
        .expect(200)
        .then(({ body }) => {
          const objOfArr = body.articles;
          expect(objOfArr.length).toBe(1);

          objOfArr.forEach((obj) => {
            expect(obj).toEqual(
              expect.objectContaining({
                article_id: expect.any(Number),
                title: expect.any(String),
                topic: expect.any(String),
                author: expect.any(String),
                body: expect.any(String),
                created_at: expect.any(String),
                votes: expect.any(Number),
                article_img_url: expect.any(String),
              })
            );
          });
        });
    });
    test("Error handling 1: passing a valid but not existing id", () => {
      return request(app)
        .get("/api/articles/100")
        .expect(404)
        .then(({body}) => {
          expect(body.msg).toBe("404 Not Found");
        });
    });

    test("Error handling 2: passing a invalid id", () => {
        return request(app)
          .get("/api/articles/hellokitty")
          .expect(400)
          .then(({body}) => {
            expect(body.msg).toBe("Bad request");
          });
      });
  });
});
