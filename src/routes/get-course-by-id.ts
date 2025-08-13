import type { FastifyPluginAsyncZod } from "fastify-type-provider-zod"
import z from "zod"
import { courses } from "../database/schema.ts"
import { db } from "../database/client.ts"
import { eq } from "drizzle-orm"

export const getCoursesByIdRoute: FastifyPluginAsyncZod = async (server) => {
    server.get('/courses/:id', {
    schema: {
      params: z.object({
        id: z.uuid(),
      })
    }
  }, async (request, reply) => {
    const param = request.params
    const courseId =  param.id

    const result = await db.select({
      id: courses.id,
      title: courses.title
    }).from(courses).where(eq(courses.id, courseId))

    if(result.length > 0){
      return {
        course: result[0]
      }
    }

    return reply.status(404).send({
      error: 'Curso nao encontrado'
    })
  })
}