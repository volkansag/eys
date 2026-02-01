export default defineEventHandler(async () => {
  const users = await db.user.findMany({
    include: {
      posts: true,
    },
  });
  return users;
});
