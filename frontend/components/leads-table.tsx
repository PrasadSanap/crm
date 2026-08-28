'use client'

import * as React from 'react'
import {
  ArrowUpDownIcon,
  CheckIcon,
  ListFilterIcon,
  MoreHorizontalIcon,
  PlusIcon,
  SearchIcon,
} from 'lucide-react'

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
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from '@/components/ui/input-group'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { cn } from '@/lib/utils'
import {
  currency,
  leads,
  relativeDate,
  type DealStage,
} from '@/lib/crm-data'

const stageStyles: Record<DealStage, string> = {
  Discovery: 'border-border bg-muted text-muted-foreground',
  Proposal: 'border-transparent bg-chart-4/20 text-chart-2',
  Negotiation: 'border-transparent bg-warning/15 text-warning',
  Won: 'border-transparent bg-success/15 text-success',
  Lost: 'border-transparent bg-destructive/10 text-destructive',
}

const allStages: DealStage[] = [
  'Discovery',
  'Proposal',
  'Negotiation',
  'Won',
  'Lost',
]

function StageBadge({ stage }: { stage: DealStage }) {
  return (
    <Badge variant="outline" className={cn('gap-1.5', stageStyles[stage])}>
      <span
        className={cn(
          'size-1.5 rounded-full',
          stage === 'Discovery' && 'bg-muted-foreground',
          stage === 'Proposal' && 'bg-chart-2',
          stage === 'Negotiation' && 'bg-warning',
          stage === 'Won' && 'bg-success',
          stage === 'Lost' && 'bg-destructive',
        )}
        aria-hidden
      />
      {stage}
    </Badge>
  )
}

