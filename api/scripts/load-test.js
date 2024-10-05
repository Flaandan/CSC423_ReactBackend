// Using `k6` for load, performance, and concurrency testing

// Installation using Homebrew on macOS:
// - `brew install k6`

// CLI Usage:
// - `k6 run ./scripts/load-test.js`

import http from "k6/http";
import { sleep } from "k6";

export const options = {
  vus: 5,
  duration: "5s",
};

export default function () {
  const response = http.get("http://localhost:8000/health");

  console.log(`Response: ${response.body}`);

  sleep(1);
}
