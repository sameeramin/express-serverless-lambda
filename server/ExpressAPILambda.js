const serverlessExpress = require("@vendia/serverless-express");

// Create handler for serverlessExpress Lambda
const app = require("./server");

exports.handler = serverlessExpress({ app });
