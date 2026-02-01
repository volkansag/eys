export default defineEventHandler(async () => {
  const posts = await db.post.findMany({
    include: {
      author: true,
    },
  });
  return posts;
});
