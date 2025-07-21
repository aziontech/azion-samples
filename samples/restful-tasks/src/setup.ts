import {
  AzionDatabase,
  createDatabase,
  getDatabases,
  useExecute,
  useQuery,
} from "azion/sql";
import dotenv from "dotenv";

dotenv.config();

const DATABASE_NAME = process.env.DATABASE_NAME || "tasks";

async function setupDatabase() {
  // check if database exists
  const { data: allDatabases, error } = await getDatabases({
    page: 1,
    page_size: 100,
  });

  let databaseExists: AzionDatabase | undefined;

  if (allDatabases) {
    console.log(`Retrieved ${allDatabases.count} databases`);

    databaseExists = allDatabases.databases?.find(
      (db) => db.name === DATABASE_NAME
    );

    if (databaseExists && databaseExists.status !== "created") {
      console.log(`Database ${DATABASE_NAME} is being created.`);
      return;
    }

    if (databaseExists && databaseExists.status === "created") {
      console.log(`Database ${DATABASE_NAME} already exists.`);
    }
  } else {
    console.error("Failed to retrieve databases", error);
    return;
  }

  // create database
  if (!databaseExists) {
    try {
      const { data, error } = await createDatabase(DATABASE_NAME, {
        external: true,
      });

      if (error) {
        console.error(`Error creating database ${DATABASE_NAME}:`, error);
        return;
      }

      console.log(`Database ${DATABASE_NAME} created or already exists.`);
    } catch (error) {
      console.error(`Error creating database ${DATABASE_NAME}:`, error);
      return;
    }
  }

  // check if table exists
  const { data: tableData, error: tableError } = await useQuery(DATABASE_NAME, [
    `SELECT * FROM sqlite_master WHERE type='table' AND name='tasks'`,
  ]);

  if (tableError) {
    console.error(`Error checking table tasks:`, tableError);
  }

  if (tableData?.results?.[0]?.rows?.length) {
    console.log(`Table tasks already exists.`);
    return;
  }

  // create table
  try {
    await useExecute(
      DATABASE_NAME,
      [
        `CREATE TABLE IF NOT EXISTS tasks (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        title TEXT NOT NULL,
        completed BOOLEAN NOT NULL DEFAULT FALSE
      )`,
      ],
      {
        external: true,
      }
    );
    console.log("Tasks table created or already exists.");
  } catch (error) {
    console.error("Error creating table:", error);
  }
}

setupDatabase();
