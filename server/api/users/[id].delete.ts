export default defineEventHandler(async (event) => {
  const id = Number(getRouterParam(event, "id"));

  // Önce kullanıcının postlarını sil
  await db.post.deleteMany({
    where: { authorId: id },
  });

  // Sonra kullanıcıyı sil
  await db.user.delete({
    where: { id },
  });

  return { success: true };
});
