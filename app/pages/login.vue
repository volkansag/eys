<script setup lang="ts">
definePageMeta({
  middleware: "guest",
  layout: "landing",
});

const { loggedIn, user, fetch: refreshSession } = useUserSession();
const router = useRouter();
const { addToast, hasToast } = useToast();

const form = reactive({
  email: "",
  password: "",
});

const loading = ref(false);

async function login() {
  // Smart validation - collect all errors
  const emailEmpty = !form.email.trim();
  const passwordEmpty = !form.password.trim();
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const emailInvalid = !emailEmpty && !emailRegex.test(form.email);

  const errors: string[] = [];

  // Both fields empty
  if (emailEmpty && passwordEmpty) {
    addToast({
      message: "Tüm alanlar doldurulmalıdır.",
      type: "warning",
    });
    return;
  }

  // Collect errors
  if (emailEmpty) {
    errors.push("Email adresi gereklidir.");
  } else if (emailInvalid) {
    errors.push("Geçerli bir email adresi giriniz.");
  }

  if (passwordEmpty) {
    errors.push("Şifre gereklidir.");
  }

  // Show errors - sequential for new toasts, immediate for duplicates
  if (errors.length > 0) {
    // Check if ALL errors are duplicates (already visible)
    const allDuplicates = errors.every((msg) => hasToast(msg, "warning"));

    if (allDuplicates) {
      // All are duplicates - reset timers immediately (no delay)
      errors.forEach((message) => {
        addToast({ message, type: "warning" });
      });
    } else {
      // Has new toasts - use sequential delay
      let delay = 0;
      errors.forEach((message) => {
        const isDuplicate = hasToast(message, "warning");
        if (isDuplicate) {
          // Duplicate: reset immediately
          addToast({ message, type: "warning" });
        } else {
          // New: add with delay
          setTimeout(() => {
            addToast({ message, type: "warning" });
          }, delay);
          delay += 1000; // Increment delay for next new toast
        }
      });
    }
    return;
  }

  loading.value = true;

  try {
    await $fetch("/api/auth/login", {
      method: "POST",
      body: form,
    });

    await refreshSession();

    addToast({
      title: "Başarılı",
      message: "Giriş başarılı, yönlendiriliyorsunuz...",
      type: "success",
    });

    router.push("/dashboard");
  } catch (e: any) {
    addToast({
      title: "Uyarı",
      message: e.data?.statusMessage || "Giriş yapılırken bir hata oluştu.",
      type: "warning",
    });
  } finally {
    loading.value = false;
  }
}
</script>

