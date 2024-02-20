import devData from "../data/development-data/index";
import seedOne from "./seed";
import connection from "../connection";

const runSeed = () => {
  console.log(devData);

  return seedOne(devData).then(() => connection.end());
};

runSeed();
