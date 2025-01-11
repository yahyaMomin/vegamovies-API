import Fastify from 'fastify'
import cors from '@fastify/cors'
import routes from './routes/routes.js'

const app = Fastify()

app.register(cors, {
  origin: '*',
})
app.register(routes, { prefix: '/api' })
app.get('/', (request, reply) => {
  reply.send('welcome to vegamovies API')
})

export default app
