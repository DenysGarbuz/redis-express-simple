import express from "express";
import { connectRedis, client } from "./redis-config";

const PORT = 3000;
 
const app = express();

async function getOrSetCache(key: string, callback: () => Promise<any>) {
  try {
    let data = await client.get(key);
    if (data) {
      console.log("cache call");
      return JSON.parse(data);
    }
    //if no cache call API and save to cache
    data = await callback();
    
    //cache lasts for a minute
    client.setEx(key, 60, JSON.stringify(data));
    console.log("api call");
    return data;
  } catch (error) {
    console.log(error);
  }
}

app.get("/", async (req, res) => {
  try {
    const id = req.query.id ?? "";
    const key = `data:${id}`;

    const data = await getOrSetCache(key, async () => {
      const responce = await fetch(
        `https://jsonplaceholder.typicode.com/photos/${id}`
      );
      return await responce.json();
    });
 
    return res.type("json").send(data);
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .send({ message: "An error occurred while processing your request." });
  }
});

app.listen(PORT, async () => {
  await connectRedis();

  console.log(`server started on port ${PORT}`);
});
