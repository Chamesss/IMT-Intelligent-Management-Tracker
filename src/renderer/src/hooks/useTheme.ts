import { useEffect, useState } from 'react'

const useThemeMode = (initialMode = 'light') => {
  const [mode, setMode] = useState(() => {
    return localStorage.getItem('mode') || initialMode
  })

  useEffect(() => {
    const html = document.documentElement
    html.classList.remove('light', 'dark', 'blue-mode')
    html.classList.add(mode)
    localStorage.setItem('mode', mode)
  }, [mode])

  // const toggleMode = () => {
  //   if (mode === 'light') {
  //     setMode('dark')
  //   } else if (mode === 'dark') {
  //     setMode('blue-mode')
  //   } else {
  //     setMode('light')
  //   }
  // }

  const toggleMode = () => {
    if (mode === 'light') {
      setMode('dark')
    } else {
      setMode('light')
    }
  }

  return { mode, toggleMode }
}

export default useThemeMode
