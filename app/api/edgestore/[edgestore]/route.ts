import { initEdgeStore } from '@edgestore/server';
import { createEdgeStoreNextHandler } from '@edgestore/server/adapters/next/app';

const es = initEdgeStore.create();

const edgeStoreRouter = es.router({
  publicFiles: es.imageBucket({
    maxSize: 1024 * 1024 * 2, // Limite stricte de 2 Mo
    accept: ['image/jpeg', 'image/png'], // Formats autorisés
  }),
});

const handler = createEdgeStoreNextHandler({
  router: edgeStoreRouter,
});

export { handler as GET, handler as POST };
export type EdgeStoreRouter = typeof edgeStoreRouter;
