// const devData = require("../data/development-data/index.ts");
const seedOne = require("./seed.ts");
const connection = require("../connection.ts");

const runSeed = () => {
  return seedOne().then(() => connection.end());
};

runSeed();

// seedOne().then(() => {connection.end()});
