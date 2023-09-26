import { StackContext, Api, EventBus, NextjsSite } from "sst/constructs";

export function MyStack({ stack }: StackContext) {
  // ... existing constructs
  // const bus = new EventBus(stack, "bus", {
  //   defaults: {
  //     retries: 10,
  //   },
  // });

  // const api = new Api(stack, "api", {
  //   defaults: {
  //     function: {
  //       bind: [bus],
  //     },
  //   },
  //   routes: {
  //     "GET /": "packages/functions/src/lambda.handler",
  //     "GET /todo": "packages/functions/src/todo.list",
  //     "POST /todo": "packages/functions/src/todo.create",
  //   },
  // });

  // bus.subscribe("todo.created", {
  //   handler: "packages/functions/src/events/todo-created.handler",
  // });

  // stack.addOutputs({
  //   ApiEndpoint: api.url,
  // });

  // Create the Next.js site
  const site = new NextjsSite(stack, "Site", {
    path: "apps/webapp",
    environment: {
      DATABASE_URL: process.env.DATABASE_URL || "",
      NODE_ENV: process.env.NODE_ENV,
      NEXTAUTH_SECRET: process.env.NEXTAUTH_SECRET || "",
      NEXTAUTH_URL: process.env.NEXTAUTH_URL || "",
      DISCORD_CLIENT_ID: process.env.DISCORD_CLIENT_ID || "",
      DISCORD_CLIENT_SECRET: process.env.DISCORD_CLIENT_SECRET || "",
      GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID || "",
      GOOGLE_CLIENT_SECRET: process.env.GOOGLE_CLIENT_SECRET || "",
    },
  });

  // Add the site's URL to stack output
  stack.addOutputs({
    URL: site.url,
  });
}
