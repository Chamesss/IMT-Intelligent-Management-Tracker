import { useAuth } from '@/hooks/useAuth'
import useThemeMode from '@/hooks/useTheme'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger
} from '@/ui/alert-dialog'
import { Button } from '@/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/ui/card'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/ui/dialog'
import {
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator
} from '@/ui/dropdown-menu'
import { Switch } from '@/ui/switch'
import { LogOut, Settings, User } from 'lucide-react'
import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'

export default function SettingsProfile({ name }: { name: string }) {
  const navigate = useNavigate()
  const { mode, toggleMode } = useThemeMode()
  const [open, setOpen] = useState(false)
  const { logout } = useAuth()
  //remove pointer event none from html body

  useEffect(() => {
    document.body.style.pointerEvents = ''
    return () => {
      document.body.style.pointerEvents = ''
    }
  }, [setOpen, open])

  return (
    <>
      <DropdownMenuContent align="end" className="w-56 dark:border-neutral-900 dark:bg-black">
        <DropdownMenuLabel className="capitalize">{name}</DropdownMenuLabel>
        <DropdownMenuSeparator className="dark:bg-neutral-800" />
        <DropdownMenuGroup>
          <DropdownMenuItem className="cursor-pointer" onClick={() => navigate('/profile')}>
            <User className="mr-2 h-4 w-4" />
            <span>Profile</span>
          </DropdownMenuItem>
          <DropdownMenuItem className="cursor-pointer" onClick={() => setOpen(true)}>
            <Settings className="mr-2 h-4 w-4" />
            <span>Settings</span>
          </DropdownMenuItem>
        </DropdownMenuGroup>
        <DropdownMenuSeparator className="dark:bg-neutral-800" />
        <DropdownMenuItem className="cursor-pointer" onClick={logout}>
          <LogOut className="mr-2 h-4 w-4" />
          <span>Log out</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="dark:border-neutral-950 dark:bg-black sm:max-w-[550px]">
          <DialogHeader>
            <DialogTitle>Settings</DialogTitle>
            <DialogDescription>Manage your account preferences.</DialogDescription>
          </DialogHeader>
          <div className="grid gap-6">
            <Card className="dark:border-neutral-950 dark:bg-neutral-800">
              <CardHeader>
                <CardTitle>Notifications</CardTitle>
                <CardDescription>Choose what you want to be notified about.</CardDescription>
              </CardHeader>
              <CardContent className="grid gap-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <p className="text-sm font-medium">Email Notifications</p>
                    <p className="text-sm text-muted-foreground">
                      Receive updates and announcements via email.
                    </p>
                  </div>
                  <Switch id="email-notifications" defaultChecked />
                </div>
                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <p className="text-sm font-medium">Push Notifications</p>
                    <p className="text-sm text-muted-foreground">
                      Receive real-time updates on your device.
                    </p>
                  </div>
                  <Switch id="push-notifications" />
                </div>
              </CardContent>
            </Card>
            <Card className="dark:border-neutral-950 dark:bg-neutral-800">
              <CardHeader className="flex flex-row items-center justify-between">
                <div className="space-y-2">
                  <CardTitle className="relative w-fit">
                    Theme{' '}
                    <span className="absolute left-[110%] top-1/2 -translate-y-1/3 text-sm font-normal capitalize text-muted-foreground">
                      {mode}
                    </span>
                  </CardTitle>
                  <CardDescription>Choose the color theme for your dashboard.</CardDescription>
                </div>
                <Switch id="email-notifications" onCheckedChange={toggleMode} />
              </CardHeader>
            </Card>
            <Card className="dark:border-neutral-950 dark:bg-neutral-800">
              <CardHeader>
                <CardTitle>Delete Account</CardTitle>
                <CardDescription>
                  Permanently delete your account and all your data.
                </CardDescription>
              </CardHeader>
              <CardContent className="grid gap-4">
                <p className="text-sm text-muted-foreground">
                  This action cannot be undone. Your account and all your data will be permanently
                  deleted.
                </p>
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button variant="destructive">Delete Account</Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>
                        Are you sure you want to delete your account?
                      </AlertDialogTitle>
                      <AlertDialogDescription>
                        This action cannot be undone. Your account and all your data will be
                        permanently deleted.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                      <AlertDialogAction>Confirm</AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </CardContent>
            </Card>
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}
