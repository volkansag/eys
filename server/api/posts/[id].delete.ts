export default defineEventHandler(async (event) => {
  const id = Number(getRouterParam(event, "id"));

  await db.post.delete({
    where: { id },
  });

  return { success: true };
});
