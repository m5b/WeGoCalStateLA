import { defineConfig } from "vitest/config";
import dotenv from "dotenv";
dotenv.config({ path: ".env.test" });
export default defineConfig({
    test: {
        globalSetup: ["./test/setup/globalSetup.mjs"],
        hookTimeout: 60000,
        maxWorkers:15,
    },
});