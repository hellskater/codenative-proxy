import express from "express";
import { initializeMiddlewares } from "@setup/middleware";

const main = async (): Promise<void> => {
  const app = express();
  const PORT = 4000;

  // Initialising middlewares and routes
  initializeMiddlewares(app);

  app.listen(PORT, () => {
    console.log(`🚀 Server running at http://localhost:${PORT}`);
  });
};

main().catch((err) => {
  console.log("Something went wrong!");
  console.log(err);
});
