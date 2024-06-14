# Drizzle + Turso Sample

This template showcase how to use the [Drizzle ORM](https://orm.drizzle.team/) to control a [Turso database](https://turso.tech/).

# Before using this template
In order to use this template, you must:

**1. Create a new Turso database**

**2. Create the following table in this database**
```sql
CREATE TABLE posts (
  id INTEGER PRIMARY KEY,
  message varchar(140)
);
```

**3. Setup the Turso connection data**

It can be done by setting the following [Environment Variables](https://www.azion.com/en/documentation/products/edge-functions/environment-variables/).
- `DRIZZLE_TURSO_URL`
- `DRIZZLE_TURSO_TOKEN`

Or via JSON Args:
```json
{
  "url": "libsql://database-username.turso.io",
  "token" "DB_TOKEN"
}
```