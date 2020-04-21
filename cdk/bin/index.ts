import { ServerlessApp } from "../lib/serverless-app";

const app = new ServerlessApp({
  projectName: "transadmin",
  envType: (process.env.NODE_ENV ?? "test").substring(0, 4),
});
app.synth();
