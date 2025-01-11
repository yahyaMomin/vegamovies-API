import fastify from './src/app.js'

const PORT = process.env.PORT || 3000

const startServer = async () => {
  try {
    await fastify.listen({ port: PORT })
    console.log('server is running on PORT : ' + PORT)
  } catch (error) {
    fastify.log.error(error)
    process.exit(1)
  }
}
startServer()
