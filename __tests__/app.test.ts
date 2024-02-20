import testData from "../db/data/test-data/index";
import seedOne from "../db/seeds/seed";
import connection from "../db/connection";
import test from "node:test";

beforeEach(()=>{
    return seedOne(testData);
})

afterAll(() => {
  return connection.end();
});

describe("first describe",()=>{
test('first test ', () => {
    expect(5).toEqual(5)
});
})

