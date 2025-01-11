export const createResponse = (reply, status, data) => {
  return reply.status(status).send({
    status: true,
    data,
  })
}
export const createError = (reply, status, message) => {
  return reply.status(status).send({
    status: false,
    message: message,
    data: [],
  })
}
