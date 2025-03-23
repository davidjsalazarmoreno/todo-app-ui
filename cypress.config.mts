import { defineConfig } from 'cypress'
import dotenv from 'dotenv'

const envs = dotenv.config({ path: '.env' }).parsed

export default defineConfig({
  e2e: {
    baseUrl: envs?.CYPRESS_BASE_URL || 'http://localhost:5173',
    env: {
      // Test credentials
      TEST_USER: envs?.CYPRESS_TEST_USER || 'testuser',
      TEST_PASSWORD: envs?.CYPRESS_TEST_PASSWORD || 'testpass',
    }
  }
})
