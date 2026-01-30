import bcrypt from "bcryptjs";

export default defineEventHandler(async (event) => {
  const body = await readBody(event);

  if (!body.email || !body.password || !body.name) {
    throw createError({
      statusCode: 400,
      statusMessage: "Eksik bilgiler: email, şifre ve isim zorunludur.",
    });
  }

  // Check if user exists
  const existingUser = await db.user.findUnique({
    where: { email: body.email },
  });

  if (existingUser) {
    throw createError({
      statusCode: 400,
      statusMessage: "Bu email adresi ile kayıtlı bir kullanıcı zaten var.",
    });
  }

  const hashedPassword = await bcrypt.hash(body.password, 10);

  const user = await db.user.create({
    data: {
      email: body.email,
      name: body.name,
      password: hashedPassword,
    },
  });

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
