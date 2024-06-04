import { createClient } from "redis";
const client = createClient({ url: "redis://redis:6379" });

client.on("connect", () => {
  console.log("Redis connected");
});
client.on("error", (err) => {
  console.log(err);
});

const connectRedis = async () => {
  await client.connect();
};

export { client, connectRedis };
