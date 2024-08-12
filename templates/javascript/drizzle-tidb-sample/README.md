# Drizzle + TiDB Sample

This template showcase how to use the [Drizzle ORM](https://orm.drizzle.team/) to control a [TiDB table](https://tidbcloud.com).

# Before using this template
In order to use this template, you must:

**1. Create a new TiDB database**

**2. Create the following table in the database**
```sql
USE [YOUR_DATABASE]; 

CREATE TABLE posts (
  id INTEGER PRIMARY KEY AUTO_INCREMENT,
  message varchar(140)
);
```

**3. Setup the TiDB connection data**

It can be done by setting the following [Environment Variables](https://www.azion.com/en/documentation/products/edge-functions/environment-variables/).
- `DRIZZLE_TIDB_DATABASE`
- `DRIZZLE_TIDB_HOST`
- `DRIZZLE_TIDB_PASSWORD`
- `DRIZZLE_TIDB_PORT`
- `DRIZZLE_TIDB_USERNAME`

Or via JSON Args:
```json
{
  "database": "mydb",
  "host": "gateway.region.environment.tidbcloud.com",
  "password": "my_password",
  "port": 1234,
  "username": "my_user"
}
```
