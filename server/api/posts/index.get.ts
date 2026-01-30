import prisma from "~~/server/utils/db";

export default defineEventHandler(async () => {
  const posts = await prisma.post.findMany({
    include: {
      author: true,
    },
  });
  return posts;
});
