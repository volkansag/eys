export default defineOAuthGoogleEventHandler({
  async onSuccess(event, { user, tokens }) {
    // Kullanıcının sistemde kayıtlı olup olmadığını kontrol et
    let dbUser = await db.user.findUnique({
      where: { email: user.email },
    });

    // Kullanıcı yoksa oluştur
    if (!dbUser) {
      dbUser = await db.user.create({
        data: {
          email: user.email,
          name: user.name,
        },
      });
    }

    // Session oluştur
    await setUserSession(event, {
      user: {
        id: dbUser.id,
        email: dbUser.email,
        name: dbUser.name,
      },
    });

    return sendRedirect(event, "/dashboard");
  },
  // Optional, will return a json error and 401 status code by default
  onError(event, error) {
    console.error("Google OAuth error:", error);
    return sendRedirect(event, "/");
  },
});
