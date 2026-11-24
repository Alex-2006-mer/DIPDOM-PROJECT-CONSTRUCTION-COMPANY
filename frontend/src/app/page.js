import Link from 'next/link';
import ApplicationForm from './components/ApplicationForm';

export default function HomePage() {
  return (
    <div>
      <section style={{ background: '#eff6ff', padding: '40px', borderRadius: '12px', marginBottom: '32px' }}>
        <h1>Строительные и ремонтно-отделочные работы в Москве и Московской Облости</h1>
        <p style={{ fontSize: '18px', maxWidth: '700px' }}>
          Компания «СтройПрофи Москва» выполняет внутреннюю отделку помещений, утепление фасадов и комплексный ремонт под ключ с гарантией по договору.
        </p>
        <div style={{ display: 'flex', gap: '16px', marginTop: '20px' }}>
          <Link href="/calculator" style={{ background: '#2563eb', color: '#fff', padding: '12px 24px', borderRadius: '6px', textDecoration: 'none' }}>
            Рассчитать стоимость
          </Link>
          <Link href="/services" style={{ background: '#fff', color: '#1e293b', padding: '12px 24px', borderRadius: '6px', textDecoration: 'none', border: '1px solid #cbd5e1' }}>
            Каталог услуг
          </Link>
        </div>
      </section>

      <section style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '32px' }}>
        <div>
          <h2>О компании</h2>
          <p>В штате компании работают 18 профильных специалистов: инженеры-сметчики, прорабы и мастера-отделочники.</p>
          <ul>
            <li>Фиксированные сроки выполнения этапов</li>
            <li>Работа по договору и прозрачная смета после осмотра объекта</li>
            <li>Бесплатный выезд специалиста на замер по Москве</li>
          </ul>
        </div>
        <ApplicationForm />
      </section>
    </div>
  );
}
