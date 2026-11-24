import Link from 'next/link';

export default function Navbar() {
  return (
    <header style={{ background: '#1e293b', color: '#fff', padding: '16px 32px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
      <Link href="/" style={{ color: '#fff', fontWeight: 'bold', fontSize: '20px', textDecoration: 'none' }}>
        СтройПрофи Москва
      </Link>
      <nav style={{ display: 'flex', gap: '20px' }}>
        <Link href="/" style={{ color: '#e2e8f0', textDecoration: 'none' }}>Главная</Link>
        <Link href="/services" style={{ color: '#e2e8f0', textDecoration: 'none' }}>Услуги</Link>
        <Link href="/calculator" style={{ color: '#fbbf24', fontWeight: 'bold', textDecoration: 'none' }}>Калькулятор</Link>
        <Link href="/portfolio" style={{ color: '#e2e8f0', textDecoration: 'none' }}>Портфолио</Link>
        <Link href="/admin" style={{ color: '#94a3b8', textDecoration: 'none' }}>Админ-панель</Link>
      </nav>
    </header>
  );
}
