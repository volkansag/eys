import prisma from "~~/server/utils/db";

export default defineEventHandler(async (event) => {
  const id = Number(getRouterParam(event, "id"));

  await prisma.post.delete({
    where: { id },
  });

  return { success: true };
});
