import type { FastifyPluginAsyncZod } from "fastify-type-provider-zod"
import z from "zod"
import { courses } from "../database/schema.ts"
import { db } from "../database/client.ts"

// oq muda é o recurso
export const createCoursesRoute: FastifyPluginAsyncZod = async (server) => {
  server.post('/courses', {
    schema: {
      tags: ['courses'],
      summary: 'Cria um curso',
      body: z.object({
        title: z.string().min(3).nonempty(),
        description: z.string().optional()
      }),
      response: {
        201: z.object({
          courseId: z.uuid()
        })
      }
    }
  }, async (request, reply) => {

    const { title, description } = request.body

    const result = await db
      .insert(courses)
      .values({ title, description })
      .returning()

    return reply.status(201).send({
      courseId: result[0].id
    })
  })
}