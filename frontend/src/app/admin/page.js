'use client';
import { useState } from 'react';

export default function AdminPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [token, setToken] = useState('');
  const [applications, setApplications] = useState([]);
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('Внутренняя отделка');
  const [price, setPrice] = useState('');
  const [desc, setDesc] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

  const handleLogin = async (e) => {
    e.preventDefault();
    setErrorMsg('');

    try {
      const res = await fetch(`${apiUrl}/api/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });

      if (!res.ok) {
        throw new Error('Не удалось войти. Проверьте данные');
      }

      const data = await res.json();
      const accessToken = data.access_token;

      const userRes = await fetch(`${apiUrl}/api/auth/me`, {
        headers: {
          Authorization: `Bearer ${accessToken}`
        }
      });

      if (!userRes.ok) {
        throw new Error('Не удалось получить данные пользователя');
      }

      const user = await userRes.json();

      if (user.role !== 'admin') {
        throw new Error('Недостаточно прав доступа');
      }

      setToken(accessToken);
      setPassword('');
      await loadApplications(accessToken);

    } catch (error) {
      setErrorMsg(error.message);
    }
  };

  const loadApplications = async (authToken) => {
    const res = await fetch(`${apiUrl}/api/admin/applications`, {
      headers: {
        Authorization: `Bearer ${authToken}`
      }
    });

    if (!res.ok) {
      throw new Error('Не удалось загрузить заявки');
    }

    setApplications(await res.json());
  };

  const changeStatus = async (id, newStatus) => {
    setErrorMsg('');

    try {
      const res = await fetch(`${apiUrl}/api/admin/applications/${id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: 'Bearer ${token}',
        },
        body: JSON.stringify({ status: newStatus }),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.detail || 'Не удалось изменить статус');
      }

      await loadApplications(token);
    } catch (error) {
      setErrorMsg(error.message);
      await loadApplications(token);
    }
  };

  const addService = async (e) => {
    e.preventDefault();
    const res = await fetch(`${apiUrl}/api/admin/services`, {
      method: 'POST',
      body: JSON.stringify({
        title,
        category,
        price_per_sqm: Number(price),
        description: desc
      })
    });
    if (res.ok) {
      alert('Услуга добавлена и уже отображается в каталоге и калькуляторе!');
      setTitle('');
      setPrice('');
      setDesc('');
    }
  };

 if (!token) {
  return (
    <form
      onSubmit={handleLogin}
      style={{ maxWidth: '350px', margin: '40px auto' }}
    >
      <h2>Вход в панель администратора</h2>

      {errorMsg && (
        <p role="alert" style={{ color: 'red' }}>
          {errorMsg}
        </p>
      )}

      <input
        required
        type="email"
        placeholder="Электронная почта"
        value={email}
        onChange={e => setEmail(e.target.value)}
        style={{
          width: '100%',
          padding: '10px',
          marginBottom: '12px'
        }}
      />

      <input
        required
        type="password"
        placeholder="Пароль"
        value={password}
        onChange={e => setPassword(e.target.value)}
        style={{
          width: '100%',
          padding: '10px',
          marginBottom: '12px'
        }}
      />

      <button
        type="submit"
        style={{
          padding: '10px 20px',
          background: '#1e293b',
          color: '#fff',
          border: 'none'
        }}
      >
        Войти
      </button>
    </form>
  );
}

  return (
    <div>
      <h1>Административная панель</h1>
          <button onClick={() => {
      setToken('');
      setApplications([]);
      setErrorMsg('');
    }}>
      Выйти
    </button>

      <h2>Поступившие заявки ({applications.length})</h2>
      {errorMsg && <p role="alert" style={{ color: 'red' }}>{errorMsg}</p>}
      <table border="1" cellPadding="8" style={{ width: '100%', borderCollapse: 'collapse', marginBottom: '40px' }}>
        <thead>
          <tr style={{ background: '#f1f5f9' }}>
            <th>ID</th>
            <th>Клиент</th>
            <th>Телефон</th>
            <th>Описание задачи</th>
            <th>Расчёт</th>
            <th>Статус</th>
          </tr>
        </thead>
        <tbody>
          {applications.map(app => (
            <tr key={app.id}>
              <td>{app.id}</td>
              <td>{app.client_name}</td>
              <td>{app.phone}</td>
              <td>{app.description}</td>
              <td>{app.estimated_cost ? `${app.estimated_cost} руб.` : '—'}</td>
              <td>
                <select value={app.status} onChange={e => changeStatus(app.id, e.target.value)}>
                  <option value="Новая заявка">Новая заявка</option>
                  <option value="В работе">В работе</option>
                  <option value="Завершена">Завершена</option>
                </select>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <h2>Добавить новую услугу в каталог</h2>
      <form onSubmit={addService} style={{ maxWidth: '500px', background: '#f8fafc', padding: '20px', border: '1px solid #cbd5e1' }}>
        <input required placeholder="Название услуги" value={title} onChange={e => setTitle(e.target.value)} style={{ width: '100%', padding: '8px', marginBottom: '10px' }} />
        <input required placeholder="Категория" value={category} onChange={e => setCategory(e.target.value)} style={{ width: '100%', padding: '8px', marginBottom: '10px' }} />
        <input required type="number" placeholder="Цена за м² (руб.)" value={price} onChange={e => setPrice(e.target.value)} style={{ width: '100%', padding: '8px', marginBottom: '10px' }} />
        <textarea required placeholder="Описание услуги" value={desc} onChange={e => setDesc(e.target.value)} style={{ width: '100%', padding: '8px', marginBottom: '10px' }} />
        <button type="submit" style={{ background: '#16a34a', color: '#fff', padding: '10px 16px', border: 'none' }}>Сохранить услугу</button>
      </form>
    </div>
  );
}
