const devData = require("../data/development-data/index.ts");
const seedRunSeed = require("./seed.ts");
const dbRunSeed = require("../connection.ts");

const runSeed = () => {
  return seedRunSeed(devData).then(() => dbRunSeed.end());
};

runSeed();
