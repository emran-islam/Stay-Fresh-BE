import testData from "../db/data/test-data/index";
import seedOne from "../db/seeds/seed";
import connection from "../db/connection";
import request from "supertest";
import app from "../app";

beforeEach(() => {
  return seedOne(testData);
});

afterAll(() => {
  return connection.end();
});

describe("/api", () => {
  describe("Request on invalid endpoint", () => {
    test("404: api request to an invalid endpoint results in error message", () => {
      return request(app)
        .get("/apii")
        .expect(404)
        .then((response) => {
          expect(response.body.msg).toBe("Not Found - Invalid Endpoint");
        });
    });
  });

  describe("GET /api", () => {
    test("should provide description about all other available endpoints", () => {
      return request(app)
        .get("/api")
        .expect(200)
        .then((res) => {
          const actualEndpoints = res.body;
          for (const endpoint in actualEndpoints) {
            expect(typeof actualEndpoints[endpoint].description).toBe("string");
            expect(Array.isArray(actualEndpoints[endpoint].queries)).toBe(true);
            expect(typeof actualEndpoints[endpoint].requestFormat).toBe(
              "object"
            );
            expect(typeof actualEndpoints[endpoint].exampleResponse).toBe(
              "object"
            );
          }
        });
    });
  });

  describe("GET /items", () => {
    test("GET 200: sends an array of all item objects", () => {
      return request(app)
        .get("/api/items")
        .expect(200)
        .then(({ body }) => {
          const { items } = body;
          expect(items.length > 0).toBe(true);
          items.forEach((item) => {
            expect(typeof item.item_id).toBe("number");
            expect(typeof item.item_name).toBe("string");
            expect(typeof item.item_price).toBe("number");
            expect(typeof item.purchase_date).toBe("string");
            expect(typeof item.expiry_date).toBe("string");
            expect(typeof item.home_id).toBe("number");
            expect(typeof item.item_status).toBe("string");
          });
        });
    });
  });

  describe("GET /homes", () => {
    test("GET 200: sends an array of all home objects", () => {
      return request(app)
        .get("/api/homes")
        .expect(200)
        .then(({ body }) => {
          const { homes } = body;
          expect(homes.length > 0).toBe(true);
          homes.forEach((home) => {
            expect(typeof home.home_id).toBe("number");
            expect(typeof home.home_name).toBe("string");
          });
        });
    });
  });

  describe("GET /homes/:home_id/items", () => {
    test("GET 200: sends an array of item objects for a specific home", () => {
      return request(app)
        .get("/api/homes/1/items")
        .expect(200)
        .then(({ body }) => {
          const { items } = body;
          expect(items.length > 0).toBe(true);
          items.forEach((item) => {
            expect(typeof item.item_id).toBe("number");
            expect(typeof item.item_name).toBe("string");
            expect(typeof item.item_price).toBe("number");
            expect(typeof item.purchase_date).toBe("string");
            expect(typeof item.expiry_date).toBe("string");
            expect(typeof item.home_id).toBe("number");
            expect(typeof item.item_status).toBe("string");
            expect(item.home_id).toBe(1);
          });
        });
    });

    test("404: send an appropiate error message when sending a valid but non existent home id", () => {
      return request(app)
        .get("/api/homes/999999/items")
        .expect(404)
        .then(({ body }) => {
          expect(body.msg).toBe("home does not exist");
        });
    });

    test("400: send an appropiate error message when sending a invalid home id", () => {
      return request(app)
        .get("/api/homes/nonsense/items")
        .expect(400)
        .then(({ body }) => {
          expect(body.msg).toBe("bad request");
        });
    });
  });

  describe("POST /homes/:home_id/items", () => {
    test("POST 201: adds a new item for an home", () => {
      return request(app)
        .post("/api/homes/1/items")
        .send({
          item_name: "cheese",
          item_price: 300,
          purchase_date: "2024-02-21T19:33:50.000Z",
          expiry_date: "2024-03-21T19:33:50.000Z",
        })
        .expect(201)
        .then(({ body }) => {
          const item = body.item;
          expect(item.item_id).toBe(6);
          expect(item.item_name).toBe("cheese");
          expect(item.item_price).toBe(300);
          expect(item.purchase_date).toBe("2024-02-21T19:33:50.000Z");
          expect(item.expiry_date).toBe("2024-03-21T19:33:50.000Z");
          expect(item.home_id).toBe(1);
          expect(item.item_status).toBe("ACTIVE");
        });
    });
    test("POST 400: will return appropriate error message and status if request body is missing mandatory parameters", () => {
      return request(app)
        .post("/api/homes/1/items")
        .send({
          item_price: 300,
          purchase_date: "2024-02-21T19:33:50.000Z",
          expiry_date: "2024-03-21T19:33:50.000Z",
        })
        .expect(400)
        .then(({ body }) => {
          expect(body.msg).toBe("bad request");
        });
    });

    test("POST 400: will return appropriate error message and status if request body has purchase price in wrong format", () => {
      return request(app)
        .post("/api/homes/1/items")
        .send({
          item_name: "cheese",
          item_price: "three hundred",
          purchase_date: "2024-02-21T19:33:50.000Z",
          expiry_date: "2024-03-21T19:33:50.000Z",
        })
        .expect(400)
        .then(({ body }) => {
          expect(body.msg).toBe("bad request");
        });
    });

    test("POST 400: will return appropriate error message and status if request body has date in wrong format", () => {
      return request(app)
        .post("/api/homes/1/items")
        .send({
          item_name: "cheese",
          item_price: 300,
          purchase_date: "1st Feb 2024",
          expiry_date: "2024-03-21T19:33:50.000Z",
        })
        .expect(400)
        .then(({ body }) => {
          expect(body.msg).toBe("invalid timestamp");
        });
    });

        test("POST 400: will return appropriate error message and status if home id is invalid", () => {
          return request(app)
            .post("/api/homes/nonsense/items")
            .send({
              item_name: "cheese",
              item_price: 300,
              purchase_date: "2024-02-21T19:33:50.000Z",
              expiry_date: "2024-03-21T19:33:50.000Z",
            })
            .expect(400)
            .then(({ body }) => {
              expect(body.msg).toBe("bad request");
            });
        });

                test("POST 404: will return appropriate error message and status if home id is valid but non-existent", () => {
                  return request(app)
                    .post("/api/homes/9999/items")
                    .send({
                      item_name: "cheese",
                      item_price: 300,
                      purchase_date: "2024-02-21T19:33:50.000Z",
                      expiry_date: "2024-03-21T19:33:50.000Z",
                    })
                    .expect(404)
                    .then(({ body }) => {
                      expect(body.msg).toBe("home does not exist");
                    });
                });



  });


});
