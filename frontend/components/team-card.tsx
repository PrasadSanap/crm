'use client'

import {
  EyeIcon,
  MoreHorizontalIcon,
  ShieldIcon,
  UserIcon,
  UserPlusIcon,
} from 'lucide-react'

import { Avatar, AvatarBadge, AvatarFallback } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip'
import { cn } from '@/lib/utils'
import { team, type Member, type Role } from '@/lib/crm-data'

const roleMeta: Record<
  Role,
  { icon: typeof ShieldIcon; className: string; scope: string }
> = {
  Admin: {
    icon: ShieldIcon,
    className: 'border-transparent bg-accent text-accent-foreground',
    scope: 'Full access · billing, members, all pipelines',
  },
  Member: {
    icon: UserIcon,
    className: 'border-border text-foreground',
    scope: 'Read & write on assigned pipelines',
  },
  Viewer: {
    icon: EyeIcon,
    className: 'border-border text-muted-foreground',
    scope: 'Read-only · cannot edit deals',
  },
}

const statusDot: Record<Member['status'], string> = {
  Active: 'bg-success',
  Away: 'bg-warning',
  Invited: 'bg-muted-foreground',
}

export function TeamCard() {
  return (
    <Card className="gap-0 py-0">
      <CardHeader className="items-start gap-1 border-b px-5 py-4">
        <CardTitle className="text-base">Team members</CardTitle>
        <CardDescription>
          Role-based access for Acme Corp workspace
        </CardDescription>
        <CardAction>
          <Button variant="outline" size="sm">
            <UserPlusIcon data-icon="inline-start" />
            Invite
          </Button>
        </CardAction>
      </CardHeader>

      <CardContent className="flex flex-col gap-1 px-2 py-2">
        {team.map((m) => {
          const meta = roleMeta[m.role]
          const RoleIcon = meta.icon
          return (
            <div
              key={m.id}
              className="group flex items-center gap-3 rounded-lg px-3 py-2.5 transition-colors hover:bg-muted/60"
            >
              <Avatar className="size-9">
                <AvatarFallback className="bg-muted text-xs font-semibold">
                  {m.initials}
                </AvatarFallback>
                <AvatarBadge
                  className={cn('size-2.5 border-2 border-card', statusDot[m.status])}
                >
                  <span className="sr-only">{m.status}</span>
                </AvatarBadge>
              </Avatar>

              <div className="flex min-w-0 flex-1 flex-col">
                <span className="truncate text-sm font-medium">{m.name}</span>
                <span className="truncate text-xs text-muted-foreground">
                  {m.status === 'Invited'
                    ? 'Invitation pending'
                    : `${m.deals} active deals`}
                </span>
              </div>

              <Tooltip>
                <TooltipTrigger
                  render={
                    <Badge
                      variant="outline"
                      className={cn('gap-1 cursor-default', meta.className)}
                    />
                  }
                >
                  <RoleIcon />
                  {m.role}
                </TooltipTrigger>
                <TooltipContent>{meta.scope}</TooltipContent>
              </Tooltip>

              <DropdownMenu>
                <DropdownMenuTrigger
                  render={
                    <Button
                      variant="ghost"
                      size="icon-sm"
                      className="opacity-0 transition-opacity group-hover:opacity-100 focus-visible:opacity-100 data-[popup-open]:opacity-100"
                    />
                  }
                >
                  <MoreHorizontalIcon />
                  <span className="sr-only">Manage {m.name}</span>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-44">
                  <DropdownMenuGroup>
                    <DropdownMenuLabel className="text-xs text-muted-foreground">
                      Change role
                    </DropdownMenuLabel>
                    <DropdownMenuItem>Admin</DropdownMenuItem>
                    <DropdownMenuItem>Member</DropdownMenuItem>
                    <DropdownMenuItem>Viewer</DropdownMenuItem>
                  </DropdownMenuGroup>
                  <DropdownMenuSeparator />
                  <DropdownMenuGroup>
                    <DropdownMenuItem variant="destructive">
                      Remove from workspace
                    </DropdownMenuItem>
                  </DropdownMenuGroup>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          )
        })}
      </CardContent>

      <CardFooter className="border-t px-5 py-3">
        <p className="text-xs text-pretty text-muted-foreground">
          Roles are enforced per tenant. Viewers never see billing or contract
          values.
        </p>
      </CardFooter>
    </Card>
  )
}
