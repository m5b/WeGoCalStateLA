import { defineConfig } from "vitest/config";
import dotenv from "dotenv";
dotenv.config({ path: ".env.test" });
export default defineConfig({
    test: {
        setupFiles: ["./test/setup/env.mjs"],
    },
});