import { homeController, searchController } from '../controllers/index.js'

const routes = async (fastify, options) => {
  fastify.get('/search', searchController)
  fastify.get('/post/:id/', homeController)
  fastify.get('/posts/:query/:category?', homeController)
}
export default routes
