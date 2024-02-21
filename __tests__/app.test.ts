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
});
