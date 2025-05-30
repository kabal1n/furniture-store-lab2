import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

export default function LoginPage() {
  const [login, setLogin] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const navigate = useNavigate()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    const res = await fetch('http://localhost:3001/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({ login, password }),
    })

    if (res.ok) {
      navigate('/admin')
    } else {
      const data = await res.json()
      setError(data.error || 'Ошибка входа')
    }
  }

  return (
    <div style={{ padding: '2rem' }}>
      <h2>Вход в админку</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Логин:</label><br />
          <input
            type="text"
            value={login}
            onChange={e => setLogin(e.target.value)}
          />
        </div>
        <div>
          <label>Пароль:</label><br />
          <input
            type="password"
            value={password}
            onChange={e => setPassword(e.target.value)}
          />
        </div>
        <button type="submit">Войти</button>
      </form>
      {error && <p style={{ color: 'red' }}>{error}</p>}
    </div>
  )
}
