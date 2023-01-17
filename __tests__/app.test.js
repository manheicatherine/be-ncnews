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
    // test("returns an array of articles which is sorted by date in descending order ", () => {
    //   return request(app)
    //     .get("/api/articles")
    //     .expect(200)
    //     .then(({ body }) => {
    //       body.articles.forEach((articles) => {
    //         expect(articles).toEqual(
    //           expect.objectContaining({
    //             article_id: expect.any(Number),
    //             title: expect.any(String),
    //             topic: expect.any(String),
    //             author: expect.any(String),
    //             created_at: expect.any(Number),
    //             votes: expect.any(Number),
    //             article_img_url: expect.any(String),
    //             comment_count: expect.any(String),
    //           })
    //         );
    //         expect(body.length).toBe(12);
    //       });
    //     });
    // });
    test("Error handling", () => {
      return request(app)
        .get("/api/articles")
        .expect(204)
        .then(({body}) => {
            expect(body.msg).toBe('Path not found!')
        });
    });
  });
});
