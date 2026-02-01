export default defineEventHandler(async (event) => {
  const body = await readBody(event);

  const user = await db.user.create({
    data: {
      email: body.email,
      name: body.name,
    },
  });

  return user;
});
