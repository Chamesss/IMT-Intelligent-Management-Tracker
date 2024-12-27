import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

export default function Home() {
  // remove the chat state on login
  // task modal scroll on huge description

  const navigate = useNavigate()
  useEffect(() => {
    navigate('/login')
  }, [])
  return null
}
