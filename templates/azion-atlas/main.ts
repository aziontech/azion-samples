import routes from './src/functions/routes';

async function main(event: any) {
  /** configure routes */
  return routes(event?.request, event?.args);
}

export default main;
