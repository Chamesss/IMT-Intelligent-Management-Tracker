import { useAuth } from '@/hooks/useAuth'
import { Button } from '@/ui/button'
import { CardDescription, CardTitle } from '@/ui/card'
import { Checkbox } from '@/ui/checkbox'
import { Input } from '@/ui/input'
import { Label } from '@/ui/label'
import axios, { AxiosError } from 'axios'
import { Eye, EyeOff } from 'lucide-react'
import { FormEvent, useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Spinner from '../../components/spinner'

export default function Login() {
  const { login } = useAuth()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [passwordVisible, setPasswordVisible] = useState(false)
  const [loading, setLoading] = useState(false)
  const [errorMessage, setErrorMessage] = useState<string | undefined>()
  const navigate = useNavigate()

  useEffect(() => {
    window.api.logoutMain()
  }, [])

  const handleNavigation = () => {
    navigate('/forget-password')
  }

  const submit = async (e: FormEvent) => {
    setErrorMessage(undefined)
    e.preventDefault()
    setLoading(true)
    try {
      const response = await axios(`${import.meta.env.VITE_KEY_API_URL}/api/user/login`, {
        method: 'POST',
        data: {
          email,
          password
        }
      })
      if (response.status === 200) {
        login(response.data.accessToken, response.data.refreshToken, response.data.user)
        navigate('/dashboard')
      }
    } catch (error: unknown | AxiosError) {
      if (axios.isAxiosError(error)) {
        setErrorMessage(error.response?.data.message)
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex h-full w-full items-center justify-center dark:bg-black">
      <div className="mx-auto my-auto h-fit w-[35rem] -translate-y-[1rem] space-y-16 px-[2px] py-4">
        <div className="space-y-1">
          <CardTitle className="text-[3rem] font-bold text-darkGray dark:text-white">
            Sign In
          </CardTitle>
          <CardDescription className="text-xl text-lightGray">
            Enter your email and password to sign in!
          </CardDescription>
        </div>
        <div>
          <form className="relative flex flex-col space-y-8" onSubmit={submit}>
            <div className="space-y-6">
              <Label htmlFor="email" className="!text-[1.193rem] font-medium">
                Email<span className="text-rose-500">*</span>
              </Label>
              <Input
                id="email"
                type="email"
                name="email"
                placeholder="m@example.com"
                onChange={(e) => setEmail(e.target.value)}
                className="w-full text-md dark:border-neutral-800 dark:bg-neutral-800"
                required
              />
            </div>
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <Label htmlFor="password" className="!text-[1.193rem] font-medium">
                  Password<span className="text-rose-500">*</span>
                </Label>
              </div>
              <div className="relative">
                <Input
                  id="password"
                  name="password"
                  type={passwordVisible ? 'text' : 'password'}
                  required
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pr-[3rem] text-md dark:border-neutral-800 dark:bg-neutral-800"
                  placeholder="password"
                />
                <div className="absolute right-4 top-1/2 -translate-y-1/2 rounded-full p-1 transition-all hover:scale-105 hover:bg-gray-950/10 active:scale-95">
                  {passwordVisible ? (
                    <EyeOff
                      onClick={() => setPasswordVisible(false)}
                      className="h-6 w-6 cursor-pointer text-gray-500 dark:text-white"
                    />
                  ) : (
                    <Eye
                      onClick={() => setPasswordVisible(true)}
                      className="h-6 w-6 cursor-pointer text-gray-500 dark:text-white"
                    />
                  )}
                </div>
              </div>
            </div>
            <div className="flex w-full items-center justify-between">
              <div className="flex items-center space-x-4">
                <Checkbox className="h-[1.5rem] w-[1.5rem]" id="logged" />
                <label
                  htmlFor="logged"
                  className="text-md font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                  Keep me logged in
                </label>
              </div>
              <a
                onClick={handleNavigation}
                className="cursor-pointer text-md font-medium text-black hover:underline"
              >
                Forgot Password?
              </a>
            </div>
            <Button
              type="submit"
              className="h-[4rem] !rounded-default bg-black text-md font-bold dark:bg-white"
            >
              {loading ? (
                <Spinner className="mx-auto !border-white !border-t-transparent dark:!border-black dark:!border-t-transparent" />
              ) : (
                'Sign In'
              )}
            </Button>
            {errorMessage && (
              <p className="absolute -bottom-[10%] left-1/2 -translate-x-1/2 transform text-sm text-red-500">
                {errorMessage}
              </p>
            )}
          </form>
        </div>
      </div>
    </div>
  )
}
