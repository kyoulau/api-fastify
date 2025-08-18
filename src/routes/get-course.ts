import type { FastifyPluginAsyncZod } from "fastify-type-provider-zod"
import { db } from "../database/client.ts"
import { courses } from "../database/schema.ts"
import z from "zod"

export const getCoursesRoute: FastifyPluginAsyncZod = async (server) => {
  server.get('/courses', {
    schema: {
      tags: ['courses'],
      summary: 'Listagem de cursos',
      querystring: z.object({
        search: z.string().optional()
      }),
      response: {
        200: z.object({
          courses: z.array(
            z.object({
              id: z.uuid(),
              title: z.string()
            })
          )
        })
      }
    }
  } , async (request, reply) => {

    const { search  } = request.query

    const result = await db.select(
      {
        id: courses.id,
        title: courses.title
      }
    ).from(courses)

    return reply.send({
      courses: result
    })
  })
}