'use strict'

const { test } = require('node:test')
const Fastify = require('fastify')
const plugin = require('..')

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
  fastify.post(
    '/hello/:world',
    {
      bodyLimit: 2000,
      logLevel: 'info'
    },
    handler
  )

  next()
}

const routeC = {
  method: ['GET', 'HEAD'],
  path: '/foo',
  handler (req, res) {
    res.send({ success: true })
  }
}

const constrainedRoute = {
  method: ['GET'],
  path: '/foo',
  constraints: { host: 'fastify.dev' },
  handler (req, res) {
    res.send({ success: true })
  }
}

test('should correctly map routes', async (t) => {
  const fastify = Fastify({ exposeHeadRoutes: false })

  await fastify.register(plugin)

  fastify.register(routeA, { prefix: '/v1' })
  fastify.register(routeB, { prefix: '/v1' })
  fastify.route(routeC)
  fastify.route(constrainedRoute)

  await fastify.ready()

  t.assert.strictEqual(fastify.routes.get('/v1/hello/:world')[0].method, 'GET')
  t.assert.strictEqual(
    fastify.routes.get('/v1/hello/:world')[0].url,
    '/v1/hello/:world'
  )
  t.assert.strictEqual(
    fastify.routes.get('/v1/hello/:world')[0].logLevel,
    'warn'
  )
  t.assert.strictEqual(fastify.routes.get('/v1/hello/:world')[0].prefix, '/v1')
  t.assert.strictEqual(
    fastify.routes.get('/v1/hello/:world')[0].bodyLimit,
    1000
  )
  t.assert.strictEqual(
    fastify.routes.get('/v1/hello/:world')[0].handler,
    handler
  )
  t.assert.deepStrictEqual(
    fastify.routes.get('/v1/hello/:world')[0].schema,
    schema
  )

  t.assert.strictEqual(fastify.routes.get('/v1/hello/:world')[1].method, 'POST')
  t.assert.strictEqual(
    fastify.routes.get('/v1/hello/:world')[1].url,
    '/v1/hello/:world'
  )
  t.assert.strictEqual(
    fastify.routes.get('/v1/hello/:world')[1].logLevel,
    'info'
  )
  t.assert.strictEqual(fastify.routes.get('/v1/hello/:world')[1].prefix, '/v1')
  t.assert.strictEqual(
    fastify.routes.get('/v1/hello/:world')[1].bodyLimit,
    2000
  )
  t.assert.strictEqual(
    fastify.routes.get('/v1/hello/:world')[1].handler,
    handler
  )

  t.assert.deepStrictEqual(fastify.routes.get('/foo')[0].method, [
    'GET',
    'HEAD'
  ])
  t.assert.strictEqual(fastify.routes.get('/foo')[0].constraints, undefined)
  t.assert.deepStrictEqual(fastify.routes.get('/foo')[1].constraints, {
    host: 'fastify.dev'
  })
})

test('should allow other later onRoute handlers to change route options', async (t) => {
  const fastify = Fastify({ exposeHeadRoutes: false })

  await fastify.register(plugin)
  fastify.addHook('onRoute', (options) => {
    options.constraints = { host: 'some-automatic-constraint.com' }
  })
  fastify.register(routeA)

  await fastify.ready()

  t.assert.strictEqual(
    fastify.routes.get('/hello/:world')[0].url,
    '/hello/:world'
  )
  t.assert.deepStrictEqual(fastify.routes.get('/hello/:world')[0].constraints, {
    host: 'some-automatic-constraint.com'
  })
})

test('should correctly map routes with automatic HEAD routes', async (t) => {
  const fastify = Fastify()

  await fastify.register(plugin)

  fastify.register(routeA, { prefix: '/v1' })
  fastify.register(routeB, { prefix: '/v1' })
  fastify.route(routeC)
  fastify.route(constrainedRoute)

  await fastify.ready()

  t.assert.strictEqual(fastify.routes.get('/v1/hello/:world')[0].method, 'GET')
  t.assert.strictEqual(
    fastify.routes.get('/v1/hello/:world')[0].url,
    '/v1/hello/:world'
  )
  t.assert.strictEqual(
    fastify.routes.get('/v1/hello/:world')[0].logLevel,
    'warn'
  )
  t.assert.strictEqual(fastify.routes.get('/v1/hello/:world')[0].prefix, '/v1')
  t.assert.strictEqual(
    fastify.routes.get('/v1/hello/:world')[0].bodyLimit,
    1000
  )
  t.assert.strictEqual(
    fastify.routes.get('/v1/hello/:world')[0].handler,
    handler
  )
  t.assert.deepStrictEqual(
    fastify.routes.get('/v1/hello/:world')[0].schema,
    schema
  )

  t.assert.strictEqual(fastify.routes.get('/v1/hello/:world')[1].method, 'HEAD')
  t.assert.strictEqual(
    fastify.routes.get('/v1/hello/:world')[1].url,
    '/v1/hello/:world'
  )
  t.assert.strictEqual(
    fastify.routes.get('/v1/hello/:world')[1].logLevel,
    'warn'
  )
  t.assert.strictEqual(fastify.routes.get('/v1/hello/:world')[1].prefix, '/v1')
  t.assert.strictEqual(
    fastify.routes.get('/v1/hello/:world')[1].bodyLimit,
    1000
  )
  t.assert.strictEqual(
    fastify.routes.get('/v1/hello/:world')[1].handler,
    handler
  )
  t.assert.deepStrictEqual(
    fastify.routes.get('/v1/hello/:world')[1].schema,
    schema
  )

  t.assert.strictEqual(fastify.routes.get('/v1/hello/:world')[2].method, 'POST')
  t.assert.strictEqual(
    fastify.routes.get('/v1/hello/:world')[2].url,
    '/v1/hello/:world'
  )
  t.assert.strictEqual(
    fastify.routes.get('/v1/hello/:world')[2].logLevel,
    'info'
  )
  t.assert.strictEqual(fastify.routes.get('/v1/hello/:world')[2].prefix, '/v1')
  t.assert.strictEqual(
    fastify.routes.get('/v1/hello/:world')[2].bodyLimit,
    2000
  )
  t.assert.strictEqual(
    fastify.routes.get('/v1/hello/:world')[2].handler,
    handler
  )

  t.assert.deepStrictEqual(fastify.routes.get('/foo')[0].method, [
    'GET',
    'HEAD'
  ])
  t.assert.strictEqual(fastify.routes.get('/foo')[0].constraints, undefined)
  t.assert.deepStrictEqual(fastify.routes.get('/foo')[1].constraints, {
    host: 'fastify.dev'
  })
})
