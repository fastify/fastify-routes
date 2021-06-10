'use strict'

const fp = require('fastify-plugin')

function fastifyRoutes (fastify, options, next) {
  fastify.decorate('routes', new Map())

  fastify.addHook('onRoute', (routeOptions) => {
    const { url } = routeOptions

    let routeListForUrl = fastify.routes.get(url)
    if (!routeListForUrl) {
      routeListForUrl = []
      fastify.routes.set(url, routeListForUrl)
    }

    routeListForUrl.push(routeOptions)
  })

  next()
}

module.exports = fp(fastifyRoutes, {
  fastify: '>=1.1.0',
  name: 'fastify-routes'
})
