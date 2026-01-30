import prisma from "~~/server/utils/db";

export default defineEventHandler(async (event) => {
  const id = Number(getRouterParam(event, "id"));
  const body = await readBody(event);

  const user = await prisma.user.update({
    where: { id },
    data: {
      email: body.email,
      name: body.name,
    },
  });

  return user;
});
