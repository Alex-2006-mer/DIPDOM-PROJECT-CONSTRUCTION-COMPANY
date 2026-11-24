'use client';
import { useState, useEffect } from 'react';
import ApplicationForm from '../components/ApplicationForm';

export default function CalculatorPage() {
  const [services, setServices] = useState([]);
  const [selectedId, setSelectedId] = useState('');
  const [area, setArea] = useState(50);
  const [urgencyCoef, setUrgencyCoef] = useState(1.0);

  useEffect(() => {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';
    fetch(`${apiUrl}/api/services`)
      .then(res => res.json())
      .then(data => {
        setServices(data);
        if (data.length > 0) setSelectedId(String(data[0].id));
      });
  }, []);

  const currentService = services.find(s => String(s.id) === selectedId);
  const estimatedCost = currentService ? Math.round(currentService.price_per_sqm * area * urgencyCoef) : 0;

  return (
    <div>
      <h1>Калькулятор ориентировочной стоимости работ</h1>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '32px' }}>
        <div style={{ background: '#f8fafc', padding: '24px', borderRadius: '8px', border: '1px solid #cbd5e1' }}>
          <div style={{ marginBottom: '16px' }}>
            <label><strong>1. Выберите направление работ:</strong></label><br />
            <select value={selectedId} onChange={e => setSelectedId(e.target.value)} style={{ width: '100%', padding: '10px', marginTop: '6px' }}>
              {services.map(s => (
                <option key={s.id} value={s.id}>{s.title} ({s.price_per_sqm} руб./м²)</option>
              ))}
            </select>
          </div>

          <div style={{ marginBottom: '16px' }}>
            <label><strong>2. Площадь помещения / фасада (м²): {area} м²</strong></label><br />
            <input type="range" min="10" max="500" value={area} onChange={e => setArea(Number(e.target.value))} style={{ width: '100%' }} />
          </div>

          <div style={{ marginBottom: '16px' }}>
            <label><strong>3. Условия выполнения работ:</strong></label><br />
            <select value={urgencyCoef} onChange={e => setUrgencyCoef(Number(e.target.value))} style={{ width: '100%', padding: '10px', marginTop: '6px' }}>
              <option value={1.0}>Стандартный график (коэф. 1.0)</option>
              <option value={1.15}>Срочное выполнение / стеснённые условия (коэф. 1.15)</option>
              <option value={1.25}>Сложная геометрия / премиум-материалы (коэф. 1.25)</option>
            </select>
          </div>

          <div style={{ background: '#dbeafe', padding: '16px', borderRadius: '8px' }}>
            <div>Ориентировочная стоимость:</div>
            <div style={{ fontSize: '28px', fontWeight: 'bold', color: '#1d4ed8' }}>
              {estimatedCost.toLocaleString('ru-RU')} руб.
            </div>
            <p style={{ fontSize: '12px', color: '#475569', marginBottom: 0 }}>
              * Расчёт носит предварительный характер на основании базовых тарифов. Окончательная смета определяется после осмотра объекта и уточнения условий работ.
            </p>
          </div>
        </div>

        <div>
          {currentService && (
            <ApplicationForm
              key={`${selectedId}-${area}-${urgencyCoef}`}
              estimatedCost={estimatedCost}
              initialDescription={`Расчёт из калькулятора: ${currentService.title}, площадь ${area} м².`}
            />
          )}
        </div>
      </div>
    </div>
  );
}
