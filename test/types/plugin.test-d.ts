import fastify, {
  FastifyInstance,
  FastifyPluginCallback,
  RouteOptions,
} from "fastify";
import { expectAssignable, expectError, expectType } from "tsd";

import fastifyRoutes, { FastifyRoutes } from "../../";



const app: FastifyInstance = fastify();
app.register(fastifyRoutes);

expectType<FastifyPluginCallback>(fastifyRoutes);


expectError(
  app.register(fastifyRoutes, {
    unknownOption: "this should trigger a typescript error",
  })
);

// Plugin property available
app.after(() => {
  expectType<FastifyRoutes>(app.routes);

  expectAssignable<RouteOptions[] | undefined>(app.routes.get("/rotue"));
});
