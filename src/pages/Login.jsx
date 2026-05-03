import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'

export default function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')

  useEffect(() => {
  const params = new URLSearchParams(window.location.search);
  const erro = params.get("erro");

  if (erro === "sem-acesso") {
    setMessage(
      "Seu acesso está bloqueado. Entre em contato: contato@kalindyrodrigues.com.br"
    );
  }
}, []);

  async function handleLogin(e) {
    e.preventDefault()
    setLoading(true)
    setMessage('')

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    if (error) {
      setMessage(error.message)
    } else {
      window.location.href = '/app/calculadora'
    }

    setLoading(false)
  }

  async function handleResetPassword() {
    if (!email) {
      setMessage('Digite seu e-mail para redefinir a senha.')
      return
    }

    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: window.location.origin + '/reset-password',
    })

    if (error) {
      setMessage(error.message)
    } else {
      setMessage('Enviamos um link para redefinir sua senha.')
    }
  }

  return (
    <div style={{ maxWidth: 400, margin: '60px auto', padding: 20 }}>
      <h1>Entrar</h1>

      <form onSubmit={handleLogin}>
        <div style={{ marginBottom: 12 }}>
          <label>E-mail</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            style={{ width: '100%', padding: 10 }}
          />
        </div>

        <div style={{ marginBottom: 12 }}>
          <label>Senha</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            style={{ width: '100%', padding: 10 }}
          />
        </div>

        <button type="submit" disabled={loading} style={{ width: '100%', padding: 12 }}>
          {loading ? 'Entrando...' : 'Entrar'}
        </button>
      </form>

      <button
        onClick={handleResetPassword}
        style={{ marginTop: 12, width: '100%', padding: 12 }}
      >
        Esqueci minha senha
      </button>

      {message && <p style={{ marginTop: 16 }}>{message}</p>}
    </div>
  )
}