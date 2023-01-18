const request = require("supertest");
const testData = require("../db/data/test-data");
const { app } = require("../app");
const seed = require("../db/seeds/seed");
const db = require("../db/connection");
require("jest-sorted");

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
          expect(objOfArr[0].created_at).toBe("2020-11-03T09:12:00.000Z");
          expect(objOfArr[objOfArr.length - 1].created_at).toBe(
            "2020-01-07T14:08:00.000Z"
          );
        });
    });
  });

  describe("Ticket 5: GET /api/articles/:article_id", () => {
    test("returns an array of article 1", () => {
      return request(app)
        .get("/api/articles/1")
        .expect(200)
        .then(({ body }) => {
          const article = body.article;
          expect(article.length).toBe(1);
          expect(article).toEqual([
            {
              article_id: 1,
              title: "Living in the shadow of a great man",
              topic: "mitch",
              author: "butter_bridge",
              body: "I find this existence challenging",
              created_at: "2020-07-09T20:11:00.000Z",
              votes: 100,
              article_img_url:
                "https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700",
            },
          ]);
        });
    });
    test("Error handling 1: passing a valid but not existing id", () => {
      return request(app)
        .get("/api/articles/100")
        .expect(404)
        .then(({ body }) => {
          expect(body.msg).toBe("404 Not Found");
        });
    });

    test("Error handling 2: passing a invalid id", () => {
      return request(app)
        .get("/api/articles/hellokitty")
        .expect(400)
        .then(({ body }) => {
          expect(body.msg).toBe("Bad request");
        });
    });
  });

  describe("Ticket 6: GET /api/articles/:article_id/comments", () => {
    test("returns an array of article 1 the most recent comments in descending order", () => {
      return request(app)
        .get("/api/articles/1/comments")
        .expect(200)
        .then(({ body }) => {
          const { comments } = body;

          expect(comments.length).toBe(11);

          body.comments.forEach((article) => {
            expect(article).toEqual(
              expect.objectContaining({
                comment_id: expect.any(Number),
                body: expect.any(String),
                article_id: expect.any(Number),
                author: expect.any(String),
                votes: expect.any(Number),
                created_at: expect.any(String),
              })
            );
          });

          expect(comments[0].created_at).toBe("2020-11-03T21:00:00.000Z");
          expect(comments[comments.length - 1].created_at).toBe(
            "2020-01-01T03:08:00.000Z"
          );
        });
    });

    test("returns empty array when a valid number is passing with no comments", () => {
      return request(app)
        .get("/api/articles/2/comments")
        .expect(200)
        .then(({ body }) => {
          expect(body).toEqual({});
        });
    });

    test("Error handling 1: passing a valid but not existing id", () => {
      return request(app)
        .get("/api/articles/1001/comments")
        .expect(404)
        .then(({ body }) => {
          expect(body.msg).toBe("404 Not Found");
        });
    });

    test("Error handling 2: passing a invalid id", () => {
      return request(app)
        .get("/api/articles/whereismyholiday/comments")
        .expect(400)
        .then(({ body }) => {
          expect(body.msg).toBe("Bad request");
        });
    });
  });

  describe("Ticket 7: POST /api/articles/:article_id/comments", () => {
      test("return the status of 201", () => {
        const reqBody = { username: "butter_bridge", body: "BELLOOOOOOO" };
        return request(app)
        .post('/api/articles/5/comments')
        .send(reqBody)
        .expect(201);
    });
    test("update an array of article 5 when passing new object", () => {
      const reqBody = { username: "butter_bridge", body: "BELLOOOOOOO" };
      return request(app)
      .post('/api/articles/5/comments')
      .send(reqBody)
      .expect(201)
      .then(({body})=>{
        console.log(body);
        expect(body.comment.length).toBe(1);
        body.comment.forEach((comment) => {
          expect(comment).toEqual(
            expect.objectContaining({
              comment_id: expect.any(Number),
              body: expect.any(String),
              article_id: expect.any(Number),
              author: expect.any(String),
              votes: expect.any(Number),
              created_at: expect.any(String)
            })
          );
        });
    });
  });
  });



});
