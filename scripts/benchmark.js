async function benchmark() {
  const routes = [
    'http://localhost:3000/',
    'http://localhost:3000/products',
    'http://localhost:3000/about',
    'http://localhost:3000/services',
    'http://localhost:3000/blogs',
    'http://localhost:3000/contact',
    'http://localhost:3000/faq',
    'http://localhost:3000/cart',
    'http://localhost:3000/checkout',
    'http://localhost:3000/admin'
  ];

  console.log('--- PERFORMANCE BENCHMARK (Response Times) ---');
  for (const r of routes) {
    const start = performance.now();
    const res = await fetch(r);
    const text = await res.text();
    const duration = (performance.now() - start).toFixed(1);
    const pathName = r.replace('http://localhost:3000', '') || '/';
    console.log(`${pathName.padEnd(16)} -> Status: ${res.status}, Latency: ${duration.padStart(5)}ms, Payload: ${(text.length / 1024).toFixed(1)} KB`);
  }
}

benchmark();
