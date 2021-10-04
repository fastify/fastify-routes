/// <reference types="node" />

import { RouteOptions, FastifyPluginCallback } from "fastify";

export type FastifyRoutes = Map<string, RouteOptions[]>;

declare const fastifyRoutes: FastifyPluginCallback;

export default fastifyRoutes;

declare module "fastify" {
  interface FastifyInstance {
    routes: FastifyRoutes;
  }
}
