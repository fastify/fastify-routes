# fastify-routes

![CI workflow](https://github.com/fastify/fastify-routes/workflows/CI%20workflow/badge.svg)
[![JavaScript Style Guide](https://img.shields.io/badge/code_style-standard-brightgreen.svg)](https://standardjs.com)

This plugin decorates Fastify instance with `routes` which is a [Map](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Map) of registered routes. Note that you have to register this plugin
before registering any routes so that it can collect all of them.

## Example

```js
const fastify = require('fastify')()

fastify.register(require('fastify-routes'))

fastify.get('/hello', {}, (request, reply) => {
  reply.send({ hello: 'world' })
})

fastify.listen(3000, (err, address) => {
  if (err) {
    console.error(err)
    return
  }
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
})

```

## License

MIT License
