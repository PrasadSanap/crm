'use client'

import { TrendingDownIcon, TrendingUpIcon } from 'lucide-react'
import { Area, AreaChart } from 'recharts'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { ChartContainer, type ChartConfig } from '@/components/ui/chart'
import { cn } from '@/lib/utils'
import { metrics } from '@/lib/crm-data'

const upConfig = {
  v: { label: 'Trend', color: 'var(--chart-1)' },
} satisfies ChartConfig

const downConfig = {
  v: { label: 'Trend', color: 'var(--muted-foreground)' },
} satisfies ChartConfig

export function MetricsRow() {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
      {metrics.map((m) => {
        const up = m.delta >= 0
        const Trend = up ? TrendingUpIcon : TrendingDownIcon
        const gradientId = `spark-${m.label.replace(/\s/g, '')}`
        return (
          <Card
            key={m.label}
            className="group gap-0 overflow-hidden py-0 transition-shadow duration-200 hover:shadow-md"
          >
            <CardHeader className="gap-1 px-5 pt-5">
              <CardTitle className="text-xs font-medium tracking-wide text-muted-foreground uppercase">
                {m.label}
              </CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col gap-3 px-0 pb-0">
              <div className="flex items-end justify-between gap-3 px-5">
                <span className="tabular text-3xl leading-none font-semibold">
                  {m.value}
                </span>
                <span
                  className={cn(
                    'inline-flex items-center gap-1 rounded-full px-1.5 py-0.5 text-xs font-medium tabular',
                    up
                      ? 'bg-success/10 text-success'
                      : 'bg-destructive/10 text-destructive',
                  )}
                >
                  <Trend className="size-3" aria-hidden />
                  {up ? '+' : ''}
                  {m.delta}%
                </span>
              </div>
              <p className="px-5 text-xs text-muted-foreground">{m.caption}</p>
              <ChartContainer
                config={up ? upConfig : downConfig}
                className="aspect-auto h-14 w-full"
              >
                <AreaChart
                  data={m.series}
                  margin={{ top: 6, right: 0, bottom: 0, left: 0 }}
                >
                  <defs>
                    <linearGradient
                      id={gradientId}
                      x1="0"
                      y1="0"
                      x2="0"
                      y2="1"
                    >
                      <stop
                        offset="0%"
                        stopColor="var(--color-v)"
                        stopOpacity={0.28}
                      />
                      <stop
                        offset="100%"
                        stopColor="var(--color-v)"
                        stopOpacity={0}
                      />
                    </linearGradient>
                  </defs>
                  <Area
                    type="monotone"
                    dataKey="v"
                    stroke="var(--color-v)"
                    strokeWidth={2}
                    fill={`url(#${gradientId})`}
                    isAnimationActive={false}
                  />
                </AreaChart>
              </ChartContainer>
            </CardContent>
          </Card>
        )
      })}
    </div>
  )
}
