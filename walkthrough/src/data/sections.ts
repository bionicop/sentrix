export interface Metric { label: string; value: string; highlight?: boolean; }

export interface SectionData {
  num: string;
  title: string;
  shortTitle: string;
  desc: string;
  clip: string;
  category: string;
  categoryColor: string;
  clipFrames: number;
  metrics: Metric[];
}

const C = {
  ops:    '#0f62fe',
  infra:  '#6929c4',
  ai:     '#009d9a',
  config: '#f1620a',
  admin:  '#da1e28',
};

export const SECTIONS: SectionData[] = [
  { num:'01', title:'Login', shortTitle:'Login', category:'Operations', categoryColor: C.ops,
    desc: 'Secure JWT authentication with email/password. Supports Google OAuth, session management, and role-based access across 5 user roles.',
    clip:'clips/01-login.mp4', clipFrames: 180,
    metrics:[
      {label:'JWT & OAuth Login', highlight:true, value:'2'},
      {label:'Auto-Expiring Sessions', value:'24h'},
      {label:'5-Tier Role Access', value:'5'},
    ]},

  { num:'02', title:'Dashboard', shortTitle:'Dashboard', category:'Operations', categoryColor: C.ops,
    desc: 'Command centre view — live KPI cards, active alert counts, ticket backlog, and top-interfaces widget. Everything a NOC operator needs at a glance.',
    clip:'clips/02-dashboard.mp4', clipFrames: 270,
    metrics:[
      {label:'Live Alert Feed', highlight:true, value:'47'},
      {label:'Ticket Backlog', value:'12'},
      {label:'Real-time KPIs', value:'live'},
      {label:'Top Interfaces Widget', value:'top'},
    ]},

  { num:'03', title:'Priority Alerts', shortTitle:'Alerts', category:'Operations', categoryColor: C.ops,
    desc: 'Filterable, sortable alert table with severity colour coding, time-range selectors, and bulk CSV export. Cuts MTTA with intelligent prioritisation.',
    clip:'clips/03-priority-alerts.mp4', clipFrames: 240,
    metrics:[
      {label:'Colour-Coded Severity', highlight:true, value:'8'},
      {label:'Time-Range Filters', value:'range'},
      {label:'Bulk CSV Export', value:'CSV'},
    ]},

  { num:'04', title:'Alert Details', shortTitle:'Alert Details', category:'Operations', categoryColor: C.ops,
    desc: 'Full alert context — source device, severity timeline, linked tickets, AI-generated root cause summary, and one-click resolve action.',
    clip:'clips/04-alert-details.mp4', clipFrames: 180,
    metrics:[
      {label:'Full Alert Context', highlight:true, value:'all'},
      {label:'AI Root Cause Analysis', value:'94%'},
      {label:'One-Click Resolve', value:'1'},
    ]},

  { num:'05', title:'Tickets', shortTitle:'Tickets', category:'Operations', categoryColor: C.ops,
    desc: 'Full CRUD incident management with priority, status, assignee, and device linkage. Filterable table with real-time assignee population from the users API.',
    clip:'clips/05-tickets.mp4', clipFrames: 240,
    metrics:[
      {label:'Incident Management', highlight:true, value:'12'},
      {label:'Live Assignee Lookup', value:'live'},
      {label:'Priority & Status Tracking', value:'full'},
    ]},

  { num:'06', title:'Ticket Details', shortTitle:'Ticket Details', category:'Operations', categoryColor: C.ops,
    desc: 'Threaded comment system, activity log, status transitions, and linked alert/device context — everything needed to drive an incident to resolution.',
    clip:'clips/06-ticket-details.mp4', clipFrames: 180,
    metrics:[
      {label:'Threaded Comments', highlight:true, value:'8'},
      {label:'Status Workflow', value:'flow'},
      {label:'Linked Alert Context', value:'linked'},
    ]},

  { num:'07', title:'On-Call Schedule', shortTitle:'On-Call', category:'Operations', categoryColor: C.ops,
    desc: 'Live on-call card with current engineer, weekly schedule grid, and override management — so every alert always has an owner.',
    clip:'clips/07-on-call-schedule.mp4', clipFrames: 180,
    metrics:[
      {label:'Always-On Engineer Coverage', highlight:true, value:'1'},
      {label:'Weekly Rotation Schedule', value:'5'},
      {label:'Override Management', value:'flex'},
    ]},

  { num:'08', title:'Service Status', shortTitle:'Svc Status', category:'Operations', categoryColor: C.ops,
    desc: 'Real Docker container health monitoring with live log streaming, uptime bars, and last-incident tracking for every platform service.',
    clip:'clips/08-service-status.mp4', clipFrames: 180,
    metrics:[
      {label:'Docker Health Monitoring', highlight:true, value:'11'},
      {label:'Live Log Streaming', value:'live'},
      {label:'Per-Service Uptime', value:'99.8%'},
    ]},

  { num:'09', title:'Devices', shortTitle:'Devices', category:'Infrastructure', categoryColor: C.infra,
    desc: 'Complete network device inventory with type, status, location, and health indicators. Paginated DataTable with search and filter capabilities.',
    clip:'clips/09-devices.mp4', clipFrames: 210,
    metrics:[
      {label:'Full Device Inventory', highlight:true, value:'124'},
      {label:'Health & Location Status', value:'live'},
      {label:'Search & Filter', value:'instant'},
    ]},

  { num:'10', title:'Device Details', shortTitle:'Device Details', category:'Infrastructure', categoryColor: C.infra,
    desc: 'Real-time CPU, memory, bandwidth, and latency charts with configurable time windows (1h / 24h / 7d / 30d) powered by the live metrics API.',
    clip:'clips/10-device-details.mp4', clipFrames: 180,
    metrics:[
      {label:'Live Performance Metrics', highlight:true, value:'4'},
      {label:'1h – 30d History', value:'30d'},
      {label:'Proactive Degradation Alerts', value:'early'},
    ]},

  { num:'11', title:'Network Topology', shortTitle:'Topology', category:'Infrastructure', categoryColor: C.infra,
    desc: 'Force-directed network graph showing device nodes, connection edges, and hop counts. Connections table provides a structured alternative view.',
    clip:'clips/11-network-topology.mp4', clipFrames: 210,
    metrics:[
      {label:'Interactive Network Graph', highlight:true, value:'18'},
      {label:'Hop-Count Path Analysis', value:'3.2'},
      {label:'Connections Table View', value:'table'},
    ]},

  { num:'12', title:'Device Groups', shortTitle:'Device Groups', category:'Infrastructure', categoryColor: C.infra,
    desc: 'Colour-coded logical grouping of devices (Core Network, DMZ, Edge, Wireless, Data Centre) with full CRUD and device multi-select assignment.',
    clip:'clips/12-device-groups.mp4', clipFrames: 150,
    metrics:[
      {label:'Logical Device Grouping', highlight:true, value:'5'},
      {label:'Colour-Coded Zones', value:'visual'},
      {label:'Multi-Select Assignment', value:'bulk'},
    ]},

  { num:'13', title:'Trends & Insights', shortTitle:'Trends', category:'Analytics', categoryColor: C.ai,
    desc: 'AI-driven trend charts — alert volume over time, peak/quietest hours, average resolution time, and top-N interfaces by utilisation.',
    clip:'clips/13-trends-insights.mp4', clipFrames: 240,
    metrics:[
      {label:'AI-Generated Insights', highlight:true, value:'6'},
      {label:'30-Day Alert Trends', value:'30d'},
      {label:'Peak Hour Detection', value:'14:00'},
    ]},

  { num:'14', title:'Incident History', shortTitle:'Incidents', category:'Analytics', categoryColor: C.ai,
    desc: 'Expandable resolved-incident log with MTTR calculation, severity breakdown charts, and per-incident root cause and prevention actions.',
    clip:'clips/14-incident-history.mp4', clipFrames: 180,
    metrics:[
      {label:'Full Incident History', highlight:true, value:'347'},
      {label:'Automatic MTTR Calculation', value:'38m'},
      {label:'SLA Compliance Tracking', value:'94.2%'},
    ]},

  { num:'15', title:'Post-Mortems', shortTitle:'Post-Mortems', category:'Analytics', categoryColor: C.ai,
    desc: 'Structured post-mortem workspace with root cause, contributing factors, impact summary, timeline, and tracked prevention action items.',
    clip:'clips/15-post-mortems.mp4', clipFrames: 150,
    metrics:[
      {label:'Structured Post-Mortem Reports', highlight:true, value:'28'},
      {label:'Root Cause & Impact', value:'full'},
      {label:'Tracked Action Items', value:'7'},
    ]},

  { num:'16', title:'SLA Reports', shortTitle:'SLA', category:'Analytics', categoryColor: C.ai,
    desc: 'Real-time SLA compliance donut, monthly trend line, and violations table — with configurable 99% target thresholds and breach notifications.',
    clip:'clips/16-sla-reports.mp4', clipFrames: 180,
    metrics:[
      {label:'Real-time SLA Compliance', highlight:true, value:'96.3%'},
      {label:'Monthly Trend Line', value:'up'},
      {label:'Violations Breakdown', value:'4'},
    ]},

  { num:'17', title:'Reports Hub', shortTitle:'Reports', category:'Analytics', categoryColor: C.ai,
    desc: 'On-demand report generation for Alerts, Tickets, SLA, Incidents, and Device Health — with download tracking and CSV export.',
    clip:'clips/17-reports-hub.mp4', clipFrames: 180,
    metrics:[
      {label:'On-Demand Report Generation', highlight:true, value:'5'},
      {label:'Instant CSV Export', value:'CSV'},
      {label:'Download Audit Trail', value:'logged'},
    ]},

  { num:'18', title:'Alert Configuration', shortTitle:'Config', category:'Configuration', categoryColor: C.config,
    desc: 'Define threshold rules per metric, configure Slack/email/webhook notification channels, set escalation policies and maintenance windows.',
    clip:'clips/18-alert-configuration.mp4', clipFrames: 210,
    metrics:[
      {label:'Threshold Alert Rules', highlight:true, value:'34'},
      {label:'Slack, Email & Webhooks', value:'8'},
      {label:'Maintenance Windows', value:'quiet'},
    ]},

  { num:'19', title:'Runbooks', shortTitle:'Runbooks', category:'Configuration', categoryColor: C.config,
    desc: 'Structured response playbooks with step-by-step procedures, category tags, RBAC-controlled authoring, and full-text search.',
    clip:'clips/19-runbooks.mp4', clipFrames: 210,
    metrics:[
      {label:'Step-by-Step Playbooks', highlight:true, value:'10'},
      {label:'Full-Text Search', value:'instant'},
      {label:'RBAC-Controlled Authoring', value:'governed'},
    ]},

  { num:'20', title:'Audit Log', shortTitle:'Audit Log', category:'Administration', categoryColor: C.admin,
    desc: 'Immutable audit trail of every user action — resource, action type, IP, timestamp. Filterable and paginated; sysadmin-only access.',
    clip:'clips/20-audit-log.mp4', clipFrames: 150,
    metrics:[
      {label:'Immutable Audit Trail', highlight:true, value:'12.4K'},
      {label:'Sysadmin-Only Access', value:'protected'},
      {label:'365-Day Retention', value:'1yr'},
    ]},

  { num:'21', title:'Settings', shortTitle:'Settings', category:'Administration', categoryColor: C.admin,
    desc: 'Global platform toggles — Maintenance Mode, Auto-resolve, AI Correlation, Auto-refresh — persisted via the global-settings API with in-memory sync.',
    clip:'clips/21-settings.mp4', clipFrames: 150,
    metrics:[
      {label:'Global Platform Toggles', highlight:true, value:'4'},
      {label:'Maintenance Mode', value:'quiet'},
      {label:'API-Backed & Persistent', value:'durable'},
    ]},

  { num:'22', title:'Profile', shortTitle:'Profile', category:'Administration', categoryColor: C.admin,
    desc: 'User identity management — display name, email, role badge, password change with current-password verification, and account security settings.',
    clip:'clips/22-profile.mp4', clipFrames: 150,
    metrics:[
      {label:'Self-Service Profile', highlight:true, value:'self'},
      {label:'Verified Password Change', value:'secure'},
      {label:'Role Badge & Permissions', value:'role'},
    ]},
];
