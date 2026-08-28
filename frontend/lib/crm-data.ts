export type DealStage = 'Discovery' | 'Proposal' | 'Negotiation' | 'Won' | 'Lost'

export type Lead = {
  id: string
  company: string
  domain: string
  contact: string
  title: string
  email: string
  stage: DealStage
  value: number
  lastContacted: string
  owner: string
}

export type Tenant = {
  id: string
  name: string
  plan: string
  initials: string
}

export const tenants: Tenant[] = [
  { id: 'acme', name: 'Acme Corp', plan: 'Enterprise', initials: 'AC' },
  { id: 'globex', name: 'Globex Inc', plan: 'Growth', initials: 'GI' },
  { id: 'initech', name: 'Initech', plan: 'Starter', initials: 'IN' },
]

export const leads: Lead[] = [
  {
    id: 'LD-4821',
    company: 'Northwind Logistics',
    domain: 'northwind.io',
    contact: 'Priya Raman',
    title: 'VP Operations',
    email: 'priya@northwind.io',
    stage: 'Negotiation',
    value: 184000,
    lastContacted: '2026-08-26',
    owner: 'Sarah Chen',
  },
  {
    id: 'LD-4817',
    company: 'Vertex Analytics',
    domain: 'vertexanalytics.com',
    contact: 'Marcus Webb',
    title: 'Head of Data',
    email: 'm.webb@vertexanalytics.com',
    stage: 'Proposal',
    value: 96500,
    lastContacted: '2026-08-25',
    owner: 'Diego Alvarez',
  },
  {
    id: 'LD-4809',
    company: 'Helios Energy',
    domain: 'helios-energy.eu',
    contact: 'Anna Kowalski',
    title: 'Director of IT',
    email: 'a.kowalski@helios-energy.eu',
    stage: 'Won',
    value: 312000,
    lastContacted: '2026-08-24',
    owner: 'Sarah Chen',
  },
  {
    id: 'LD-4804',
    company: 'Britewave Health',
    domain: 'britewave.health',
    contact: 'Dr. Omar Haddad',
    title: 'CTO',
    email: 'omar@britewave.health',
    stage: 'Discovery',
    value: 47250,
    lastContacted: '2026-08-22',
    owner: 'Jenna Park',
  },
  {
    id: 'LD-4798',
    company: 'Cobalt Manufacturing',
    domain: 'cobaltmfg.com',
    contact: 'Rachel Nguyen',
    title: 'COO',
    email: 'rachel@cobaltmfg.com',
    stage: 'Negotiation',
    value: 228750,
    lastContacted: '2026-08-21',
    owner: 'Diego Alvarez',
  },
  {
    id: 'LD-4791',
    company: 'Lumen Retail Group',
    domain: 'lumenretail.co',
    contact: 'Tom Iverson',
    title: 'Digital Lead',
    email: 'tom.i@lumenretail.co',
    stage: 'Proposal',
    value: 73400,
    lastContacted: '2026-08-19',
    owner: 'Jenna Park',
  },
  {
    id: 'LD-4783',
    company: 'Sable Financial',
    domain: 'sablefinancial.com',
    contact: 'Yuki Tanaka',
    title: 'Head of Risk',
    email: 'y.tanaka@sablefinancial.com',
    stage: 'Discovery',
    value: 158000,
    lastContacted: '2026-08-18',
    owner: 'Sarah Chen',
  },
  {
    id: 'LD-4776',
    company: 'Orbital Freight',
    domain: 'orbitalfreight.net',
    contact: 'Kwame Mensah',
    title: 'VP Engineering',
    email: 'kwame@orbitalfreight.net',
    stage: 'Won',
    value: 89900,
    lastContacted: '2026-08-15',
    owner: 'Leo Fischer',
  },
  {
    id: 'LD-4770',
    company: 'Pinecrest Education',
    domain: 'pinecrest.edu',
    contact: 'Marie Dubois',
    title: 'Procurement Manager',
    email: 'm.dubois@pinecrest.edu',
    stage: 'Lost',
    value: 34500,
    lastContacted: '2026-08-11',
    owner: 'Leo Fischer',
  },
  {
    id: 'LD-4762',
    company: 'Fathom Media',
    domain: 'fathommedia.tv',
    contact: 'Chris Bello',
    title: 'CIO',
    email: 'chris@fathommedia.tv',
    stage: 'Proposal',
    value: 121300,
    lastContacted: '2026-08-09',
    owner: 'Jenna Park',
  },
]

export type Metric = {
  label: string
  value: string
  delta: number
  caption: string
  series: { i: number; v: number }[]
}

const spark = (values: number[]) => values.map((v, i) => ({ i, v }))

