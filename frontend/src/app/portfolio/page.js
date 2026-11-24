async function getProjects() {
  const apiUrl = process.env.INTERNAL_API_URL || 'http://localhost:8000';
  const res = await fetch(`${apiUrl}/api/projects`, { cache: 'no-store' });
  if (!res.ok) return [];
  return res.json();
}

export default async function PortfolioPage() {
  const projects = await getProjects();

  return (
    <div>
      <h1>Выполненные проекты</h1>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))', gap: '24px' }}>
        {projects.map((proj) => (
          <div key={proj.id} style={{ border: '1px solid #e2e8f0', borderRadius: '8px', overflow: 'hidden' }}>
            <img src={proj.image_url} alt={proj.title} style={{ width: '100%', height: '200px', objectFit: 'cover' }} />
            <div style={{ padding: '16px' }}>
              <h3>{proj.title}</h3>
              <p style={{ fontSize: '13px', color: '#64748b' }}>Адрес: {proj.location} | Площадь: {proj.area_sqm} м²</p>
              <p>{proj.description}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
