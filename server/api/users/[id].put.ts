export default defineEventHandler(async (event) => {
  const id = Number(getRouterParam(event, "id"));
  const body = await readBody(event);

  const user = await db.user.update({
    where: { id },
    data: {
      email: body.email,
      name: body.name,
    },
  });

  return user;
});
