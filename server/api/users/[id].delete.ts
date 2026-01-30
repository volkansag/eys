import prisma from "~~/server/utils/db";

export default defineEventHandler(async (event) => {
  const id = Number(getRouterParam(event, "id"));

  // Önce kullanıcının postlarını sil
  await prisma.post.deleteMany({
    where: { authorId: id },
  });

  // Sonra kullanıcıyı sil
  await prisma.user.delete({
    where: { id },
  });

  return { success: true };
});
