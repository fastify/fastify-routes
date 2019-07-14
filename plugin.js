'use strict'

const fp = require('fastify-plugin')

function fastifyRoutes (fastify, options, next) {
  fastify.decorate('routes', new Map())

  fastify.addHook('onRoute', (routeOptions) => {
    const { method, schema, url, logLevel, prefix, bodyLimit, handler } = routeOptions
    const _method = Array.isArray(method) ? method : [method]

    _method.forEach(method => {
      const key = method.toLowerCase()
      const route = { method, schema, url, logLevel, prefix, bodyLimit, handler }

      if (fastify.routes.has(url)) {
        const current = fastify.routes.get(url)
        fastify.routes.set(url, Object.assign(current, { [key]: route }))
      } else {
        fastify.routes.set(url, { [key]: route })
      }
    })
  })

  next()
}

module.exports = fp(fastifyRoutes, {
  fastify: '>=1.1.0',
  name: 'fastify-routes'
})
