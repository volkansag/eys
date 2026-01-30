import prisma from "~~/server/utils/db";

export default defineEventHandler(async (event) => {
  const id = Number(getRouterParam(event, "id"));
  const body = await readBody(event);

  const post = await prisma.post.update({
    where: { id },
    data: {
      title: body.title,
      content: body.content,
      published: body.published,
    },
    include: {
      author: true,
    },
  });

  return post;
});
