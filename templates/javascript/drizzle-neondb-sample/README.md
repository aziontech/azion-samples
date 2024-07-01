# Drizzle + Neon Database Sample

This template showcase how to use the [Drizzle ORM](https://orm.drizzle.team/) to control a [Neon database](https://neon.tech/).

# Before using this template
In order to use this template, you must:

**1. Create a new Neon Database**

**2. Create the following table in this database**
```sql
CREATE TABLE posts (
  id SERIAL PRIMARY KEY,
  message varchar(140)
);
```

**3. Setup the Neon Database connection data**

It can be done by setting the following [Environment Variable](https://www.azion.com/en/documentation/products/edge-functions/environment-variables/).
- `DRIZZLE_NEON_CONNECTION_URL`

Or via JSON Args:
```json
{
  "connection_url": "postgresql://user:passwor@hostname.neon.tech/database"
}
```