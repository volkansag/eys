<template>
  <div class="schedule-ribbon-menu">
    <div class="ribbon-item active">Genel Bakış</div>
    <div class="ribbon-item">Ders Programı</div>
    <div class="ribbon-item">Öğretmenler</div>
    <div class="ribbon-item">Raporlar</div>
  </div>
</template>

<style scoped>
.schedule-ribbon-menu {
  display: flex;
  gap: 16px;
  padding: 8px 16px;
  background: rgba(0,0,0,0.02);
  border-bottom: 1px solid rgba(0,0,0,0.05);
  overflow-x: auto;
}

.ribbon-item {
  padding: 6px 12px;
  border-radius: 4px;
  font-size: 0.9rem;
  cursor: pointer;
  white-space: nowrap;
  color: #666;
}

.ribbon-item:hover {
  background: rgba(0,0,0,0.05);
  color: #333;
}

.ribbon-item.active {
  background: #eef2ff;
  color: #4f46e5;
  font-weight: 500;
}
</style>
