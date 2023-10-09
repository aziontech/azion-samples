export interface DatabaseInfoAtlas {
  collection: string;
  database: string;
  dataSource: string;
}

/**
 * Abstract class with atlas db configuration to access API's
 * The autorization use api-key
 */
export abstract class BaseRepository {
  protected headers: any;
  protected url: string;
  protected collection: string;
  protected database: string;
  protected dataSource: string;
  protected body: any;

  constructor(token: string, url: string, data: DatabaseInfoAtlas) {
    this.headers = {
      'Content-Type': 'application/json',
      'Access-Control-Request-Headers': '*',
      'api-key': token,
    };
    this.url = url;
    this.body = {
      collection: data.collection,
      database: data.database,
      dataSource: data.dataSource,
    };
  }
}
