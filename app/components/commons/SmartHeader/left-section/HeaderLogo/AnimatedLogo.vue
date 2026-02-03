<template>
  <div class="eys-logo-container">
    <div class="logo-symbol">
      <svg
        width="40"
        height="40"
        viewBox="0 0 40 40"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <!-- Background Shape (Subtle Gradient effect via CSS) -->
        <rect
          x="2"
          y="2"
          width="36"
          height="36"
          rx="10"
          class="logo-bg"
          stroke-width="0"
        />

        <!-- Stylized EYS Letters / Graphic -->
        <!-- Just an abstract representation of EYS: 3 bars for E, branching for Y, curve for S -->
        <!-- Actually, let's do a modern "E" that looks like a book stack or open book -->

        <!-- Book/E shape -->
        <path
          d="M12 12H26C27.1 12 28 12.9 28 14V26C28 27.1 27.1 28 26 28H12"
          class="book-spine"
          stroke="white"
          stroke-width="3"
          stroke-linecap="round"
          stroke-linejoin="round"
        />
        <path
          d="M12 20H24"
          class="book-page"
          stroke="white"
          stroke-width="3"
          stroke-linecap="round"
        />
        <path
          d="M12 12V28"
          class="book-bind"
          stroke="white"
          stroke-width="3"
          stroke-linecap="round"
        />

        <!-- A small accent dot -->
        <circle cx="28" cy="11" r="3" class="accent-dot" fill="#FFB703" />
      </svg>
    </div>

    <div class="logo-text">
      <h1 class="brand-title">EYS</h1>
      <span class="brand-subtitle">Eğitim Yönetim Sistemi</span>
    </div>
  </div>
</template>

<style scoped lang="sass">
@use "~/assets/sass/shared/_colors.sass" as *

.eys-logo-container
  display: flex
  align-items: center
  gap: 10px
  cursor: pointer
  user-select: none

  &:hover
    .logo-bg
      transform: scale(1.05)
      fill: $light-primary

    .accent-dot
      transform: translateY(-2px)

    .logo-symbol
      filter: drop-shadow(0 4px 10px rgba($light-primary, 0.3))

.logo-symbol
  position: relative
  display: flex
  align-items: center
  justify-content: center
  transition: all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)

  svg
    overflow: visible

.logo-bg
  fill: $light-primary
  transition: all 0.3s ease

.book-spine, .book-page, .book-bind
  stroke: white
  transition: all 0.3s ease

.accent-dot
  transition: all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)

.logo-text
  display: flex
  flex-direction: column
  justify-content: center
  line-height: 1

.brand-title
  font-size: 1.25rem
  font-weight: 800
  color: $light-primary
  margin: 0
  letter-spacing: -0.02em
  font-family: 'Inter', sans-serif

.brand-subtitle
  font-size: 0.65rem
  font-weight: 600
  color: $light-text-secondary
  text-transform: uppercase
  letter-spacing: 0.05em
  margin-top: 2px
</style>
