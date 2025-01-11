import app from './src/app.js'

const PORT = process.env.PORT || 3000

const startServer = async () => {
  try {
    await app.listen({ port: PORT, host: '0.0.0.0' })
    console.log('server is running on PORT : ' + PORT)
  } catch (error) {
    fastify.log.error(error)
    process.exit(1)
  }
}
startServer()
