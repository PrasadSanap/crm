'use client'

import * as React from 'react'
import {
  BarChart3Icon,
  CheckIcon,
  ChevronsUpDownIcon,
  CreditCardIcon,
  GitBranchIcon,
  LayoutDashboardIcon,
  LogOutIcon,
  PlusIcon,
  SettingsIcon,
  ShieldCheckIcon,
  UsersIcon,
  WavesIcon,
} from 'lucide-react'

import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuBadge,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
  SidebarSeparator,
} from '@/components/ui/sidebar'
import { tenants } from '@/lib/crm-data'

const nav = [
  { title: 'Dashboard', icon: LayoutDashboardIcon, badge: null },
  { title: 'Leads', icon: UsersIcon, badge: '147' },
  { title: 'Pipelines', icon: GitBranchIcon, badge: null },
  { title: 'Analytics', icon: BarChart3Icon, badge: null },
  { title: 'Team', icon: ShieldCheckIcon, badge: '5' },
  { title: 'Billing', icon: CreditCardIcon, badge: null },
]

export function AppSidebar() {
  const [active, setActive] = React.useState('Dashboard')
  const [tenant, setTenant] = React.useState(tenants[0])

  return (
    <Sidebar collapsible="icon">
      <SidebarHeader className="gap-2 p-2">
        <DropdownMenu>
          <DropdownMenuTrigger
            render={
              <SidebarMenuButton
                size="lg"
                className="group/tenant transition-colors data-[popup-open]:bg-sidebar-accent data-[popup-open]:text-sidebar-accent-foreground"
              />
            }
          >
            <div className="flex aspect-square size-8 shrink-0 items-center justify-center rounded-md bg-primary text-primary-foreground">
              <WavesIcon className="size-4" />
            </div>
            <div className="grid flex-1 text-left leading-tight">
              <span className="truncate text-sm font-semibold">
                {tenant.name}
              </span>
              <span className="truncate text-xs text-muted-foreground">
                {tenant.plan} workspace
              </span>
            </div>
            <ChevronsUpDownIcon className="ml-auto size-4 text-muted-foreground transition-transform group-hover/tenant:translate-y-px" />
          </DropdownMenuTrigger>
          <DropdownMenuContent
            align="start"
            side="bottom"
            sideOffset={6}
            className="w-(--anchor-width) min-w-56"
          >
            <DropdownMenuGroup>
              <DropdownMenuLabel className="text-xs text-muted-foreground">
                Workspaces
              </DropdownMenuLabel>
              {tenants.map((t) => (
                <DropdownMenuItem key={t.id} onClick={() => setTenant(t)}>
                  <div className="flex size-6 items-center justify-center rounded border bg-muted text-[10px] font-semibold">
                    {t.initials}
                  </div>
                  <span className="flex-1 truncate">{t.name}</span>
                  {t.id === tenant.id ? (
                    <CheckIcon className="size-4 text-primary" />
                  ) : null}
                </DropdownMenuItem>
              ))}
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
            <DropdownMenuGroup>
              <DropdownMenuItem>
                <PlusIcon className="size-4" />
                Create workspace
              </DropdownMenuItem>
            </DropdownMenuGroup>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Workspace</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {nav.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton
                    isActive={active === item.title}
                    tooltip={item.title}
                    onClick={() => setActive(item.title)}
                    className="transition-colors"
                  >
                    <item.icon />
                    <span>{item.title}</span>
                  </SidebarMenuButton>
                  {item.badge ? (
                    <SidebarMenuBadge>{item.badge}</SidebarMenuBadge>
                  ) : null}
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup className="group-data-[collapsible=icon]:hidden">
          <SidebarGroupLabel>Plan usage</SidebarGroupLabel>
          <SidebarGroupContent>
            <div className="mx-2 flex flex-col gap-2 rounded-lg border bg-card p-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-medium">Seats</span>
                <span className="tabular text-xs text-muted-foreground">
                  5 / 25
                </span>
              </div>
              <div
                className="h-1.5 w-full overflow-hidden rounded-full bg-muted"
                role="img"
                aria-label="5 of 25 seats used"
              >
                <div className="h-full w-1/5 rounded-full bg-primary" />
              </div>
              <Button size="sm" variant="outline" className="mt-1 w-full">
                Upgrade plan
              </Button>
            </div>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="p-2">
        <SidebarSeparator className="mx-0 mb-1" />
        <SidebarMenu>
          <SidebarMenuItem>
            <DropdownMenu>
              <DropdownMenuTrigger
                render={
                  <SidebarMenuButton
                    size="lg"
                    className="data-[popup-open]:bg-sidebar-accent data-[popup-open]:text-sidebar-accent-foreground"
                  />
                }
              >
                <Avatar className="size-8 rounded-md">
                  <AvatarFallback className="rounded-md bg-accent text-xs font-semibold text-accent-foreground">
                    SC
                  </AvatarFallback>
                </Avatar>
                <div className="grid flex-1 text-left leading-tight">
                  <span className="truncate text-sm font-medium">
                    Sarah Chen
                  </span>
                  <span className="truncate text-xs text-muted-foreground">
                    sarah@acme.com
                  </span>
                </div>
                <Badge variant="outline" className="ml-auto">
                  Admin
                </Badge>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                align="end"
                side="top"
                sideOffset={8}
                className="w-56"
              >
                <DropdownMenuGroup>
                  <DropdownMenuLabel className="text-xs text-muted-foreground">
                    Signed in as Sarah Chen
                  </DropdownMenuLabel>
                  <DropdownMenuItem>
                    <SettingsIcon className="size-4" />
                    Account settings
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <ShieldCheckIcon className="size-4" />
                    Roles &amp; permissions
                  </DropdownMenuItem>
                </DropdownMenuGroup>
                <DropdownMenuSeparator />
                <DropdownMenuGroup>
                  <DropdownMenuItem variant="destructive">
                    <LogOutIcon className="size-4" />
                    Log out
                  </DropdownMenuItem>
                </DropdownMenuGroup>
              </DropdownMenuContent>
            </DropdownMenu>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>

      <SidebarRail />
    </Sidebar>
  )
}