export const metrics: Metric[] = [
  {
    label: 'Total Revenue',
    value: '$1.42M',
    delta: 12.4,
    caption: 'vs. $1.26M last quarter',
    series: spark([48, 52, 49, 61, 58, 67, 72, 69, 81, 86, 92, 104]),
  },
  {
    label: 'Monthly Active Users',
    value: '28,431',
    delta: 8.1,
    caption: '2,140 new seats activated',
    series: spark([31, 34, 33, 38, 41, 39, 44, 47, 46, 52, 55, 58]),
  },
  {
    label: 'Conversion Rate',
    value: '24.8%',
    delta: -2.3,
    caption: 'Demo → closed-won',
    series: spark([42, 45, 44, 47, 43, 41, 44, 40, 38, 39, 36, 35]),
  },
  {
    label: 'Open Deals',
    value: '147',
    delta: 5.6,
    caption: '$3.9M weighted pipeline',
    series: spark([22, 24, 23, 27, 29, 28, 31, 33, 32, 36, 38, 40]),
  },
]

export const pipeline = [
  { stage: 'Discovery', deals: 62, value: 1240 },
  { stage: 'Qualified', deals: 44, value: 980 },
  { stage: 'Proposal', deals: 31, value: 742 },
  { stage: 'Negotiation', deals: 18, value: 531 },
  { stage: 'Won', deals: 11, value: 402 },
]

export type Activity = {
  id: string
  actor: string
  initials: string
  action: string
  target: string
  detail: string
  time: string
  kind: 'stage' | 'note' | 'won' | 'call' | 'assign'
}

export const activity: Activity[] = [
  {
    id: 'a1',
    actor: 'Sarah Chen',
    initials: 'SC',
    action: 'moved',
    target: 'Northwind Logistics',
    detail: 'Proposal → Negotiation',
    time: '12m ago',
    kind: 'stage',
  },
  {
    id: 'a2',
    actor: 'Diego Alvarez',
    initials: 'DA',
    action: 'closed',
    target: 'Helios Energy',
    detail: '$312,000 annual contract',
    time: '1h ago',
    kind: 'won',
  },
  {
    id: 'a3',
    actor: 'Jenna Park',
    initials: 'JP',
    action: 'logged a call with',
    target: 'Fathom Media',
    detail: '38 min · security review',
    time: '3h ago',
    kind: 'call',
  },
  {
    id: 'a4',
    actor: 'Leo Fischer',
    initials: 'LF',
    action: 'left a note on',
    target: 'Cobalt Manufacturing',
    detail: 'Legal wants MSA redlines by Friday',
    time: '5h ago',
    kind: 'note',
  },
  {
    id: 'a5',
    actor: 'Sarah Chen',
    initials: 'SC',
    action: 'assigned',
    target: 'Sable Financial',
    detail: 'to Diego Alvarez',
    time: 'Yesterday',
    kind: 'assign',
  },
]

export type Role = 'Admin' | 'Member' | 'Viewer'

export type Member = {
  id: string
  name: string
  email: string
  initials: string
  role: Role
  status: 'Active' | 'Away' | 'Invited'
  deals: number
}

export const team: Member[] = [
  {
    id: 'u1',
    name: 'Sarah Chen',
    email: 'sarah@acme.com',
    initials: 'SC',
    role: 'Admin',
    status: 'Active',
    deals: 34,
  },
  {
    id: 'u2',
    name: 'Diego Alvarez',
    email: 'diego@acme.com',
    initials: 'DA',
    role: 'Member',
    status: 'Active',
    deals: 27,
  },
  {
    id: 'u3',
    name: 'Jenna Park',
    email: 'jenna@acme.com',
    initials: 'JP',
    role: 'Member',
    status: 'Away',
    deals: 21,
  },
  {
    id: 'u4',
    name: 'Leo Fischer',
    email: 'leo@acme.com',
    initials: 'LF',
    role: 'Viewer',
    status: 'Active',
    deals: 9,
  },
  {
    id: 'u5',
    name: 'Amara Osei',
    email: 'amara@acme.com',
    initials: 'AO',
    role: 'Viewer',
    status: 'Invited',
    deals: 0,
  },
]

export const currency = (n: number) =>
  n.toLocaleString('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0,
  })

export const relativeDate = (iso: string) => {
  const then = new Date(`${iso}T12:00:00Z`)
  const now = new Date('2026-08-27T12:00:00Z')
  const days = Math.round((now.getTime() - then.getTime()) / 86_400_000)
  if (days <= 0) return 'Today'
  if (days === 1) return 'Yesterday'
  if (days < 7) return `${days} days ago`
  const weeks = Math.floor(days / 7)
  return weeks === 1 ? '1 week ago' : `${weeks} weeks ago`
}
