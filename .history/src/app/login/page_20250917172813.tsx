'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { loginApi } from '@/services/auth.service';
import { useAuthStore } from '@/store/auth';


export default function AuthPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError]       = useState('');
  const [loading, setLoading]   = useState(false);

  const router = useRouter();
  const {login, token, hydrated} = useAuthStore()

  useEffect(() => {
    if (hydrated && token) {
      router.replace('/')
    }
  }, [hydrated, token, router])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const { access_token } = await loginApi(username, password);
      login(access_token);
      router.push('/');
    } catch (err: any) {
      setError(err.message || 'Ошибка авторизации');
    } finally {
      setLoading(false)
    }
  };

  return (
    <div className="flex items-center justify-center h-screen">
      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
        <h2 className="text-2xl font-bold text-center mb-6">Авторизация</h2>

        {error && <div className="text-red-600 text-center mb-4">{error}</div>}

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            value={username}
            onChange={e => setUsername(e.target.value)}
            className="w-full p-3 border border-gray-300 rounded-md"
            placeholder="Введите логин"
            autoComplete="username"
            required
          />
          <input
            type="password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            className="w-full p-3 border border-gray-300 rounded-md"
            placeholder="Введите пароль"
            autoComplete="current-password"
            required
          />

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-emerald-800 text-white p-3 rounded-md hover:bg-emerald-900 disabled:opacity-60"
          >
            {loading ? 'Входим…' : 'Войти'}
          </button>
        </form>
      </div>
    </div>
  );
}
