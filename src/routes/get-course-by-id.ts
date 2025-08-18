import type { FastifyPluginAsyncZod } from "fastify-type-provider-zod"
import z from "zod"
import { courses } from "../database/schema.ts"
import { db } from "../database/client.ts"
import { desc, eq } from "drizzle-orm"

export const getCoursesByIdRoute: FastifyPluginAsyncZod = async (server) => {
    server.get('/courses/:id', {
    schema: {
      tags: ['courses'],
      summary: 'Busca um curso pelo ID',
      params: z.object({
        id: z.uuid(),
      }),
      response: {
        200: z.object({
          course: z.object({
            id: z.uuid(),
            title: z.string(),
            description: z.string().nullable()
          }),
        }),
        404: z.object({
          error: z.string()
        })
      }
    }
  }, async (request, reply) => {

    const param = request.params
    const courseId =  param.id

    const result = await db.select({
      id: courses.id,
      title: courses.title,
      description: courses.description

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