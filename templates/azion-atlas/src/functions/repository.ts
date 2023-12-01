import { BaseRepository, DatabaseInfoAtlas } from './base';

export class Repository extends BaseRepository {
  constructor(apiToken: string, url: string, data: DatabaseInfoAtlas) {
    super(apiToken, url, data);
  }

  async find(): Promise<any> {
    const body = this.body;
    try {
      const result = await fetch(`${this.url}/find`, {
        method: 'POST',
        body: JSON.stringify(body),
        headers: this.headers,
      });
      const json = await result.json();

      return JSON.stringify(json.documents);
    } catch (err) {
      throw err;
    }
  }

  async insertOne(document: any): Promise<any> {
    const body = {
      ...this.body,
      document,
    };

    try {
      const result = await fetch(`${this.url}/insertOne`, {
        method: 'POST',
        body: JSON.stringify(body),
        headers: this.headers,
      });
      const json = await result.json();

      return json;
    } catch (err) {
      throw err;
    }
  }

  async updateOne(document: any, id: string): Promise<any> {
    const body = {
      ...this.body,
      filter: {
        _id: { $oid: id },
      },
      update: {
        $set: {
          ...document,
        },
      },
    };

    try {
      const result = await fetch(`${this.url}/updateOne`, {
        method: 'POST',
        body: JSON.stringify(body),
        headers: this.headers,
      });
      const json = await result.json();

      return json;
    } catch (err) {
      throw err;
    }
  }

  async deleteOne(id: string): Promise<any> {
    const body = {
      ...this.body,
      filter: {
        _id: { $oid: id },
      },
    };

    try {
      const result = await fetch(`${this.url}/deleteOne`, {
        method: 'POST',
        body: JSON.stringify(body),
        headers: this.headers,
      });
      const json = await result.json();

      return json;
    } catch (err) {
      throw err;
    }
  }
}
