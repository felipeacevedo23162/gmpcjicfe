const http = require('http');

console.log('🔍 Probando conexión con la API...\n');

// Test 1: Verificar si el puerto 3003 está abierto
const testConnection = () => {
  return new Promise((resolve, reject) => {
    const req = http.request({
      hostname: 'localhost',
      port: 3003,
      path: '/auth/login',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      timeout: 5000
    }, (res) => {
      console.log('✅ Conexión establecida');
      console.log(`📊 Status: ${res.statusCode}`);
      console.log(`📋 Headers:`, res.headers);
      
      let data = '';
      res.on('data', (chunk) => {
        data += chunk;
      });
      
      res.on('end', () => {
        console.log('📄 Respuesta:', data);
        resolve(true);
      });
    });

    req.on('error', (err) => {
      console.log('❌ Error de conexión:', err.message);
      reject(err);
    });

    req.on('timeout', () => {
      console.log('⏰ Timeout - La API no responde');
      req.destroy();
      reject(new Error('Timeout'));
    });

    // Enviar datos de prueba
    const testData = JSON.stringify({
      documento: "1214739350",
      contrasena: "29861997Fe1lpe"
    });

    req.write(testData);
    req.end();
  });
};

// Test 2: Verificar si hay algo corriendo en el puerto 3003
const checkPort = () => {
  return new Promise((resolve) => {
    const req = http.request({
      hostname: 'localhost',
      port: 3003,
      path: '/',
      method: 'GET',
      timeout: 3000
    }, (res) => {
      console.log('✅ Puerto 3003 está activo');
      resolve(true);
    });

    req.on('error', (err) => {
      console.log('❌ Puerto 3003 no está disponible:', err.message);
      resolve(false);
    });

    req.on('timeout', () => {
      console.log('⏰ Timeout verificando puerto 3003');
      req.destroy();
      resolve(false);
    });

    req.end();
  });
};

// Ejecutar pruebas
async function runTests() {
  console.log('1️⃣ Verificando si el puerto 3003 está activo...');
  const portActive = await checkPort();
  
  if (portActive) {
    console.log('\n2️⃣ Probando endpoint de login...');
    try {
      await testConnection();
    } catch (error) {
      console.log('❌ Error en el test de login');
    }
  } else {
    console.log('\n❌ La API no está corriendo en el puerto 3003');
    console.log('💡 Soluciones posibles:');
    console.log('   - Inicia tu servidor API');
    console.log('   - Verifica que esté corriendo en el puerto 3003');
    console.log('   - Revisa si hay errores en los logs de tu API');
  }
}

runTests();