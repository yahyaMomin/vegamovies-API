import Fastify from 'fastify'
import routes from './routes/routes.js'

const fastify = Fastify()

fastify.register(routes, { prefix: '/api' })
fastify.get('/', (request, reply) => {
  reply.send('hello')
})

export default fastify
