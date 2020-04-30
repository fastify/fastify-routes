'use strict'

const test = require('tap').test
const Fastify = require('fastify')
const plugin = require('../plugin')

function handler (_, reply) {
  reply.send({ hello: 'world' })
}

const schema = {
  response: {
    200: {
      type: 'object',
      properties: {
        hello: { type: 'string' }
      }
    }
  }
}

const routeA = function (fastify, opts, next) {
  const options = {
    schema,
    bodyLimit: 1000,
    logLevel: 'warn'
  }

  fastify.get('/hello/:world', options, handler)

  next()
}

const routeB = function (fastify, opts, next) {
  fastify.post('/hello/:world', {
    bodyLimit: 2000,
    logLevel: 'info'
  }, handler)

  next()
}

const routeC = {
  method: ['GET', 'HEAD'],
  path: '/foo',
  handler (req, res) {
    res.send({ success: true })
  }
}

test('should correctly map routes', (t) => {
  t.plan(16)

  const fastify = Fastify()

  fastify.register(plugin)

  fastify.register(routeA, { prefix: '/v1' })
  fastify.register(routeB, { prefix: '/v1' })
  fastify.route(routeC)

  fastify.ready(err => {
    t.error(err)

    t.equal(fastify.routes.get('/v1/hello/:world').get.method, 'GET')
    t.equal(fastify.routes.get('/v1/hello/:world').get.url, '/v1/hello/:world')
    t.equal(fastify.routes.get('/v1/hello/:world').get.logLevel, 'warn')
    t.equal(fastify.routes.get('/v1/hello/:world').get.prefix, '/v1')
    t.equal(fastify.routes.get('/v1/hello/:world').get.bodyLimit, 1000)
    t.equal(fastify.routes.get('/v1/hello/:world').get.handler, handler)
    t.deepEqual(fastify.routes.get('/v1/hello/:world').get.schema, schema)

    t.equal(fastify.routes.get('/v1/hello/:world').post.method, 'POST')
    t.equal(fastify.routes.get('/v1/hello/:world').post.url, '/v1/hello/:world')
    t.equal(fastify.routes.get('/v1/hello/:world').post.logLevel, 'info')
    t.equal(fastify.routes.get('/v1/hello/:world').post.prefix, '/v1')
    t.equal(fastify.routes.get('/v1/hello/:world').post.bodyLimit, 2000)
    t.equal(fastify.routes.get('/v1/hello/:world').post.handler, handler)

    t.equal(fastify.routes.get('/foo').get.method, 'GET')
    t.equal(fastify.routes.get('/foo').head.method, 'HEAD')
  })
})
