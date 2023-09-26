import { SSTConfig } from "sst";
import { MyStack } from "./stacks/MyStack";

export default {
  config(_input) {
    return {
      name: "sst-infra",
      region: "eu-west-2",
    };
  },
  stacks(app) {
    app.stack(MyStack);
  },
} satisfies SSTConfig;
