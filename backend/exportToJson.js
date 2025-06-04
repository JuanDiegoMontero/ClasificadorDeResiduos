const fs = require('fs');
const Residuo = require('./models/Residuo');
const sequelize = require('./config/database');

async function exportarResiduosAJson() {
  try {
    await sequelize.sync();
    const residuos = await Residuo.findAll();
    const data = residuos.map(r => r.toJSON());

    fs.writeFileSync('residuos_exportados.json', JSON.stringify(data, null, 2));
    console.log('✅ Datos exportados a residuos_exportados.json');
  } catch (err) {
    console.error('❌ Error al exportar:', err);
  } finally {
    await sequelize.close();
  }
}

exportarResiduosAJson();
