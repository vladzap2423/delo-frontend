'use client'

import { useEffect, useState } from "react"

export default function AdminPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Форма для добавления
  const [newUser, setNewUser] = useState({
    username: '',
    password: '',
    fio: '',
    post: '',
    role: 'user',
  });

  // Загружаем список пользователей
  useEffect(() => {
    fetchUsers();
  }, []);

  async function fetchUsers() {
    try {
      setLoading(true);
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/users`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        }
      );

      if (!res.ok) throw new Error('Ошибка загрузки пользователей');
      const data = await res.json();
      setUsers(data);
    } catch (err) {
      setError('Не удалось загрузить пользователей');
    } finally {
      setLoading(false);
    }
  }

  async function handleAddUser(e: React.FormEvent) {
    e.preventDefault();
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/users`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
          body: JSON.stringify(newUser),
        }
      );

      if (!res.ok) throw new Error('Ошибка при добавлении пользователя');
      await fetchUsers(); // обновляем список
      setNewUser({ username: '', password: '', fio: '', post: '', role: 'user' });
    } catch (err) {
      setError('Не удалось добавить пользователя');
    }
  }

  async function handleUpdateUser(user: User) {
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/users/${user.id}`,
        {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
          body: JSON.stringify(user),
        }
      );

      if (!res.ok) throw new Error('Ошибка обновления пользователя');
      await fetchUsers();
    } catch (err) {
      setError('Не удалось обновить пользователя');
    }
  }

  if (loading) return <div className="p-6">Загрузка...</div>;

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Админ-панель</h1>

      {error && <div className="text-red-500 mb-4">{error}</div>}

      {/* Список пользователей */}
      <h2 className="text-xl font-semibold mb-4">Пользователи</h2>
      <table className="w-full border border-gray-300 mb-8">
        <thead>
          <tr className="bg-gray-200">
            <th className="p-2 border">ID</th>
            <th className="p-2 border">Логин</th>
            <th className="p-2 border">ФИО</th>
            <th className="p-2 border">Должность</th>
            <th className="p-2 border">Роль</th>
            <th className="p-2 border">Действия</th>
          </tr>
        </thead>
        <tbody>
          {users.map((u) => (
            <tr key={u.id}>
              <td className="p-2 border">{u.id}</td>
              <td className="p-2 border">{u.username}</td>
              <td className="p-2 border">{u.fio}</td>
              <td className="p-2 border">{u.post}</td>
              <td className="p-2 border">{u.role}</td>
              <td className="p-2 border">
                <button
                  className="bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700"
                  onClick={() => handleUpdateUser({ ...u, role: u.role === 'user' ? 'admin' : 'user' })}
                >
                  Сменить роль
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Добавление пользователя */}
      <h2 className="text-xl font-semibold mb-4">Добавить пользователя</h2>
      <form onSubmit={handleAddUser} className="grid gap-4 max-w-md">
        <input
          type="text"
          placeholder="Логин"
          value={newUser.username}
          onChange={(e) => setNewUser({ ...newUser, username: e.target.value })}
          className="p-2 border rounded"
          required
        />
        <input
          type="password"
          placeholder="Пароль"
          value={newUser.password}
          onChange={(e) => setNewUser({ ...newUser, password: e.target.value })}
          className="p-2 border rounded"
          required
        />
        <input
          type="text"
          placeholder="ФИО"
          value={newUser.fio}
          onChange={(e) => setNewUser({ ...newUser, fio: e.target.value })}
          className="p-2 border rounded"
        />
        <input
          type="text"
          placeholder="Должность"
          value={newUser.post}
          onChange={(e) => setNewUser({ ...newUser, post: e.target.value })}
          className="p-2 border rounded"
        />
        <select
          value={newUser.role}
          onChange={(e) => setNewUser({ ...newUser, role: e.target.value })}
          className="p-2 border rounded"
        >
          <option value="user">Пользователь</option>
          <option value="admin">Админ</option>
        </select>
        <button
          type="submit"
          className="bg-emerald-700 text-white p-2 rounded hover:bg-emerald-800"
        >
          Добавить
        </button>
      </form>
    </div>
  );
}