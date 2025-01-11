import Fastify from 'fastify'
import cors from '@fastify/cors'
import routes from './routes/routes.js'

const fastify = Fastify()

fastify.register(cors, {
  origin: '*',
})
fastify.register(routes, { prefix: '/api' })
fastify.get('/', (request, reply) => {
  reply.send('welcome to vegamovies API')
})

export default fastify
