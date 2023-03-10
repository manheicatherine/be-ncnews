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
    test("returns an array of articles when passing query of valid sorted_by", () => {
      return request(app)
        .get("/api/articles?sort_by=title")
        .expect(200)
        .then(({ body }) => {
          expect(body["articles"].length).toBe(12);
          expect(body.articles).toBeSorted({ descending: true });
          body.articles.forEach((article) => {
            expect(article).toEqual(
              expect.objectContaining({
                article_id: expect.any(Number),
                title: expect.any(String),
                topic: expect.any(String),
                author: expect.any(String),
                body: expect.any(String),
                created_at: expect.any(String),
                votes: expect.any(Number),
                article_img_url: expect.any(String),
                comment_count: expect.any(String),
              })
            );
          });
        });
    });

    test("returns an array of articles when passing query of valid order", () => {
      return request(app)
        .get("/api/articles?order=ASC")
        .expect(200)
        .then(({ body }) => {
          expect(body.articles.length).toBe(12);
          expect(body.articles).toBeSorted({ descending: false });
          body.articles.forEach((article) => {
            expect(article).toEqual(
              expect.objectContaining({
                article_id: expect.any(Number),
                title: expect.any(String),
                topic: expect.any(String),
                author: expect.any(String),
                body: expect.any(String),
                created_at: expect.any(String),
                votes: expect.any(Number),
                article_img_url: expect.any(String),
                comment_count: expect.any(String),
              })
            );
          });
        });
    });

    test("returns an array of articles when passing query of valid topic", () => {
      return request(app)
        .get("/api/articles?topic=mitch")
        .expect(200)
        .then(({ body }) => {
          expect(body.articles).toBeSorted({ descending: true });
          expect(body.articles.length).toBe(11);
          body.articles.forEach((article) => {
            expect(article).toEqual(
              expect.objectContaining({
                article_id: expect.any(Number),
                title: expect.any(String),
                topic: expect.any(String),
                author: expect.any(String),
                body: expect.any(String),
                created_at: expect.any(String),
                votes: expect.any(Number),
                article_img_url: expect.any(String),
                comment_count: expect.any(String),
              })
            );
          });
        });
    });

    test("Error Handling 1: returns 400 bad request when passing invalid sort_by", () => {
      return request(app)
        .get("/api/articles?sort_by=haha")
        .expect(400)
        .then(({ body }) => {
          expect(body.msg).toBe("Bad request");
        });
    });

    test("Error Handling 2: returns 400 bad request of articles when passing invalid order", () => {
      return request(app)
        .get("/api/articles?order=lol")
        .expect(400)
        .then(({ body }) => {
          expect(body.msg).toBe("Bad request");
        });
    });

    test("Error Handling 3: returns 404 not found of articles when passing invalid topic", () => {
      return request(app)
        .get("/api/articles?topic=oic")
        .expect(404)
        .then(({ body }) => {
          expect(body.msg).toBe("404 Not Found");
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
        .post("/api/articles/5/comments")
        .send(reqBody)
        .expect(201);
    });

    test("update an array of article 5 when passing new object", () => {
      const reqBody = { username: "butter_bridge", body: "BELLOOOOOOO" };
      return request(app)
        .post("/api/articles/5/comments")
        .send(reqBody)
        .expect(201)
        .then(({ body }) => {
          expect(body.comment.length).toBe(1);
          body.comment.forEach((comment) => {
            expect(comment).toEqual(
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
        });
    });

    test("Error handling 1: passing a invalid username but existing id", () => {
      return request(app)
        .post("/api/articles/5/comments")
        .send({ username: "Blackpink", body: "Blackpick in your area~" })
        .then(({ body }) => {
          expect(body.msg).toBe("Bad request");
        });
    });

    test("Error handling 2: passing a existing but invalid id and correct username", () => {
      return request(app)
        .post("/api/articles/1234567/comments")
        .send({ username: "butter_bridge", body: "BELLOOOOOOO" })
        .then((res) => {
          expect(res.status).toBe(400);
          expect(res.body.msg).toBe("Bad request");
        });
    });

    test("Error handling 3: passing a non existing id and correct username", () => {
      return request(app)
        .post("/api/articles/kpop/comments")
        .send({ username: "butter_bridge", body: "BELLOOOOOOO" })
        .then(({ body }) => {
          expect(body.msg).toBe("Bad request");
        });
    });
  });

  describe("Ticket 8: PATCH /api/articles/:article_id", () => {
    test("update votes count of article 1 when passing a positive value", () => {
      return request(app)
        .patch("/api/articles/1")
        .send({ inc_votes: 10 })
        .expect(200)
        .then(({ body }) => {
          expect(body.article).toEqual(
            expect.objectContaining({
              author: "butter_bridge",
              title: "Living in the shadow of a great man",
              article_id: 1,
              body: "I find this existence challenging",
              topic: "mitch",
              created_at: "2020-07-09T20:11:00.000Z",
              votes: 110,
            })
          );
        });
    });

    test("update votes count of article 1 when passing a negative value", () => {
      return request(app)
        .patch("/api/articles/1")
        .send({ inc_votes: -10 })
        .expect(200)
        .then(({ body }) => {
          expect(body.article).toEqual(
            expect.objectContaining({
              author: "butter_bridge",
              title: "Living in the shadow of a great man",
              article_id: 1,
              body: "I find this existence challenging",
              topic: "mitch",
              created_at: "2020-07-09T20:11:00.000Z",
              votes: 90,
            })
          );
        });
    });

    test("Error handling 1: passing a valid but not existing article id", () => {
      return request(app)
        .patch("/api/articles/2022")
        .send({ inc_votes: 10 })
        .expect(404)
        .then(({ body }) => {
          expect(body.msg).toBe("404 Not Found");
        });
    });

    test("Error handling 2: passing a non-exisitng article id", () => {
      return request(app)
        .patch("/api/articles/ramenisthebest")
        .send({ inc_votes: 10 })
        .expect(400)
        .then(({ body }) => {
          expect(body.msg).toBe("Bad request");
        });
    });

    test("Error handling 3: passing a non exisitng body of request", () => {
      return request(app)
        .patch("/api/articles/ramenisthebest")
        .send({ haha: 100 })
        .expect(400)
        .then(({ body }) => {
          expect(body.msg).toBe("Bad request");
        });
    });
  });

  describe("Ticket 9: GET /api/users", () => {
    test("returns an array of users", () => {
      return request(app)
        .get("/api/users")
        .expect(200)
        .then(({ body }) => {
          body.users.forEach((user) => {
            expect(body.users.length).toBe(4);
            expect(user).toEqual(
              expect.objectContaining({
                username: expect.any(String),
                name: expect.any(String),
                avatar_url: expect.any(String),
              })
            );
          });
        });
    });
  });

  describe("Ticket 10: Delete /api/comments/:comment_id", () => {
    test("returns an array of users", () => {
      return request(app)
        .delete("/api/comments/1")
        .expect(200)
        .then(({ body }) => {
          expect(body.comment).toEqual(
            expect.objectContaining({
              comment_id: 1,
              body: "Oh, I've got compassion running out of my nose, pal! I'm the Sultan of Sentiment!",
              article_id: 9,
              author: 'butter_bridge',
              votes: 16,
              created_at: '2020-04-06T12:17:00.000Z'
            })
          );
        });
    });
  });
});