export function LeadsTable() {
  const [query, setQuery] = React.useState('')
  const [stages, setStages] = React.useState<DealStage[]>([])
  const [sortDesc, setSortDesc] = React.useState(true)

  const toggleStage = (s: DealStage) =>
    setStages((prev) =>
      prev.includes(s) ? prev.filter((x) => x !== s) : [...prev, s],
    )

  const rows = React.useMemo(() => {
    const q = query.trim().toLowerCase()
    return leads
      .filter((l) => (stages.length ? stages.includes(l.stage) : true))
      .filter((l) =>
        q
          ? l.company.toLowerCase().includes(q) ||
            l.contact.toLowerCase().includes(q) ||
            l.owner.toLowerCase().includes(q)
          : true,
      )
      .sort((a, b) => (sortDesc ? b.value - a.value : a.value - b.value))
  }, [query, stages, sortDesc])

  const total = rows.reduce((sum, l) => sum + l.value, 0)

  return (
    <Card className="gap-0 overflow-hidden py-0">
      <CardHeader className="flex-col items-stretch gap-4 border-b px-5 py-4 lg:flex-row lg:items-center">
        <div className="flex flex-col gap-0.5">
          <CardTitle className="text-base">Lead management</CardTitle>
          <CardDescription>
            {rows.length} of {leads.length} leads ·{' '}
            <span className="tabular font-medium text-foreground">
              {currency(total)}
            </span>{' '}
            open value
          </CardDescription>
        </div>
        <CardAction className="flex w-full flex-col gap-2 sm:flex-row sm:items-center lg:w-auto">
          <InputGroup className="sm:w-64">
            <InputGroupAddon>
              <SearchIcon />
            </InputGroupAddon>
            <InputGroupInput
              placeholder="Search company, contact…"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              aria-label="Search leads"
            />
          </InputGroup>

          <DropdownMenu>
            <DropdownMenuTrigger render={<Button variant="outline" />}>
              <ListFilterIcon data-icon="inline-start" />
              Filter
              {stages.length ? (
                <Badge variant="secondary" className="ml-1">
                  {stages.length}
                </Badge>
              ) : null}
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48">
              <DropdownMenuGroup>
                <DropdownMenuLabel className="text-xs text-muted-foreground">
                  Deal stage
                </DropdownMenuLabel>
                {allStages.map((s) => (
                  <DropdownMenuItem
                    key={s}
                    closeOnClick={false}
                    onClick={() => toggleStage(s)}
                  >
                    <span className="flex-1">{s}</span>
                    {stages.includes(s) ? (
                      <CheckIcon className="size-4 text-primary" />
                    ) : null}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuGroup>
              <DropdownMenuSeparator />
              <DropdownMenuGroup>
                <DropdownMenuItem onClick={() => setStages([])}>
                  Clear filters
                </DropdownMenuItem>
              </DropdownMenuGroup>
            </DropdownMenuContent>
          </DropdownMenu>

          <Button>
            <PlusIcon data-icon="inline-start" />
            Add new lead
          </Button>
        </CardAction>
      </CardHeader>

      <CardContent className="px-0">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="hover:bg-transparent">
                <TableHead className="pl-5">Company</TableHead>
                <TableHead>Contact person</TableHead>
                <TableHead>Deal stage</TableHead>
                <TableHead className="text-right">
                  <button
                    type="button"
                    onClick={() => setSortDesc((v) => !v)}
                    className="inline-flex items-center gap-1 rounded transition-colors hover:text-foreground focus-visible:ring-[3px] focus-visible:ring-ring/50 focus-visible:outline-none"
                  >
                    Deal value
                    <ArrowUpDownIcon className="size-3.5" aria-hidden />
                    <span className="sr-only">
                      Sort by deal value, currently{' '}
                      {sortDesc ? 'descending' : 'ascending'}
                    </span>
                  </button>
                </TableHead>
                <TableHead>Last contacted</TableHead>
                <TableHead className="w-10 pr-5" />
              </TableRow>
            </TableHeader>
            <TableBody>
              {rows.map((lead) => (
                <TableRow key={lead.id} className="group transition-colors">
                  <TableCell className="pl-5">
                    <div className="flex items-center gap-3">
                      <div className="flex size-8 shrink-0 items-center justify-center rounded-md border bg-muted text-[11px] font-semibold text-muted-foreground transition-colors group-hover:border-primary/30 group-hover:bg-accent group-hover:text-accent-foreground">
                        {lead.company.slice(0, 2).toUpperCase()}
                      </div>
                      <div className="flex flex-col">
                        <span className="font-medium">{lead.company}</span>
                        <span className="text-xs text-muted-foreground">
                          {lead.domain}
                        </span>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-col">
                      <span>{lead.contact}</span>
                      <span className="text-xs text-muted-foreground">
                        {lead.title}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <StageBadge stage={lead.stage} />
                  </TableCell>
                  <TableCell className="tabular text-right font-medium">
                    {currency(lead.value)}
                  </TableCell>
                  <TableCell className="text-muted-foreground">
                    {relativeDate(lead.lastContacted)}
                  </TableCell>
                  <TableCell className="pr-5">
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
                        <span className="sr-only">
                          Actions for {lead.company}
                        </span>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="w-44">
                        <DropdownMenuGroup>
                          <DropdownMenuItem>View lead</DropdownMenuItem>
                          <DropdownMenuItem>Log activity</DropdownMenuItem>
                          <DropdownMenuItem>Change owner</DropdownMenuItem>
                        </DropdownMenuGroup>
                        <DropdownMenuSeparator />
                        <DropdownMenuGroup>
                          <DropdownMenuItem variant="destructive">
                            Archive
                          </DropdownMenuItem>
                        </DropdownMenuGroup>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>

      <CardFooter className="justify-between border-t px-5 py-3">
        <p className="text-xs text-muted-foreground">
          Showing {rows.length} results
        </p>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" disabled>
            Previous
          </Button>
          <Button variant="outline" size="sm">
            Next
          </Button>
        </div>
      </CardFooter>
    </Card>
  )
}
