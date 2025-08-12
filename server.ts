import crypto from "node:crypto"
import fastify from "fastify"

const server = fastify({
  logger: {
    transport: {
      target: 'pino-pretty',
      options: {
        translateTime: 'HH:MM:ss Z',
        ignore: 'pid,hostname',
      },
    },
  }
})

const courses = [
  { id: '1', title: 'Curso de Node.js' },
  { id: '2', title: 'Curso de React' },
  { id: '3', title: 'Curso de React Native' },
]

server.get('/courses', async (request, reply) => {
  return { hello: 'world' }
})

// oq muda é o recurso
server.post('/courses', async (request, reply) => {
  type Body = {
    title: string
  }

  const body = request.body as Body

  const randomId = crypto.randomUUID()
  const courseTtile = body.title

  if (!courseTtile) {
    return reply.status(400).send({ error: 'Titulo nao informado' })
  }
  courses.push({ id: randomId, title: courseTtile })
  return reply.status(201).send({randomId})
})

server.get('/courses/:id', async (request, reply) => {
  type Params = {
    id: string
  }
  const param = request.params as Params

  const courseId =  param.id

  const course = courses.find(course => course.id === courseId)

  if (!course) {
    return reply.status(404).send({ error: 'Curso nao encontrado' })
  }

  return reply.send(course)
})

server.listen({port: 3333}).then(address => {
  console.log(`Server listening on ${address}`)
})