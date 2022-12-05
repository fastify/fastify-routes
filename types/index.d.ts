/// <reference types="node" />

import { RouteOptions, FastifyPluginCallback } from "fastify";

declare module "fastify" {
  interface FastifyInstance {
    routes: fastifyRoutes.FastifyRoutes;
  }
}

declare namespace fastifyRoutes {
  export type FastifyRoutes = Map<string, RouteOptions[]>;

  export const fastifyRoutes: FastifyPluginCallback
  export { fastifyRoutes as default }
}

declare function fastifyRoutes(...params: Parameters<FastifyPluginCallback>): ReturnType<FastifyPluginCallback>
export = fastifyRoutes
