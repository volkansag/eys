import prisma from "~~/server/utils/db";

export default defineEventHandler(async () => {
  const users = await prisma.user.findMany({
    include: {
      posts: true,
    },
  });
  return users;
});
