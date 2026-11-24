async function getServices() {
  const apiUrl = process.env.INTERNAL_API_URL || 'http://localhost:8000';
  const res = await fetch(`${apiUrl}/api/services`, { cache: 'no-store' });
  if (!res.ok) return [];
  return res.json();
}

export default async function ServicesPage() {
  const services = await getServices();

  return (
    <div>
      <h1>Каталог услуг</h1>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '24px' }}>
        {services.map((srv) => (
          <div key={srv.id} style={{ border: '1px solid #e2e8f0', borderRadius: '8px', overflow: 'hidden' }}>
            <img src={srv.image_url} alt={srv.title} style={{ width: '100%', height: '180px', objectFit: 'cover' }} />
            <div style={{ padding: '16px' }}>
              <span style={{ fontSize: '12px', color: '#2563eb', fontWeight: 'bold' }}>{srv.category}</span>
              <h3 style={{ margin: '8px 0' }}>{srv.title}</h3>
              <p style={{ fontSize: '14px', color: '#475569' }}>{srv.description}</p>
              <p style={{ fontWeight: 'bold' }}>Базовый тариф: от {srv.price_per_sqm.toLocaleString('ru-RU')} руб./м²</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
