# @fastify/routes

[![CI](https://github.com/fastify/fastify-routes/actions/workflows/ci.yml/badge.svg?branch=main)](https://github.com/fastify/fastify-routes/actions/workflows/ci.yml)
[![NPM version](https://img.shields.io/npm/v/@fastify/routes.svg?style=flat)](https://www.npmjs.com/package/@fastify/routes)
[![neostandard javascript style](https://img.shields.io/badge/code_style-neostandard-brightgreen?style=flat)](https://github.com/neostandard/neostandard)

This plugin decorates a Fastify instance with `routes`, which is a [Map](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Map) of registered routes. Note that you have to await the registration of this plugin before registering any routes so that @fastify/routes can collect them.

## Data Structure

The `fastify.routes` Map has a key for each path any route has been registered, which points to an array of routes registered on that path. There can be more than one route for a given path if there are multiple routes added with different methods or different constraints.

```js
  {
    '/hello': [
      {
        method: 'GET',
        url: '/hello',
        schema: { ... },
        handler: Function,
        prefix: String,
        logLevel: String,
        bodyLimit: Number,
        constraints: undefined,
      },
      {
        method: 'POST',
        url: '/hello',
        schema: { ... },
        handler: Function,
        prefix: String,
        logLevel: String,
        bodyLimit: Number,
        constraints: { ... },
      }
    ]
  }
```

## Example

```js
const fastify = require("fastify")();

(async () => {
  await fastify.register(require("@fastify/routes"));
  fastify.get("/hello", {}, (request, reply) => {
    reply.send({ hello: "world" });
  });

  fastify.listen({ port: 3000 }, (err, address) => {
    if (err) {
      console.error(err);
      return;
    }
    console.log(fastify.routes);
    /* will output a Map with entries:
    {
      '/hello': [
        {
          method: 'GET',
          url: '/hello',
          schema: Object,
          handler: <Function>,
          prefix: <String>,
          logLevel: <String>,
          bodyLimit: <Number>
        }
      ]
    }
    */
  });
})();
```

## License

MIT License
