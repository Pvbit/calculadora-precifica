import { useEffect, useState } from 'react'
import { Navigate } from 'react-router-dom'
import { supabase } from '../../lib/supabase'

export default function ProtectedRoute({ children }) {
  const [loading, setLoading] = useState(true)
  const [authorized, setAuthorized] = useState(false)

  useEffect(() => {
    async function checkAccess() {
      const {
        data: { session },
      } = await supabase.auth.getSession()

      if (!session) {
        setAuthorized(false)
        setLoading(false)
        return
      }

      const email = session.user.email

      const { data, error } = await supabase
        .from('usuarios')
        .select('acesso')
        .eq('email', email)
        .maybeSingle()

      if (error || !data || data.acesso !== true) {
        setAuthorized(false)
      } else {
        setAuthorized(true)
      }

      setLoading(false)
    }

    checkAccess()
  }, [])

  if (loading) return <p>Carregando...</p>

  if (!authorized) return <Navigate to="/login?erro=sem-acesso" replace />

  return children
}