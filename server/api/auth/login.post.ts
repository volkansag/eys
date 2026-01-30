import bcrypt from "bcryptjs";

export default defineEventHandler(async (event) => {
  const body = await readBody(event);

  if (!body.email || !body.password) {
    throw createError({
      statusCode: 400,
      statusMessage: "Email ve şifre zorunludur.",
    });
  }

  // Find user
  const user = await db.user.findUnique({
    where: { email: body.email },
  });

  if (!user) {
    throw createError({
      statusCode: 401,
      statusMessage: "Hatalı email veya şifre.",
    });
  }

  // Compare password
  if (!user.password) {
    throw createError({
      statusCode: 401,
      statusMessage: "Hatalı email veya şifre.",
    });
  }

  const validPassword = await bcrypt.compare(body.password, user.password);

  if (!validPassword) {
    throw createError({
      statusCode: 401,
      statusMessage: "Hatalı email veya şifre.",
    });
  }

  // Set user session
  await setUserSession(event, {
    user: {
      id: user.id,
      email: user.email,
      name: user.name,
    },
  });

  return {
    user: {
      id: user.id,
      email: user.email,
      name: user.name,
    },
  };
});
