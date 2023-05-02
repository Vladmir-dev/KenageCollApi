import crypto from "crypto";
// using crypto to generate secret keys
const firstKey = crypto.randomBytes(32).toString("hex");
const secondKey = crypto.randomBytes(32).toString("hex");

console.table({ firstKey, secondKey });
