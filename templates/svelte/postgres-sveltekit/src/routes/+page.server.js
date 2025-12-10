import { neon } from "@neondatabase/serverless";
import { NEONDB_SVELTEKIT_URL } from '$env/static/private'

const sql = neon(NEONDB_SVELTEKIT_URL);

async function seed() {
  const createTable = await sql`
    CREATE TABLE IF NOT EXISTS profiles (
      id SERIAL PRIMARY KEY,
      name VARCHAR(255) NOT NULL,
      email VARCHAR(255) UNIQUE NOT NULL,
      image VARCHAR(255),
      "createdAt" TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
    );
    `

  console.log(`Created "profiles" table`)

  const users = await Promise.all([
    sql`
          INSERT INTO profiles (name, email, image)
          VALUES ('John Doe', 'example@example.com', 'https://www.azion.com/assets/docs/images/image-processor/Image_Processor_1.png?ims=x100')
          ON CONFLICT (email) DO NOTHING;
      `
  ])
  console.log(`Seeded ${users.length} users`)

  return {
    createTable,
    users,
  }
}

export async function load() {
  const startTime = Date.now()

  try {
    const users = await sql`SELECT * FROM profiles`
    const duration = Date.now() - startTime
    return {
      users: users,
      duration: duration,
    }
  } catch (error) {
    if (error?.message === `relation "profiles" does not exist`) {
      console.log(
        'Table does not exist, creating and seeding it with dummy data now...'
      )
      // Table is not created yet
      await seed()
      const users = await sql`SELECT * FROM profiles`
      const duration = Date.now() - startTime
      return {
        users: users,
        duration: duration,
      }
    } else {
      throw error
    }
  }
}
