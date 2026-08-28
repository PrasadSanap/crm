'use client'

import {
  ArrowRightIcon,
  FileTextIcon,
  PhoneIcon,
  TrophyIcon,
  UserPlusIcon,
} from 'lucide-react'
import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from 'recharts'

import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from '@/components/ui/chart'
import { Separator } from '@/components/ui/separator'
import { cn } from '@/lib/utils'
import { activity, pipeline, type Activity } from '@/lib/crm-data'

const chartConfig = {
  value: { label: 'Pipeline value ($K)', color: 'var(--chart-1)' },
} satisfies ChartConfig

const kindIcon: Record<Activity['kind'], typeof PhoneIcon> = {
  stage: ArrowRightIcon,
  won: TrophyIcon,
  call: PhoneIcon,
  note: FileTextIcon,
  assign: UserPlusIcon,
}

export function PipelinePanel() {
  return (
    <Card className="gap-0 py-0">
      <CardHeader className="items-start gap-1 border-b px-5 py-4">
        <CardTitle className="text-base">Sales pipeline</CardTitle>
        <CardDescription>
          Weighted value by stage · current quarter
        </CardDescription>
        <CardAction>
          <Button variant="ghost" size="sm">
            View report
            <ArrowRightIcon data-icon="inline-end" />
          </Button>
        </CardAction>
      </CardHeader>

      <CardContent className="px-5 py-5">
        <ChartContainer config={chartConfig} className="aspect-auto h-56 w-full">
          <BarChart
            data={pipeline}
            layout="vertical"
            margin={{ left: 0, right: 16, top: 4, bottom: 4 }}
          >
            <CartesianGrid horizontal={false} strokeDasharray="3 3" />
            <XAxis type="number" dataKey="value" domain={[0, 'dataMax']} hide />
            <YAxis
              dataKey="stage"
              type="category"
              tickLine={false}
              axisLine={false}
              width={92}
              tickMargin={4}
            />
            <ChartTooltip
              cursor={false}
              content={
                <ChartTooltipContent
                  formatter={(value) => `$${Number(value).toLocaleString()}K`}
                />
              }
            />
            <Bar
              dataKey="value"
              fill="var(--color-value)"
              radius={[0, 6, 6, 0]}
              barSize={22}
            />
          </BarChart>
        </ChartContainer>
      </CardContent>

      <Separator />

      <CardHeader className="items-start gap-0.5 px-5 py-4">
        <CardTitle className="text-sm">Recent team activity</CardTitle>
      </CardHeader>

      <CardContent className="px-5 pb-5">
        <ol className="relative flex flex-col gap-4 border-l pl-0">
          {activity.map((a) => {
            const Icon = kindIcon[a.kind]
            return (
              <li key={a.id} className="relative flex gap-3 pl-5">
                <span
                  className={cn(
                    'absolute -left-[13px] top-0.5 flex size-6 items-center justify-center rounded-full border bg-card',
                    a.kind === 'won' && 'border-success/40 text-success',
                    a.kind !== 'won' && 'text-muted-foreground',
                  )}
                >
                  <Icon className="size-3" aria-hidden />
                </span>
                <Avatar className="size-7">
                  <AvatarFallback className="bg-muted text-[10px] font-semibold">
                    {a.initials}
                  </AvatarFallback>
                </Avatar>
                <div className="flex min-w-0 flex-1 flex-col gap-0.5">
                  <p className="text-sm leading-snug text-pretty">
                    <span className="font-medium">{a.actor}</span>{' '}
                    <span className="text-muted-foreground">{a.action}</span>{' '}
                    <span className="font-medium">{a.target}</span>
                  </p>
                  <p className="truncate text-xs text-muted-foreground">
                    {a.detail}
                  </p>
                </div>
                <span className="shrink-0 text-xs text-muted-foreground">
                  {a.time}
                </span>
              </li>
            )
          })}
        </ol>
      </CardContent>
    </Card>
  )
}
