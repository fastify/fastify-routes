import fastify, {
  FastifyInstance,
  FastifyPluginCallback,
  RouteOptions,
} from 'fastify'
import { expect } from 'tstyche'

import fastifyRoutes, { FastifyRoutes } from '..'

const app: FastifyInstance = fastify()
app.register(fastifyRoutes)

expect(fastifyRoutes).type.toBeAssignableTo<FastifyPluginCallback>()

app.register(fastifyRoutes, {
  logLevel: 'debug'
})
expect(app.register).type.not.toBeCallableWith(fastifyRoutes, {
  unknownOption: 'this should trigger a typescript error'
})

// Plugin property available
app.after(() => {
  expect(app.routes).type.toBe<FastifyRoutes>()
  expect(app.routes.get('/rotue')).type.toBe<RouteOptions[] | undefined>()
})
