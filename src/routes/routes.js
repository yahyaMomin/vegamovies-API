import {
  detailController,
  downloadsController,
  homeController,
  searchController,
  serversController,
} from '../controllers/index.js'

const routes = async (fastify, options) => {
  fastify.get('/search', searchController)
  fastify.get('/post', detailController)
  fastify.get('/servers', serversController)
  fastify.get('/downloads', downloadsController)
  fastify.get('/posts/:query/:category?', homeController)
}
export default routes
