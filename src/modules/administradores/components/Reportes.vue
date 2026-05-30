<template>
  <div class="reportes-page">
    <div class="coming-soon">
      <div class="icono-wrap">
        <svg viewBox="0 0 24 24" fill="none" stroke="#4EB89D" stroke-width="1.5">
          <path d="M3 3v18h18" stroke-linecap="round"/>
          <path d="M7 16l4-4 4 4 4-6" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
      </div>
      <h2>Módulo de Reportes</h2>
      <p>Este módulo está en desarrollo.<br>Próximamente podrás generar reportes detallados del sistema.</p>
      <div class="features-lista">
        <div class="feature-item" v-for="f in features" :key="f">
          <span class="feature-dot"></span>
          {{ f }}
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Reportes',
  data() {
    return {
      features: [
        'Reporte de citas por período',
        'Reporte de pacientes atendidos',
        'Reporte de movimientos de farmacia',
        'Reporte de médicos y especialidades',
        'Exportación a PDF y Excel',
      ]
    };
  }
};
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Sora:wght@400;600;700&family=DM+Sans:wght@400;500&display=swap');

* { box-sizing: border-box; margin: 0; padding: 0; }

.reportes-page {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 60vh;
  font-family: 'DM Sans', sans-serif;
}

.coming-soon {
  background: #ffffff;
  border: 1px solid #e8f0ed;
  border-radius: 20px;
  padding: 52px 48px;
  text-align: center;
  max-width: 480px;
  width: 100%;
}

.icono-wrap {
  width: 72px;
  height: 72px;
  background: #e1f5ee;
  border-radius: 18px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 24px;
}

.icono-wrap svg {
  width: 36px;
  height: 36px;
}

.coming-soon h2 {
  font-family: 'Sora', sans-serif;
  font-size: 1.35rem;
  font-weight: 700;
  color: #1a2b2e;
  margin-bottom: 10px;
}

.coming-soon p {
  font-size: 0.88rem;
  color: #7a9aaa;
  line-height: 1.7;
  margin-bottom: 28px;
}

.features-lista {
  display: flex;
  flex-direction: column;
  gap: 10px;
  text-align: left;
}

.feature-item {
  display: flex;
  align-items: center;
  gap: 10px;
  font-size: 0.85rem;
  color: #3d5260;
  background: #f7fcf9;
  border: 1px solid #e8f0ed;
  border-radius: 8px;
  padding: 10px 14px;
}

.feature-dot {
  width: 7px;
  height: 7px;
  border-radius: 50%;
  background: #4EB89D;
  flex-shrink: 0;
}
</style>