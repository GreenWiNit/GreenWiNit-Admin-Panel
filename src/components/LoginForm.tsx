import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { Button as ShadcnButton } from '@/components/shadcn/button'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/shadcn/form'
import { Input } from '@/components/shadcn/input'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/shadcn/card'
import { cn } from '@/lib/utils'
import { authApi } from '@/api/auth'
import { useUserStore } from '@/store/userStore'

const formSchema = z.object({
  username: z.string().min(2, {
    message: '아이디는 2글자 이상입니다.',
  }),
  password: z.string().min(6, {
    message: '비밀번호는 6글자 이상입니다.',
  }),
})

export function LoginForm() {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      username: '',
      password: '',
    },
  })
  const login = useUserStore((state) => state.login)

  const onSubmit = async (data: z.infer<typeof formSchema>) => {
    console.log('로그인 데이터:', data)
    authApi
      .login({ loginId: data.username, password: data.password })
      .then((res) => {
        console.log('로그인 성공:', res)
        login(res)
      })
      .catch((err) => {
        console.error('로그인 실패:', err)
      })
  }

  return (
    <Card className="w-md">
      <CardHeader className="text-left">
        <CardTitle>관리자 로그인</CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <FormField
              control={form.control}
              name="username"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>아이디</FormLabel>
                  <FormControl>
                    <Input placeholder="" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>비밀번호</FormLabel>
                  <FormControl>
                    <Input type="password" placeholder="" {...field} />
                  </FormControl>

                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit">로그인</Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  )
}

function Button({
  className,
  ...props
}: Omit<React.ComponentProps<typeof ShadcnButton>, 'variant'>) {
  return (
    <ShadcnButton
      {...props}
      className={cn(
        'bg-primary text-primary-foreground hover:bg-primary/90 h-auto px-6 py-3 shadow-xs',
        className,
      )}
    />
  )
}
