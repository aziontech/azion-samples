import { Router } from 'itty-router';
import {
  UserCreateHandler,
  UserDeleteHandler,
  UserFindHandler,
  UserUpdateHandler,
} from './handlers';
import { AppPageHandler } from './app';

async function routes(request: any, args: any) {
  const router = Router();

  router.get('/', AppPageHandler);

  router
    .get('/api', UserFindHandler)
    .post('/api', UserCreateHandler)
    .put('/api', UserUpdateHandler)
    .delete('/api', UserDeleteHandler);

  return router.handle(request, { args });
}

export default routes;
