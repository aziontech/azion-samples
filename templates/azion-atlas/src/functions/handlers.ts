import { Repository } from './repository';

export const UserFindHandler = async (request: any, extras: any) => {
  const { args } = extras;
  const { token, url, database, dataSource, collection } = args;

  const repository = new Repository(token, url, {
    database,
    dataSource,
    collection,
  });

  const data = await repository.find();

  return new Response(data, {
    headers: {
      'content-type': 'application/json;charset=UTF-8',
    },
    status: 200,
  });
};

export const UserCreateHandler = async (request: any, extras: any) => {
  const { args } = extras;
  const { token, url, database, dataSource, collection } = args;
  const repository = new Repository(token, url, {
    database,
    dataSource,
    collection,
  });

  const body = await request.json();

  const { insertedId } = await repository.insertOne(body);

  if (!insertedId) {
    return new Response(JSON.stringify({ message: 'failed to create user' }), {
      headers: {
        'content-type': 'application/json;charset=UTF-8',
      },
      status: 400,
    });
  }

  return new Response(
    JSON.stringify({ message: 'success', data: { insertedId } }),
    {
      headers: {
        'content-type': 'application/json;charset=UTF-8',
      },
      status: 200,
    },
  );
};

export const UserUpdateHandler = async (request: any, extras: any) => {
  const { args } = extras;
  const { token, url, database, dataSource, collection } = args;
  const repository = new Repository(token, url, {
    database,
    dataSource,
    collection,
  });

  const body = await request.json();
  const { id, ...document } = body;

  const { modifiedCount } = await repository.updateOne(document, id);
  if (modifiedCount === 0) {
    return new Response(JSON.stringify({ message: 'user not found' }), {
      headers: {
        'content-type': 'application/json;charset=UTF-8',
      },
      status: 400,
    });
  }
  return new Response(
    JSON.stringify({ message: 'success', data: { modifiedCount } }),
    {
      headers: {
        'content-type': 'application/json;charset=UTF-8',
      },
      status: 200,
    },
  );
};

export const UserDeleteHandler = async (request: any, extras: any) => {
  const { args } = extras;
  const { token, url, database, dataSource, collection } = args;
  const repository = new Repository(token, url, {
    database,
    dataSource,
    collection,
  });

  const body = await request.json();
  const { id } = body;

  const { deletedCount } = await repository.deleteOne(id);

  if (deletedCount === 0) {
    return new Response(JSON.stringify({ message: 'user not found' }), {
      headers: {
        'content-type': 'application/json;charset=UTF-8',
      },
      status: 400,
    });
  }
  return new Response(JSON.stringify({ message: 'success' }), {
    headers: {
      'content-type': 'application/json;charset=UTF-8',
    },
    status: 200,
  });
};