<template>
  <div class="auth-page">
    <div class="auth-card">
      <div class="auth-header">
        <h1 class="auth-title">Hoşgeldiniz</h1>
        <p class="auth-subtitle">Devam etmek için giriş yapın</p>
      </div>

      <form @submit.prevent="login" class="auth-form" novalidate>
        <UiInput
          v-model="form.email"
          label="Email"
          type="email"
          placeholder="ornek@email.com"
          :disabled="loading"
        />

        <UiInput
          v-model="form.password"
          label="Şifre"
          type="password"
          placeholder="••••••••"
          :disabled="loading"
        />

        <UiButtonPrimaryButton
          type="submit"
          :disabled="loading"
          class="full-width"
        >
          {{ loading ? "Giriş Yapılıyor..." : "Giriş Yap" }}
        </UiButtonPrimaryButton>
      </form>

      <div class="divider">
        <span>VEYA</span>
      </div>

      <UiButtonSecondaryButton
        class="full-width google-btn"
        href="/auth/google"
      >
        <svg
          class="google-icon"
          viewBox="0 0 24 24"
          width="20"
          height="20"
          xmlns="http://www.w3.org/2000/svg"
        >
          <g transform="matrix(1, 0, 0, 1, 27.009001, -39.23856)">
            <path
              fill="#4285F4"
              d="M -3.264 51.509 C -3.264 50.719 -3.334 49.969 -3.454 49.239 L -14.754 49.239 L -14.754 53.749 L -8.284 53.749 C -8.574 55.229 -9.424 56.479 -10.684 57.329 L -10.684 60.329 L -6.824 60.329 C -4.564 58.239 -3.264 55.159 -3.264 51.509 Z"
            />
            <path
              fill="#34A853"
              d="M -14.754 63.239 C -11.514 63.239 -8.804 62.159 -6.824 60.329 L -10.684 57.329 C -11.764 58.049 -13.134 58.489 -14.754 58.489 C -17.884 58.489 -20.534 56.379 -21.484 53.529 L -25.464 53.529 L -25.464 56.619 C -23.494 60.539 -19.444 63.239 -14.754 63.239 Z"
            />
            <path
              fill="#FBBC05"
              d="M -21.484 53.529 C -21.734 52.809 -21.864 52.039 -21.864 51.239 C -21.864 50.439 -21.734 49.669 -21.484 48.949 L -21.484 45.859 L -25.464 45.859 C -26.284 47.479 -26.754 49.299 -26.754 51.239 C -26.754 53.179 -26.284 54.999 -25.464 56.619 L -21.484 53.529 Z"
            />
            <path
              fill="#EA4335"
              d="M -14.754 43.989 C -12.984 43.989 -11.404 44.599 -10.154 45.799 L -6.734 42.379 C -8.804 40.439 -11.514 39.239 -14.754 39.239 C -19.444 39.239 -23.494 41.939 -25.464 45.859 L -21.484 48.949 C -20.534 46.099 -17.884 43.989 -14.754 43.989 Z"
            />
          </g>
        </svg>
        Google ile Giriş Yap
      </UiButtonSecondaryButton>

      <div class="auth-footer">
        <p>Hesabınız yok mu? <NuxtLink to="/register">Kayıt Olun</NuxtLink></p>
      </div>
    </div>
  </div>
</template>

<style scoped lang="sass">
@use "~/assets/sass/shared/_colors.sass" as *

.auth-page
  min-height: 100vh
  display: flex
  align-items: center
  justify-content: center
  padding: 20px
  position: relative
  z-index: 1

.auth-card
  background: white
  padding: 40px
  border-radius: 24px
  box-shadow: 0 20px 50px rgba($light-primary, 0.1)
  width: 100%
  max-width: 420px
  backdrop-filter: blur(10px)
  background: rgba(255, 255, 255, 0.9)
  border: 1px solid white

.auth-header
  text-align: center
  margin-bottom: 30px

.auth-title
  font-size: 28px
  font-weight: 800
  color: $light-text-header
  margin-bottom: 8px

.auth-subtitle
  color: $light-text-muted
  font-size: 15px

.auth-form
  display: flex
  flex-direction: column
  // UiInput handles its own margins, but we might want spacing

.full-width
  width: 100%
  justify-content: center

.divider
  display: flex
  align-items: center
  text-align: center
  margin: 25px 0
  color: $light-text-muted
  font-size: 13px
  font-weight: 500

  &::before,
  &::after
    content: ''
    flex: 1
    border-bottom: 1px solid $light-border

  span
    padding: 0 10px

.google-btn
  border-color: $light-border !important
  background: white !important
  color: $light-text-primary !important

  &:hover
    background: $light-surface-alt !important

.google-icon
  margin-right: 8px

.error-message
  background-color: rgba($color-error, 0.1)
  color: $color-error
  padding: 12px
  border-radius: 8px
  font-size: 0.9rem
  margin-bottom: 1.5rem
  text-align: center
  border: 1px solid rgba($color-error, 0.2)

.auth-footer
  margin-top: 30px
  text-align: center
  font-size: 14px
  color: $light-text-muted

  a
    color: $light-primary
    text-decoration: none
    font-weight: 600

    &:hover
      text-decoration: underline
</style>
