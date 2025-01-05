import { homeController } from '../controllers/homeController.js'

const routes = async (fastify, options) => {
  fastify.get('/:query/:category?', homeController)
}
export default routes
