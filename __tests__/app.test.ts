import testData from "../db/data/test-data/index";
import seedOne from "../db/seeds/seed";
import connection from "../db/connection";
import request from "supertest";
import app from "../app";

// beforeEach(() => {
//   return seedOne(testData);
// });

// afterAll(() => {
//   return connection.end();
// });

describe("GET/api", () => {
  test("should provide description about all other available endpoints", () => {
    return request(app)
      .get("/api")
      .expect(200)
      .then((res) => {
        const actualEndpoints = res.body;
        for (const endpoint in actualEndpoints) {
          expect(typeof actualEndpoints[endpoint].description).toBe("string");
          expect(Array.isArray(actualEndpoints[endpoint].queries)).toBe(true);
          expect(typeof actualEndpoints[endpoint].requestFormat).toBe("object");
          expect(typeof actualEndpoints[endpoint].exampleResponse).toBe(
            "object"
          );
        }
      });
  });
});
