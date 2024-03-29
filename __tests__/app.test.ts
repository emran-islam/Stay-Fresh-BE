import testData from "../db/data/test-data/index";
import seedOne from "../db/seeds/seed";
import connection from "../db/connection";
import request from "supertest";
import app from "../app";
import { describe } from "node:test";

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

    test("404: send an appropriate error message when sending a valid but non existent home id", () => {
      return request(app)
        .get("/api/homes/999999/items")
        .expect(404)
        .then(({ body }) => {
          expect(body.msg).toBe("home does not exist");
        });
    });

    test("400: send an appropriate error message when sending a invalid home id", () => {
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
          expect(item.item_id).toBe(9);
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

  describe("PATCH/api/items/:item_id", () => {
    test("PATCH 200: update item by its id ", () => {
      const updatedItem = {
        item_name: "cheese",
        item_price: 300,
        purchase_date: "2024-02-21T19:33:50.000Z",
        expiry_date: "2024-03-21T19:33:50.000Z",
        item_status: "USED",
      };
      return request(app)
        .patch("/api/items/1")
        .send(updatedItem)
        .expect(200)
        .then((response) => {
          expect(typeof response.body.item).toBe("object");
          expect(response.body.item).toEqual({
            item_id: 1,
            item_name: "cheese",
            item_price: 300,
            purchase_date: "2024-02-21T19:33:50.000Z",
            expiry_date: "2024-03-21T19:33:50.000Z",
            item_status: "USED",
            home_id: 1,
          });
        });
    });

    test("PATCH 200: update item by a single field ", () => {
      const updatedItem = {
        item_status: "USED",
      };
      return request(app)
        .patch("/api/items/1")
        .send(updatedItem)
        .expect(200)
        .then((response) => {
          expect(typeof response.body.item).toBe("object");
          expect(response.body.item).toEqual({
            item_id: 1,
            item_name: "Milk",
            item_price: 155,
            purchase_date: "2024-02-20T19:33:50.000Z",
            expiry_date: "2024-02-27T19:33:50.000Z",
            item_status: "USED",
            home_id: 1,
          });
        });
    });

    test("PATCH 400: will respond with appropriate error message and status if request body field has wrong data type ", () => {
      const updatedItem = {
        item_name: "cheese",
        item_price: "three hundred",
        purchase_date: "2024-02-21T19:33:50.000Z",
        expiry_date: "2024-03-21T19:33:50.000Z",
        item_status: "USED",
      };
      return request(app)
        .patch("/api/items/1")
        .send(updatedItem)
        .expect(400)
        .then(({ body }) => {
          expect(body.msg).toBe("bad request");
        });
    });

    test("PATCH 400: will respond with appropriate error message and status if request body is empty", () => {
      const updatedItem = {};
      return request(app)
        .patch("/api/items/1")
        .send(updatedItem)
        .expect(400)
        .then(({ body }) => {
          expect(body.msg).toBe("bad request");
        });
    });

    test("PATCH 400: will respond with appropriate error message and status if item id is not valid", () => {
      const updatedItem = {};
      return request(app)
        .patch("/api/items/nonsense")
        .send(updatedItem)
        .expect(400)
        .then(({ body }) => {
          expect(body.msg).toBe("bad request");
        });
    });

    test("PATCH 404: will respond with appropriate error message and status if item id is valid but non existent", () => {
      const updatedItem = {};
      return request(app)
        .patch("/api/items/99999")
        .send(updatedItem)
        .expect(404)
        .then(({ body }) => {
          expect(body.msg).toBe("item does not exist");
        });
    });
  });

  describe("GET /homes/:home_id/items", () => {
    test("should get all items by expiry date with nearest expiry date first", () => {
      return request(app)
        .get("/api/homes/1/items")
        .expect(200)
        .then(({ body }) => {
          const { items } = body;
          expect(items.length > 0).toBe(true);
          for (let i = 1; i < items.length; i++) {
            expect(items[i].expiry_date > items[i - 1].expiry_date).toBe(true);
          }
        });
    });
  });

  describe("GET /expiries", () => {
    test("GET 200: sends an array of all expiries", () => {
      return request(app)
        .get("/api/expiries")
        .expect(200)
        .then(({ body }) => {
          const { expiries } = body;
          expect(expiries.length > 0).toBe(true);
          expiries.forEach((item) => {
            expect(typeof item.item_name).toBe("string");
            expect(typeof item.shelf_life).toBe("number");
          });
        });
    });
  });

  describe("GET /expiries/:item_name", () => {
    test("GET 200: sends an expiry based on provided item name", () => {
      return request(app)
        .get("/api/expiries/Milk")
        .expect(200)
        .then(({ body }) => {
          const { expiry } = body;
          expect(expiry.item_name).toBe("Milk");
          expect(expiry.shelf_life).toBe(5);
        });
    });

    test("GET 200: sends an expiry based on provided item name regardless of case sensitivity", () => {
      return request(app)
        .get("/api/expiries/milk")
        .expect(200)
        .then(({ body }) => {
          const { expiry } = body;
          expect(expiry.item_name).toBe("Milk");
          expect(expiry.shelf_life).toBe(5);
        });
    });

    test("GET 200: sends an expiry based on provided item name if item name is shortened version of item", () => {
      return request(app)
        .get("/api/expiries/pot")
        .expect(200)
        .then(({ body }) => {
          const { expiry } = body;
          expect(expiry.item_name).toBe("Potatoes");
          expect(expiry.shelf_life).toBe(8);
        });
    });

    test("GET 404: sends appropriate error status and message when given a valid but not existent item name to check", () => {
      return request(app)
        .get("/api/expiries/beans")
        .expect(404)
        .then(({ body }) => {
          expect(body.msg).toBe("expiry item does not exist");
        });
    });
  });

  describe("GET /homes/:home_id/items?item_status=status_query", () => {
    test("GET 200: Will accept a query parameter of status and return all the items for that status", () => {
      return request(app)
        .get("/api/homes/2/items?item_status=ACTIVE")
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
            expect(item.home_id).toBe(2);
            expect(item.item_status).toBe("ACTIVE");
          });
        });
    });

    test("GET 200: Will accept a query parameter of status and return all the items for that status", () => {
      return request(app)
        .get("/api/homes/2/items?item_status=USED")
        .expect(200)
        .then(({ body }) => {
          const { items } = body;
          expect(items.length > 0).toBe(true)
          items.forEach((item) => {
            expect(typeof item.item_id).toBe("number");
            expect(typeof item.item_name).toBe("string");
            expect(typeof item.item_price).toBe("number");
            expect(typeof item.purchase_date).toBe("string");
            expect(typeof item.expiry_date).toBe("string");
            expect(typeof item.home_id).toBe("number");
            expect(typeof item.item_status).toBe("string");
            expect(item.home_id).toBe(2);
            expect(item.item_status).toBe("USED");
          });
        });
    });

        test("GET 200: Will accept a query parameter of status and return all the items for that status", () => {
          return request(app)
            .get("/api/homes/2/items?item_status=TRASHED")
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
                expect(item.home_id).toBe(2);
                expect(item.item_status).toBe("TRASHED");
              });
            });
        });

         test("GET 200: Will accept a query parameter of status and return all the items for that status with lower case query params", () => {
           return request(app)
             .get("/api/homes/2/items?item_status=trashed")
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
                 expect(item.home_id).toBe(2);
                 expect(item.item_status).toBe("TRASHED");
               });
             });
         });

                  test("GET 200: Will accept a query parameter of status and return all the items for that status with lower case query params", () => {
                    return request(app)
                      .get("/api/homes/2/items?item_status=active")
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
                          expect(item.home_id).toBe(2);
                          expect(item.item_status).toBe("ACTIVE");
                        });
                      });
                  });


    test("GET 200: Will return empty array when given a valid status but home has no items of that status", () => {
      return request(app)
        .get("/api/homes/1/items?item_status=USED")
        .expect(200)
        .then(({ body }) => {
          const { items } = body;
          expect(items).toEqual([]);
        });
    });

    test("GET 400: Will return an error message when given a invalid status", () => {
      return request(app)
        .get("/api/homes/1/items?item_status=NONSENSE")
        .expect(400)
        .then(({ body }) => {
          expect(body.msg).toBe("invalid status query");
        });
    });
  });

  describe("GET /users", () => {
    test("GET 200: Returns an array of all users", () => {
      return request(app)
        .get("/api/users")
        .expect(200)
        .then(({ body }) => {
          const { users } = body;
          expect(users.length > 0).toBe(true);
          users.forEach((user) => {
            expect(typeof user.user_id).toBe("number");
            expect(typeof user.user_name).toBe("string");
            expect(typeof user.home_id).toBe("number");
          });
        });
    });
  });

  describe("DELETE /item/:item_id", () => {
    test("DELETE 204: Deletes an item", () => {
      return request(app).delete("/api/items/1").expect(204);
    });

    test("DELETE 400: Responds with error message and status when given an invalid item id", () => {
      return request(app)
        .delete("/api/items/nonsense")
        .expect(400)
        .then(({ body }) => {
          expect(body.msg).toBe("bad request");
        });
    });

    test("DELETE 404: Responds with error message and status when given an valid but non existent item id", () => {
      return request(app)
        .delete("/api/items/9999")
        .expect(404)
        .then(({ body }) => {
          expect(body.msg).toBe("item does not exist");
        });
    });
  });

  describe("POST /users", () => {
    test("POST 201: Adds a new user", () => {
      return request(app)
        .post("/api/users")
        .send({
          user_name: "marksmith123",
          home_id: 1,
        })
        .expect(201)
        .then(({ body }) => {
          const user = body.user;
          expect(user.user_id).toBe(3);
          expect(user.user_name).toBe("marksmith123");
          expect(user.home_id).toBe(1);
        });
    });

    test("POST 400: Will return error message and status when request body is missing mandatory parameters", () => {
      return request(app)
        .post("/api/users")
        .send({
          home_id: 1,
        })
        .expect(400)
        .then(({ body }) => {
          expect(body.msg).toBe("bad request");
        });
    });

    test("POST 400: Will return error message and status when home id is not valid", () => {
      return request(app)
        .post("/api/users")
        .send({
          user_name: "marksmith123",
          home_id: "rubbish",
        })
        .expect(400)
        .then(({ body }) => {
          expect(body.msg).toBe("bad request");
        });
    });

    test("POST 404: Will return error message and status when home id is valid but not existing", () => {
      return request(app)
        .post("/api/users")
        .send({
          user_name: "marksmith123",
          home_id: 100,
        })
        .expect(404)
        .then(({ body }) => {
          expect(body.msg).toBe("home does not exist");
        });
    });
  });
});

describe("POST /homes", () => {
  test("POST 201: Adds a new home", () => {
    return request(app)
      .post("/api/homes")
      .send({
        home_name: "Peterson Family",
      })
      .expect(201)
      .then(({ body }) => {
        const home = body.home;
        expect(home.home_name).toBe("Peterson Family");
      });
  });

  test("POST 400: Will return error message and status when home name is not included", () => {
    return request(app)
      .post("/api/homes")
      .send({})
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("bad request");
      });
  });
});
