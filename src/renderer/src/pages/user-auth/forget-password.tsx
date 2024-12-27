import Spinner from '@/components/spinner'
import { cn } from '@/lib/utils'
import { Button } from '@/ui/button'
import { Card, CardContent, CardFooter, CardHeader } from '@/ui/card'
import { Input } from '@/ui/input'
import { InputOTP, InputOTPGroup, InputOTPSlot } from '@/ui/input-otp'
import { Label } from '@/ui/label'
import axios, { AxiosError } from 'axios'
import { CircleCheckBig, Eye, EyeOff } from 'lucide-react'
import { FormEvent, useEffect, useState } from 'react'
import toast from 'react-hot-toast'
import { useNavigate } from 'react-router-dom'

export default function ForgetPassword() {
  const [email, setEmail] = useState('')
  const [otp, setOtp] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [passwordVisible, setPasswordVisible] = useState(false)
  const [resendSuccess, setResendSuccess] = useState(false)
  const [counter, setCounter] = useState(0)
  const [secret, setSecret] = useState('')
  const [loading, setLoading] = useState(false)
  const [loadingResend, setLoadingResend] = useState(false)
  const [success, setSuccess] = useState(false)
  const [successOTP, setSuccessOTP] = useState(false)
  const [error, setError] = useState('')
  const navigate = useNavigate()

  const SubmitForm = async (e: FormEvent) => {
    e.preventDefault()
    setCounter(0)
    setError('')
    setLoading(true)
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_KEY_API_URL}/api/user/forget-password`,
        { email }
      )
      if (response.status === 201) {
        setSuccess(true)
      }
    } catch (error) {
      setSuccess(false)
      error instanceof Error && setError(error.message)
      error instanceof AxiosError && setError(error.response?.data.message)
      console.error(error)
    } finally {
      setLoading(false)
    }
  }

  const SubmitOTP = async (e: FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_KEY_API_URL}/api/user/verify-code`,
        {
          email,
          verificationCode: otp
        }
      )
      if (response.status === 200) {
        setSuccessOTP(true)
        setSecret(response.data.secretCode)
      }
      setSuccessOTP(true)
    } catch (error) {
      setSuccess(false)
      error instanceof Error && setError(error.message)
      error instanceof AxiosError && setError(error.response?.data.message)
      console.error(error)
    } finally {
      setLoading(false)
    }
  }

  const SubmitPassword = async (e: FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    console.log(secret)

    if (password !== confirmPassword) {
      setError('Passwords do not match')
      setLoading(false)
      return
    }

    try {
      const response = await axios.post(
        `${import.meta.env.VITE_KEY_API_URL}/api/user/reset-password`,
        {
          email,
          newPassword: password,
          secretCode: secret
        }
      )
      if (response.status === 200) {
        navigate('/login')
        toast.success('Password reset successful')
      }
    } catch (error) {
      setSuccess(false)
      error instanceof Error && setError(error.message)
      error instanceof AxiosError && setError(error.response?.data.message)
      console.error(error)
    } finally {
      setLoading(false)
    }
  }

  const resendCode = async () => {
    setError('')
    setLoadingResend(true)
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_KEY_API_URL}/api/user/forget-password`,
        { email }
      )
      if (response.status === 201) {
        setResendSuccess(true)
        setCounter(60)
      }
    } catch (error) {
      setSuccess(false)
      error instanceof Error && setError(error.message)
      error instanceof AxiosError && setError(error.response?.data.message)
      console.error(error)
    } finally {
      setLoadingResend(false)
    }
  }

  useEffect(() => {
    counter > 0 &&
      setInterval(() => {
        setCounter((prev) => prev - 1)
      }, 1000)
  }, [resendSuccess])

  return (
    <main className="relative flex w-full flex-col items-center !justify-start py-16">
      {loading ? (
        <Spinner className="my-auto !border-black !border-b-transparent dark:!border-white dark:!border-b-transparent" />
      ) : (
        <>
          {successOTP ? (
            <form
              className="relative mx-auto w-full max-w-[35rem] space-y-4 text-start"
              onSubmit={SubmitPassword}
            >
              <Card className="border-none bg-transparent shadow-none">
                <CardHeader className="relative">
                  <h1 className="flex flex-row items-center gap-3 text-[2rem] font-bold text-darkGray dark:text-white">
                    Reset Password
                  </h1>
                  <div>
                    <p className="text-lg text-lightGray">
                      Create a new strong password for your account.
                    </p>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="!my-2 mx-auto w-full space-y-4">
                    <div className="w-full space-y-2">
                      <Label htmlFor="email" className="!text-[1.193rem] font-medium">
                        New Password<span className="text-rose-500">*</span>
                      </Label>
                      <div className="relative">
                        <Input
                          id="password"
                          type={passwordVisible ? 'text' : 'password'}
                          name="password"
                          placeholder="password"
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          className="w-full pr-[3rem] text-md dark:border-neutral-800 dark:bg-neutral-800"
                          min={8}
                          max={20}
                          required
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
                    <div className="space-y-2">
                      <Label htmlFor="email" className="!text-[1.193rem] font-medium">
                        Confirm New Password<span className="text-rose-500">*</span>
                      </Label>
                      <div className="relative">
                        <Input
                          id="confirm-password"
                          type={passwordVisible ? 'text' : 'password'}
                          name="confirm-password"
                          placeholder="confirm-password"
                          min={8}
                          max={20}
                          value={confirmPassword}
                          onChange={(e) => setConfirmPassword(e.target.value)}
                          className="w-full pr-[3rem] text-md dark:border-neutral-800 dark:bg-neutral-800"
                          required
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
                  </div>
                </CardContent>
                <CardFooter className="flex flex-col items-center gap-3">
                  <Button
                    type="submit"
                    className="h-[4rem] w-full !rounded-default bg-black text-md font-bold dark:bg-white"
                  >
                    Reset Password
                  </Button>
                </CardFooter>
              </Card>
            </form>
          ) : (
            <>
              {success ? (
                <form
                  className="relative mx-auto w-full max-w-[35rem] space-y-4 text-start"
                  onSubmit={SubmitOTP}
                >
                  <Card className="border-none bg-transparent shadow-none">
                    <CardHeader className="relative">
                      <h1 className="flex flex-row items-center gap-3 text-[2rem] font-bold text-darkGray dark:text-white">
                        <CircleCheckBig className="mb-0.5 h-8 w-8" />
                        <span>Password Reset Link Sent</span>
                      </h1>
                      <div>
                        <p className="text-lg text-lightGray">
                          We have sent a password reset link to your email.
                        </p>
                        <p className="text-lg text-lightGray">Please check your inbox.</p>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="!my-2 mx-auto flex w-fit flex-col justify-center gap-2">
                        <InputOTP
                          onChange={(e: string) => setOtp(e)}
                          required
                          className="mx-auto bg-blue-200"
                          maxLength={6}
                        >
                          <InputOTPGroup>
                            <InputOTPSlot className="h-16 w-16 text-xl" index={0} />
                            <InputOTPSlot className="h-16 w-16 text-xl" index={1} />
                            <InputOTPSlot className="h-16 w-16 text-xl" index={2} />
                            <InputOTPSlot className="h-16 w-16 text-xl" index={3} />
                            <InputOTPSlot className="h-16 w-16 text-xl" index={4} />
                            <InputOTPSlot className="h-16 w-16 text-xl" index={5} />
                          </InputOTPGroup>
                        </InputOTP>
                        <div
                          className={cn(
                            'flex w-full flex-row items-center justify-center gap-2 text-center text-gray-400',
                            {
                              'pointer-events-none': loadingResend
                            }
                          )}
                        >
                          {counter > 0 ? (
                            <span>Await {counter}s before resend.</span>
                          ) : (
                            <span
                              className="cursor-pointer transition-all hover:underline"
                              onClick={resendCode}
                            >
                              Resend Code
                            </span>
                          )}

                          {loadingResend && (
                            <Spinner className="!h-3 !w-3 !border-gray-400 !border-b-transparent" />
                          )}
                        </div>
                      </div>
                    </CardContent>
                    <CardFooter className="flex flex-col items-center gap-3">
                      <Button
                        type="submit"
                        className="h-[4rem] w-full !rounded-default bg-black text-md font-bold dark:bg-white"
                      >
                        Reset Password
                      </Button>
                    </CardFooter>
                  </Card>
                </form>
              ) : (
                <form className="relative mx-auto w-full max-w-[35rem]" onSubmit={SubmitForm}>
                  <Card className="border-none bg-transparent shadow-none">
                    <CardHeader className="relative">
                      <div className="space-y-2 text-start">
                        <h1 className="text-[3rem] font-bold text-darkGray dark:text-white">
                          Forgot Password
                        </h1>
                        <p className="text-xl text-lightGray">
                          Enter your email below to receive a password reset link.
                        </p>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="email" className="!text-[1.193rem] font-medium">
                          Email<span className="text-rose-500">*</span>
                        </Label>
                        <Input
                          id="email"
                          type="email"
                          name="email"
                          placeholder="m@example.com"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          className="w-full text-md dark:border-neutral-800 dark:bg-neutral-800"
                          required
                        />
                      </div>
                    </CardContent>
                    <CardFooter className="flex flex-col items-center gap-3">
                      <Button
                        type="submit"
                        className="h-[4rem] w-full !rounded-default bg-black text-md font-bold dark:bg-white"
                      >
                        Reset Password
                      </Button>
                    </CardFooter>
                  </Card>
                </form>
              )}
            </>
          )}
        </>
      )}

      {!loading && (
        <a
          className="cursor-pointer text-md font-medium text-black hover:underline"
          onClick={() => navigate('/login')}
        >
          <span>Login Instead?</span>
        </a>
      )}
      {error && (
        <span className="absolute bottom-[5%] left-1/2 mx-auto -translate-x-1/2 text-rose-500">
          {error}
        </span>
      )}
    </main>
  )
}
