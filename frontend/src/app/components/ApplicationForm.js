'use client';
import { useState } from 'react';

export default function ApplicationForm({ initialDescription = '', estimatedCost = null }) {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [description, setDescription] = useState(initialDescription);
  const [statusMsg, setStatusMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatusMsg('');
    setErrorMsg('');

    const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';
    try {
      const res = await fetch(`${apiUrl}/api/applications`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          client_name: name,
          phone,
          email: email || null,
          description,
          estimated_cost: estimatedCost
        })
      });
      if (!res.ok) throw new Error('Проверьте правильность заполнения обязательных полей');
      setStatusMsg('Заявка успешно отправлена! Наш специалист свяжется с вами в ближайшее время.');
      setName('');
      setPhone('');
      setEmail('');
    } catch (err) {
      setErrorMsg(err.message);
    }
  };

  return (
    <form onSubmit={handleSubmit} style={{ maxWidth: '500px', background: '#f8fafc', padding: '24px', borderRadius: '8px', border: '1px solid #cbd5e1' }}>
      <h3>Оставить заявку на консультацию</h3>
      {estimatedCost && (
        <p style={{ background: '#fef3c7', padding: '8px', borderRadius: '4px' }}>
          Ориентировочный расчёт: <strong>{estimatedCost.toLocaleString('ru-RU')} руб.</strong>
        </p>
      )}
      <div style={{ marginBottom: '12px' }}>
        <label>Ваше имя *</label><br />
        <input required value={name} onChange={e => setName(e.target.value)} style={{ width: '100%', padding: '8px' }} />
      </div>
      <div style={{ marginBottom: '12px' }}>
        <label>Телефон *</label><br />
        <input required value={phone} onChange={e => setPhone(e.target.value)} placeholder="+7 (999) 000-00-00" style={{ width: '100%', padding: '8px' }} />
      </div>
      <div style={{ marginBottom: '12px' }}>
        <label>Email (необязательно)</label><br />
        <input type="email" value={email} onChange={e => setEmail(e.target.value)} style={{ width: '100%', padding: '8px' }} />
      </div>
      <div style={{ marginBottom: '12px' }}>
        <label>Описание задачи *</label><br />
        <textarea required rows={3} value={description} onChange={e => setDescription(e.target.value)} style={{ width: '100%', padding: '8px' }} />
      </div>
      <p style={{ fontSize: '12px', color: '#64748b' }}>
        Нажимая кнопку, вы соглашаетесь на обработку персональных данных в целях обратной связи (ФЗ № 152-ФЗ).
      </p>
      <button type="submit" style={{ background: '#2563eb', color: '#fff', padding: '10px 20px', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>
        Отправить заявку
      </button>
      {statusMsg && <p style={{ color: 'green', marginTop: '10px' }}>{statusMsg}</p>}
      {errorMsg && <p style={{ color: 'red', marginTop: '10px' }}>{errorMsg}</p>}
    </form>
  );
}
