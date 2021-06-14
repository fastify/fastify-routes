# v4.0.0

 - The exported `.routes` map has changed from a map of path to objects like `{get: {...}, post: {...}}` to a map of path to arrays of route objects like `[{...}, {...}]`. Instead of doing `fastify.routes['/foo/bar'].get` to get a route options object, you can do `fastify.routes['/foo/bar/'][0]`. This is to support adding multiple routes to the same path when using multiple methods or multiple constraints, and to support the changes below. See https://github.com/fastify/fastify-routes/pull/31
 - The route objects in the `.routes` map now include all route options as opposed to just some. See https://github.com/fastify/fastify-routes/pull/31
 - The route options in the `.routes` map now include any changes to the options made by by any `onRoute` hook, not just by hooks registered before `fastify-routes` was registered. See https://github.com/fastify/fastify-routes/pull/31
