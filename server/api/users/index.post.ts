import prisma from "~~/server/utils/db";

export default defineEventHandler(async (event) => {
  const body = await readBody(event);

  const user = await prisma.user.create({
    data: {
      email: body.email,
      name: body.name,
    },
  });

  return user;
});
