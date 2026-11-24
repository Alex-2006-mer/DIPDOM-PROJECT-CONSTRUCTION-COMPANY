import Navbar from './components/Navbar';

export const metadata = {
  title: 'СтройПрофи Москва — строительные и отделочные работы',
  description: 'Комплексный ремонт квартир, отделка офисов и фасадные работы в Москве и Московской области.',
};

export default function RootLayout({ children }) {
  return (
    <html lang="ru">
      <body style={{ margin: 0, fontFamily: 'Arial, sans-serif', color: '#0f172a' }}>
        <Navbar />
        <main style={{ maxWidth: '1100px', margin: '0 auto', padding: '32px 16px' }}>
          {children}
        </main>
        <footer style={{ background: '#f1f5f9', padding: '20px', textAlign: 'center', marginTop: '40px', fontSize: '14px' }}>
          © 2026 ООО «СтройПрофи Москва» | Телефон: +7 (495) 123-45-67 | г. Москва
        </footer>
      </body>
    </html>
  );
}
