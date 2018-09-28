# fastify-routes
[![Greenkeeper badge](https://badges.greenkeeper.io/fastify/fastify-routes.svg)](https://greenkeeper.io/)

[![JavaScript Style Guide](https://img.shields.io/badge/code_style-standard-brightgreen.svg)](https://standardjs.com) [![Build Status](https://travis-ci.org/fastify/fastify-routes.svg?branch=master)](https://travis-ci.org/fastify/fastify-routes)

This plugin decorates Fastify instance with `routes` which is a [Map](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Map) of registered routes. Note that you have to register this plugin
before registering any routes so that it can collect all of them.

## Example

```js

fastify.register(require('fastify-routes'))

fastify.get('/hello', opts, (request, reply) => {
  reply.send({ hello: 'world' })
})

console.log(fastify.routes)

/* will output a Map with entries:
{
  '/hello': {
    get: {
      method: 'GET',
      url: '/hello',
      schema: Object,
      handler: <Function>,
      prefix: <String>,
      logLevel: <String>,
      bodyLimit: <Number>
    }
  }
}
*/

```

## License

MIT License
