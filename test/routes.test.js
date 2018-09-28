'use strict'

const test = require('tap').test
const Fastify = require('fastify')
const plugin = require('../plugin')

const routeA = function (fastify, opts, next) {
  const options = {
    schema: {
      response: {
        200: {
          type: 'object',
          properties: {
            hello: { type: 'string' }
          }
        }
      }
    },
    bodyLimit: 1000,
    logLevel: 'warn'
  }

  fastify.get('/hello/:world', options, function (request, reply) { reply.send({ hello: 'world' }) })

  next()
}

const routeB = function (fastify, opts, next) {
  fastify.post('/hello/:world', {
    bodyLimit: 2000,
    logLevel: 'info'
  }, function (request, reply) { reply.send({ hello: 'world' }) })

  next()
}

test('should correctly map routes', (t) => {
  t.plan(12)

  const fastify = Fastify()

  fastify.register(plugin)

  fastify.register(routeA, { prefix: '/v1' })
  fastify.register(routeB, { prefix: '/v1' })

  fastify.ready(err => {
    t.error(err)

    t.equal(fastify.routes.get('/v1/hello/:world').get.method, 'GET')
    t.equal(fastify.routes.get('/v1/hello/:world').get.url, '/v1/hello/:world')
    t.equal(fastify.routes.get('/v1/hello/:world').get.logLevel, 'warn')
    t.equal(fastify.routes.get('/v1/hello/:world').get.prefix, '/v1')
    t.equal(fastify.routes.get('/v1/hello/:world').get.bodyLimit, 1000)
    t.deepEqual(fastify.routes.get('/v1/hello/:world').get.schema, {
      response: {
        200: {
          properties: {
            hello: {
              type: 'string'
            }
          },
          type: 'object'
        }
      }
    })

    t.equal(fastify.routes.get('/v1/hello/:world').post.method, 'POST')
    t.equal(fastify.routes.get('/v1/hello/:world').post.url, '/v1/hello/:world')
    t.equal(fastify.routes.get('/v1/hello/:world').post.logLevel, 'info')
    t.equal(fastify.routes.get('/v1/hello/:world').post.prefix, '/v1')
    t.equal(fastify.routes.get('/v1/hello/:world').post.bodyLimit, 2000)
  })
})
