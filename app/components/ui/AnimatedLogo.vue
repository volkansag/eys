<template>
  <div class="animated-logo">
    <svg
      width="32"
      height="32"
      viewBox="0 0 32 32"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M16 2L4 9V23L16 30L28 23V9L16 2Z"
        class="hexagon"
        stroke="currentColor"
        stroke-width="2"
        stroke-linejoin="round"
      />
      <path
        d="M16 12V20M12 16H20"
        class="inner-plus"
        stroke="currentColor"
        stroke-width="2"
        stroke-linecap="round"
      />
      <circle cx="16" cy="16" r="3" class="pulse-circle" fill="currentColor" />
    </svg>
  </div>
</template>

<style scoped lang="sass">
@use "~/assets/sass/shared/_colors.sass" as *

.animated-logo
  display: flex
  align-items: center
  justify-content: center
  color: $light-primary

  svg
    overflow: visible

  .hexagon
    fill: rgba($light-primary, 0.05)
    stroke: $light-primary
    transition: all 0.3s ease

  .inner-plus
    transform-origin: center
    transition: transform 0.5s cubic-bezier(0.34, 1.56, 0.64, 1)

  .pulse-circle
    opacity: 0
    transform: scale(0)
    transform-origin: center
    transition: all 0.3s ease

  &:hover
    .inner-plus
      transform: rotate(90deg)

    .pulse-circle
      opacity: 1
      transform: scale(1)

    .hexagon
      fill: rgba($light-primary, 0.1)
      filter: drop-shadow(0 0 8px rgba($light-primary, 0.3))
</style>
