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
- `DRIZZLE_TIDB_CONNECTION_URL`

Or via JSON Args:
```json
{
  "connection_url": "mysql://user:password.region.tidbcloud.com:4000/database-name"
}
```
