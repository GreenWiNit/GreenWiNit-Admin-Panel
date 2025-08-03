import { cn } from '@/lib/utils'
import { Link, useRouterState } from '@tanstack/react-router'
import type { ComponentProps } from 'react'
import { omit } from 'es-toolkit'

const GlobalNavigation = () => {
  const state = useRouterState()

  return (
    <nav className="flex min-w-32 items-center justify-between self-start">
      <NavigationGroup>
        <NavigationItem to="/challenges">챌린지관리</NavigationItem>
        {state.location.pathname.startsWith('/challenges') && (
          <NavigationGroup>
            <NavigationItem to="/challenges/type/individual">&gt; 개인 챌린지</NavigationItem>
            <NavigationItem to="/challenges/type/team">&gt; 팀 챌린지</NavigationItem>
          </NavigationGroup>
        )}
        <NavigationItem to="/posts">정보공유관리</NavigationItem>
      </NavigationGroup>
    </nav>
  )
}

type NavigationItemProps = ComponentProps<typeof Link>
function NavigationItem(props: NavigationItemProps) {
  return (
    <li className={cn('w-full border px-2 py-1 text-left', props.className)}>
      <Link {...omit(props, ['className'])} className="inline-flex w-full" />
    </li>
  )
}

type NavigationGroupProps = ComponentProps<'ul'>
function NavigationGroup(props: NavigationGroupProps) {
  return <ul {...props} className={cn('flex w-full flex-col border', props.className)} />
}

export default GlobalNavigation
