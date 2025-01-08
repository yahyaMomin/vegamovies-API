import { detailController, homeController, searchController } from '../controllers/index.js'

const routes = async (fastify, options) => {
  fastify.get('/search', searchController)
  fastify.get('/post/:id', detailController)
  fastify.get('/posts/:query/:category?', homeController)
}
export default routes
