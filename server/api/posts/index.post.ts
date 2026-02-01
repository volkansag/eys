export default defineEventHandler(async (event) => {
  const body = await readBody(event);

  const post = await db.post.create({
    data: {
      title: body.title,
      content: body.content,
      published: body.published ?? false,
      authorId: body.authorId,
    },
    include: {
      author: true,
    },
  });

  return post;
});
