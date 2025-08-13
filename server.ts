
import fastify from "fastify"

import fastifySwagger from "@fastify/swagger"
import { validatorCompiler, serializerCompiler, type ZodTypeProvider , jsonSchemaTransform} from "fastify-type-provider-zod"
import fastifySwaggerUi from "@fastify/swagger-ui"
import { getCoursesRoute } from "./src/routes/get-course.ts"
import { getCoursesByIdRoute } from "./src/routes/get-course-by-id.ts"
import { createCoursesRoute } from "./src/routes/create-course.ts"
import scalarAPIReference from '@scalar/fastify-api-reference'

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
}).withTypeProvider<ZodTypeProvider>()

server.register(fastifySwagger, {
  openapi: {
    info: {
      title: 'Fastify API',
      version: '1.0.0'
    }
  },
  transform: jsonSchemaTransform
})

server.register(scalarAPIReference, {
    routePrefix: '/docs',
  })


server.setValidatorCompiler(validatorCompiler)
server.setSerializerCompiler(serializerCompiler)

// validação - zod - valida entrada
//  serializa - zod - transforma saida

server.register(getCoursesRoute)
server.register(getCoursesByIdRoute)
server.register(createCoursesRoute)

server.listen({port: 3333}).then(address => {
  console.log(`Server listening on ${address}`)
})