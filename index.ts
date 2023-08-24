import * as fs from "fs";
import * as path from "path";
import dotenv from "dotenv";
import * as typechat from "typechat";
import { DatabaseSchema } from "./schema";
import knex from "knex";

dotenv.config();

export const Database = knex({
  client: "mysql2",
  connection: {
    host: process.env.DATABASE_HOST,
    port: Number(process.env.DATABASE_PORT),
    user: process.env.DATABASE_USER,
    password: process.env.DATABASE_PASSWORD,
    database: process.env.DATABASE_NAME,
  },
});

const model = typechat.createLanguageModel(process.env);

const schema = fs.readFileSync(path.join(__dirname, "schema.ts"), "utf8");
const translator = typechat.createJsonTranslator<DatabaseSchema>(
  model,
  schema,
  "DatabaseSchema"
);

typechat.processRequests("😀> ", "./input.txt", async (request) => {
  try {
    await Database.raw("SELECT 1");
    const response = await translator.translate(request);
    if (!response.success) {
      console.log(response.message);
      return;
    }
    console.log(JSON.stringify(response.data, null, 2));
    const { tables } = response.data;
    for (const table of tables) {
      const { name, columns } = table;
      let CREATE_TABLE = `CREATE TABLE IF NOT EXISTS ${name} (`;
      for (const column of columns) {
        const { name, type, allowNull } = column;
        CREATE_TABLE += `\n  ${name} ${type}${allowNull ? "" : " NOT NULL"},`;
      }
      CREATE_TABLE = CREATE_TABLE.slice(0, -1) + ");";
      await Database.raw(CREATE_TABLE);
    }
  } catch (error) {
    console.log(error);
  }
});
