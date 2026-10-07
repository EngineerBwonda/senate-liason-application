"use client";

import { useMemo, useState } from "react";
import {
  Plus,
  Search,
  Filter,
  Briefcase,
  CheckCircle2,
  Clock3,
  XCircle,
  GraduationCap,
  Users,
  MoreHorizontal,
  X,
  Mail,
  Phone,
  Building2,
  User,
  ChevronLeft,
  ChevronRight,
  SearchX,
  TrendingUp,
  FileText,
  Download,
  ListChecks,
  Calendar,
  School,
  Award,
  type LucideIcon,
} from "lucide-react";
import styles from "./styles.module.css";

/* ============================================================
   TYPES
   ============================================================ */

type AttachmentStatus =
  | "Pending"
  | "Approved"
  | "Active"
  | "Completed"
  | "Rejected";

type StatusFilter = "All" | AttachmentStatus;

type SortKey =
  | "date-desc"
  | "date-asc"
  | "name-asc"
  | "name-desc"
  | "progress-desc";

type AttachmentDocument = {
  name: string;
  size: string;
};

type Attachment = {
  id: number;
  code: string;
  studentName: string;
  studentEmail: string;
  studentPhone: string;
  registrationId: string;
  school: string;
  course: string;
  department: string;
  supervisor: string;
  startDate: string;
  endDate: string;
  status: AttachmentStatus;
  progress: number;
  documents: AttachmentDocument[];
  notes: string;
};

type AttachmentCounts = {
  total: number;
  pending: number;
  approved: number;
  active: number;
  completed: number;
  rejected: number;
  avgProgress: number;
  activeForAvg: number;
};

type ActivityType = "started" | "progress" | "approved" | "completed";

type ActivityItem = {
  id: number;
  type: ActivityType;
  text: string;
  time: string;
};

type UpcomingStart = {
  date: string;
  name: string;
  department: string;
};

type EndingSoonItem = UpcomingStart & {
  days: number;
};

type StatCard = {
  key: string;
  label: string;
  value: number | string;
  hint: string;
  icon: LucideIcon;
  tone: string;
  delta?: string;
};

type QuickAction = {
  key: string;
  label: string;
  icon: LucideIcon;
  primary?: boolean;
  onClick: () => void;
};

type RowAction = {
  key: string;
  label: string;
  danger?: boolean;
  onClick: () => void;
};

/* ============================================================
   MOCK DATA
   ============================================================ */

const ATTACHMENTS: Attachment[] = [
  {
    id: 1,
    code: "ATT-2026-001",
    studentName: "John Kamau",
    studentEmail: "john.kamau@example.com",
    studentPhone: "+254 712 000 001",
    registrationId: "INT-2026-001",
    school: "University of Nairobi",
    course: "Political Science",
    department: "Senate Liaison",
    supervisor: "Senior Liaison Officer",
    startDate: "2026-09-01",
    endDate: "2026-11-30",
    status: "Active",
    progress: 62,
    documents: [
      { name: "Attachment Letter.pdf", size: "210 KB" },
      { name: "Insurance Cover.pdf", size: "180 KB" },
    ],
    notes: "Assigned to liaison correspondence desk.",
  },
  {
    id: 2,
    code: "ATT-2026-002",
    studentName: "Mary Wanjiku",
    studentEmail: "mary.wanjiku@example.com",
    studentPhone: "+254 712 000 002",
    registrationId: "INT-2026-002",
    school: "Kenyatta University",
    course: "Information Technology",
    department: "ICT",
    supervisor: "ICT Manager",
    startDate: "2026-09-05",
    endDate: "2026-12-05",
    status: "Pending",
    progress: 0,
    documents: [{ name: "Application Letter.pdf", size: "180 KB" }],
    notes: "Awaiting supervisor confirmation.",
  },
  {
    id: 3,
    code: "ATT-2026-003",
    studentName: "Brian Otieno",
    studentEmail: "brian.otieno@example.com",
    studentPhone: "+254 712 000 003",
    registrationId: "INT-2026-003",
    school: "Maseno University",
    course: "Political Science",
    department: "Research",
    supervisor: "Head of Research",
    startDate: "2026-08-01",
    endDate: "2026-10-31",
    status: "Active",
    progress: 78,
    documents: [
      { name: "Attachment Letter.pdf", size: "190 KB" },
      { name: "Progress Report.pdf", size: "220 KB" },
    ],
    notes: "Currently on the research desk.",
  },
  {
    id: 4,
    code: "ATT-2026-004",
    studentName: "Grace Achieng",
    studentEmail: "grace.achieng@example.com",
    studentPhone: "+254 712 000 004",
    registrationId: "INT-2026-004",
    school: "Strathmore University",
    course: "Business Administration",
    department: "Administration",
    supervisor: "Administration Officer",
    startDate: "2026-06-10",
    endDate: "2026-09-10",
    status: "Completed",
    progress: 100,
    documents: [
      { name: "Attachment Letter.pdf", size: "205 KB" },
      { name: "Completion Report.pdf", size: "320 KB" },
    ],
    notes: "Completed with distinction. Certificate issued.",
  },
  {
    id: 5,
    code: "ATT-2026-005",
    studentName: "Peter Mwangi",
    studentEmail: "peter.mwangi@example.com",
    studentPhone: "+254 712 000 005",
    registrationId: "INT-2026-005",
    school: "University of Nairobi",
    course: "Economics",
    department: "Research",
    supervisor: "Head of Research",
    startDate: "2026-10-12",
    endDate: "2027-01-12",
    status: "Approved",
    progress: 0,
    documents: [{ name: "Attachment Letter.pdf", size: "200 KB" }],
    notes: "Starts October intake.",
  },
  {
    id: 6,
    code: "ATT-2026-006",
    studentName: "Faith Njeri",
    studentEmail: "faith.njeri@example.com",
    studentPhone: "+254 712 000 006",
    registrationId: "INT-2026-006",
    school: "Jomo Kenyatta University",
    course: "Communication Studies",
    department: "Public Communications",
    supervisor: "Communications Lead",
    startDate: "2026-09-15",
    endDate: "2026-12-15",
    status: "Pending",
    progress: 0,
    documents: [{ name: "Application Letter.pdf", size: "175 KB" }],
    notes: "References under verification.",
  },
  {
    id: 7,
    code: "ATT-2026-007",
    studentName: "David Kiplagat",
    studentEmail: "david.kiplagat@example.com",
    studentPhone: "+254 712 000 007",
    registrationId: "INT-2026-007",
    school: "Moi University",
    course: "Law",
    department: "Legal",
    supervisor: "Legal Counsel",
    startDate: "2026-09-20",
    endDate: "2026-12-20",
    status: "Rejected",
    progress: 0,
    documents: [{ name: "Application Letter.pdf", size: "160 KB" }],
    notes: "Does not meet academic-year requirement.",
  },
  {
    id: 8,
    code: "ATT-2026-008",
    studentName: "Lucy Wambui",
    studentEmail: "lucy.wambui@example.com",
    studentPhone: "+254 712 000 008",
    registrationId: "INT-2026-008",
    school: "Kenyatta University",
    course: "Public Administration",
    department: "Senate Liaison",
    supervisor: "Senior Liaison Officer",
    startDate: "2026-09-01",
    endDate: "2026-11-30",
    status: "Active",
    progress: 45,
    documents: [
      { name: "Attachment Letter.pdf", size: "185 KB" },
      { name: "Progress Report.pdf", size: "210 KB" },
    ],
    notes: "Assigned to liaison correspondence desk.",
  },
];

const DEPARTMENTS: string[] = [
  "All Departments",
  "Senate Liaison",
  "ICT",
  "Research",
  "Administration",
  "Public Communications",
  "Legal",
];

const SCHOOLS: string[] = [
  "All Schools",
  "University of Nairobi",
  "Kenyatta University",
  "Strathmore University",
  "Maseno University",
  "Jomo Kenyatta University",
  "Moi University",
];

const STATUSES: StatusFilter[] = [
  "All",
  "Pending",
  "Approved",
  "Active",
  "Completed",
  "Rejected",
];

const STATUS_ICONS: Record<AttachmentStatus, LucideIcon> = {
  Pending: Clock3,
  Approved: CheckCircle2,
  Active: Briefcase,
  Completed: GraduationCap,
  Rejected: XCircle,
};

const PAGE_SIZE = 5;
const AVATAR_TONES = ["avatarA", "avatarB", "avatarC", "avatarD", "avatarE"];

/* ============================================================
   HELPERS
   ============================================================ */

function initials(name: string): string {
  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part: string) => part[0]?.toUpperCase())
    .join("");
}

function formatDate(iso: string): string {
  const date = new Date(iso);

  if (Number.isNaN(date.getTime())) {
    return "—";
  }

  return date.toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

function daysBetween(a: string | Date, b: string | Date): number {
  const start = a instanceof Date ? a : new Date(a);
  const end = b instanceof Date ? b : new Date(b);
  return Math.round((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24));
}

function pageRange(page: number, total: number, span = 1): number[] {
  const set = new Set<number>([1, total]);
  for (let i = page - span; i <= page + span; i++) {
    if (i >= 1 && i <= total) set.add(i);
  }
  return [...set].sort((a, b) => a - b);
}

/* ============================================================
   STATUS BADGE
   ============================================================ */

function StatusBadge({ status }: { status: AttachmentStatus }) {
  const Icon = STATUS_ICONS[status] ?? Clock3;
  return (
    <span className={`${styles.badge} ${styles[`badge${status}`]}`}>
      <Icon size={12} aria-hidden="true" />
      {status}
    </span>
  );
}

/* ============================================================
   PROGRESS BAR (inline in the table)
   ============================================================ */

function Progress({ value }: { value: number }) {
  return (
    <div className={styles.progressCell}>
      <div className={styles.progressTrack} aria-hidden="true">
        <div
          className={styles.progressFill}
          style={{ width: `${Math.min(100, Math.max(0, value))}%` }}
        />
      </div>
      <span className={styles.progressValue}>{value}%</span>
    </div>
  );
}

/* ============================================================
   EMPTY STATE
   ============================================================ */

function EmptyState({
  icon: Icon = SearchX,
  title,
  message,
}: {
  icon?: LucideIcon;
  title: string;
  message: string;
}) {
  return (
    <div className={styles.empty}>
      <span className={styles.emptyIcon}>
        <Icon size={26} aria-hidden="true" />
      </span>
      <h3 className={styles.emptyTitle}>{title}</h3>
      <p className={styles.emptyMessage}>{message}</p>
    </div>
  );
}

/* ============================================================
   SKELETONS
   ============================================================ */

function SkeletonStats() {
  return (
    <section className={styles.stats} aria-hidden="true">
      {Array.from({ length: 6 }).map((_, i) => (
        <div key={i} className={`${styles.statCard} ${styles.skeleton}`}>
          <div className={styles.skelLine} style={{ width: "30%" }} />
          <div
            className={styles.skelLine}
            style={{ width: "55%", height: "1.7rem" }}
          />
          <div className={styles.skelLine} style={{ width: "70%" }} />
        </div>
      ))}
    </section>
  );
}

function SkeletonTable({ rows = 5 }: { rows?: number }) {
  return (
    <div className={styles.skeletonTable} aria-hidden="true">
      {Array.from({ length: rows }).map((_, i) => (
        <div key={i} className={`${styles.skeletonRow} ${styles.skeleton}`}>
          <div className={styles.skelCircle} />
          <div className={styles.skelLine} style={{ width: "60%" }} />
          <div className={styles.skelLine} style={{ width: "40%" }} />
          <div className={styles.skelLine} style={{ width: "30%" }} />
        </div>
      ))}
    </div>
  );
}

/* ============================================================
   STATS
   ============================================================ */

function AttachmentStats({
  attachments,
  loading,
}: {
  attachments: Attachment[];
  loading: boolean;
}) {
  const counts = useMemo(
    () =>
      attachments.reduce<AttachmentCounts>(
        (acc, a) => {
          acc.total += 1;
          if (a.status === "Pending") acc.pending += 1;
          if (a.status === "Approved") acc.approved += 1;
          if (a.status === "Active") acc.active += 1;
          if (a.status === "Completed") acc.completed += 1;
          if (a.status === "Rejected") acc.rejected += 1;
          if (a.status === "Active") {
            acc.avgProgress += a.progress;
            acc.activeForAvg += 1;
          }
          return acc;
        },
        {
          total: 0,
          pending: 0,
          approved: 0,
          active: 0,
          completed: 0,
          rejected: 0,
          avgProgress: 0,
          activeForAvg: 0,
        },
      ),
    [attachments],
  );

  const avgProgress = counts.activeForAvg
    ? Math.round(counts.avgProgress / counts.activeForAvg)
    : 0;

  const cards: StatCard[] = [
    {
      key: "total",
      label: "Total Attachments",
      value: counts.total,
      hint: "All placements on record",
      icon: Briefcase,
      tone: "neutral",
    },
    {
      key: "pending",
      label: "Pending",
      value: counts.pending,
      hint: "Awaiting approval",
      icon: Clock3,
      tone: "pending",
      delta: "+2 this week",
    },
    {
      key: "approved",
      label: "Approved",
      value: counts.approved,
      hint: "Ready to start",
      icon: CheckCircle2,
      tone: "approved",
    },
    {
      key: "active",
      label: "Active",
      value: counts.active,
      hint: "Currently attached",
      icon: Briefcase,
      tone: "active",
    },
    {
      key: "completed",
      label: "Completed",
      value: counts.completed,
      hint: "Successfully finished",
      icon: GraduationCap,
      tone: "completed",
    },
    {
      key: "progress",
      label: "Avg. Progress",
      value: `${avgProgress}%`,
      hint: "Active attachments",
      icon: TrendingUp,
      tone: "approved",
    },
  ];

  if (loading) return <SkeletonStats />;

  return (
    <section className={styles.stats} aria-label="Attachment statistics">
      {cards.map((card) => {
        const Icon = card.icon;
        return (
          <article
            key={card.key}
            className={`${styles.statCard} ${styles[`tone_${card.tone}`]}`}
          >
            <div className={styles.statTop}>
              <span className={styles.statIcon}>
                <Icon size={18} aria-hidden="true" />
              </span>
              {card.delta && (
                <span className={styles.statDelta}>
                  <TrendingUp size={12} aria-hidden="true" />
                  {card.delta}
                </span>
              )}
            </div>
            <p className={styles.statValue}>{card.value}</p>
            <p className={styles.statLabel}>{card.label}</p>
            <p className={styles.statHint}>{card.hint}</p>
          </article>
        );
      })}
    </section>
  );
}

/* ============================================================
   ANALYTICS
   ============================================================ */

function AttachmentAnalytics({ attachments }: { attachments: Attachment[] }) {
  const byDepartment = useMemo(() => {
    const t: Record<string, number> = {};
    for (const a of attachments) {
      t[a.department] = (t[a.department] ?? 0) + 1;
    }
    return Object.entries(t).sort((a, b) => b[1] - a[1]);
  }, [attachments]);

  const totals = useMemo(() => {
    const t = {
      applications: 0,
      approved: 0,
      pending: 0,
      active: 0,
      completed: 0,
    };
    for (const a of attachments) {
      t.applications += 1;
      if (a.status === "Approved") t.approved += 1;
      if (a.status === "Pending") t.pending += 1;
      if (a.status === "Active") t.active += 1;
      if (a.status === "Completed") t.completed += 1;
    }
    return t;
  }, [attachments]);

  const total = totals.applications || 1;
  const rows = [
    { key: "active", label: "Active", value: totals.active, tone: "active" },
    {
      key: "approved",
      label: "Approved",
      value: totals.approved,
      tone: "approved",
    },
    {
      key: "pending",
      label: "Pending",
      value: totals.pending,
      tone: "pending",
    },
    {
      key: "completed",
      label: "Completed",
      value: totals.completed,
      tone: "completed",
    },
  ];
  const maxDept = Math.max(...byDepartment.map(([, v]) => v), 1);
  const activePct = Math.round((totals.active / total) * 100);

  return (
    <section className={styles.analytics} aria-label="Attachment analytics">
      <article className={styles.card}>
        <header className={styles.cardHeader}>
          <h2 className={styles.cardTitle}>Status Overview</h2>
          <span className={styles.cardSubtle}>{total} attachments</span>
        </header>

        <div className={styles.overview}>
          <div className={styles.overviewBars}>
            {rows.map((row) => {
              const pct = Math.round((row.value / total) * 100);
              return (
                <div key={row.key} className={styles.overviewRow}>
                  <div className={styles.overviewRowHead}>
                    <span className={styles.overviewRowLabel}>{row.label}</span>
                    <span className={styles.overviewRowValue}>
                      {row.value}{" "}
                      <span className={styles.overviewRowPct}>{pct}%</span>
                    </span>
                  </div>
                  <div className={styles.barTrack}>
                    <div
                      className={`${styles.barFill} ${styles[`bar_${row.tone}`]}`}
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>

          <div className={styles.overviewDonut}>
            <svg
              viewBox="0 0 36 36"
              className={styles.donut}
              aria-hidden="true"
            >
              <circle cx="18" cy="18" r="15.9" className={styles.donutTrack} />
              <circle
                cx="18"
                cy="18"
                r="15.9"
                className={styles.donutFill}
                strokeDasharray={`${activePct} 100`}
              />
            </svg>
            <div className={styles.donutCenter}>
              <span className={styles.donutValue}>{activePct}%</span>
              <span className={styles.donutLabel}>Active</span>
            </div>
          </div>
        </div>
      </article>

      <article className={styles.card}>
        <header className={styles.cardHeader}>
          <h2 className={styles.cardTitle}>By Department</h2>
          <span className={styles.cardSubtle}>Distribution</span>
        </header>

        <div
          className={styles.trends}
          role="img"
          aria-label="Attachments grouped by department"
        >
          {byDepartment.map(([dept, count]) => {
            const h = Math.max(6, Math.round((count / maxDept) * 100));
            return (
              <div key={dept} className={styles.trendCol}>
                <span className={styles.trendValue}>{count}</span>
                <div className={styles.trendBarTrack}>
                  <div
                    className={styles.trendBarFill}
                    style={{ height: `${h}%` }}
                  />
                </div>
                <span className={styles.trendLabel}>
                  {dept.length > 8 ? dept.slice(0, 8) + "…" : dept}
                </span>
              </div>
            );
          })}
        </div>
      </article>
    </section>
  );
}

/* ============================================================
   SIDE PANELS
   ============================================================ */

const ACTIVITY: ActivityItem[] = [
  {
    id: 1,
    type: "started",
    text: "John Kamau started his attachment",
    time: "12 minutes ago",
  },
  {
    id: 2,
    type: "progress",
    text: "Brian Otieno submitted a progress report",
    time: "1 hour ago",
  },
  {
    id: 3,
    type: "approved",
    text: "Peter Mwangi's attachment was approved",
    time: "3 hours ago",
  },
  {
    id: 4,
    type: "completed",
    text: "Grace Achieng completed her attachment",
    time: "Yesterday",
  },
];

const ACTIVITY_ICONS: Record<ActivityType, LucideIcon> = {
  started: Briefcase,
  progress: FileText,
  approved: CheckCircle2,
  completed: GraduationCap,
};

function AttachmentActivityPanel() {
  return (
    <article className={styles.card}>
      <header className={styles.cardHeader}>
        <h2 className={styles.cardTitle}>Attachment Activity</h2>
      </header>
      <ul className={styles.activityList}>
        {ACTIVITY.map((a) => {
          const Icon = ACTIVITY_ICONS[a.type] ?? FileText;
          return (
            <li key={a.id} className={styles.activityItem}>
              <span
                className={`${styles.activityIcon} ${styles[`activity_${a.type}`]}`}
              >
                <Icon size={14} aria-hidden="true" />
              </span>
              <div className={styles.activityBody}>
                <p className={styles.activityText}>{a.text}</p>
                <span className={styles.activityTime}>{a.time}</span>
              </div>
            </li>
          );
        })}
      </ul>
    </article>
  );
}

const UPCOMING_STARTS: UpcomingStart[] = [
  { date: "01 Oct", name: "John Kamau", department: "Senate Liaison" },
  { date: "05 Oct", name: "Mary Wanjiku", department: "ICT" },
  { date: "12 Oct", name: "Peter Mwangi", department: "Research" },
];

function UpcomingStartsPanel() {
  return (
    <article className={styles.card}>
      <header className={styles.cardHeader}>
        <h2 className={styles.cardTitle}>Upcoming Starts</h2>
      </header>
      <ol className={styles.timeline}>
        {UPCOMING_STARTS.map((u, idx) => (
          <li key={idx} className={styles.timelineItem}>
            <span className={styles.timelineDate}>{u.date}</span>
            <span className={styles.timelineDot} aria-hidden="true" />
            <div className={styles.timelineBody}>
              <p className={styles.timelineName}>{u.name}</p>
              <span className={styles.timelineDept}>{u.department}</span>
            </div>
          </li>
        ))}
      </ol>
    </article>
  );
}

const ENDING_SOON: EndingSoonItem[] = [
  { date: "31 Oct", name: "Brian Otieno", department: "Research", days: 24 },
  {
    date: "10 Sep",
    name: "Grace Achieng",
    department: "Administration",
    days: 3,
  },
  {
    date: "30 Nov",
    name: "John Kamau",
    department: "Senate Liaison",
    days: 54,
  },
];

function EndingSoonPanel() {
  return (
    <article className={styles.card}>
      <header className={styles.cardHeader}>
        <h2 className={styles.cardTitle}>Ending Soon</h2>
      </header>
      <ul className={styles.endingList}>
        {ENDING_SOON.map((e, idx) => {
          const urgent = e.days <= 7;
          return (
            <li key={idx} className={styles.endingItem}>
              <span
                className={`${styles.endingDays} ${
                  urgent ? styles.endingUrgent : ""
                }`}
              >
                {e.days}d
              </span>
              <div className={styles.endingBody}>
                <p className={styles.endingName}>{e.name}</p>
                <span className={styles.endingDept}>
                  {e.department} · ends {e.date}
                </span>
              </div>
            </li>
          );
        })}
      </ul>
    </article>
  );
}

function QuickActionsPanel({ onAdd }: { onAdd: () => void }) {
  const actions: QuickAction[] = [
    {
      key: "add",
      label: "New Attachment",
      icon: Plus,
      primary: true,
      onClick: onAdd,
    },
    {
      key: "review",
      label: "Review Pending",
      icon: ListChecks,
      onClick: () => {},
    },
    { key: "export", label: "Export List", icon: Download, onClick: () => {} },
    {
      key: "supervisors",
      label: "Manage Supervisors",
      icon: Users,
      onClick: () => {},
    },
  ];

  return (
    <article className={styles.card}>
      <header className={styles.cardHeader}>
        <h2 className={styles.cardTitle}>Quick Actions</h2>
      </header>
      <div className={styles.quickGrid}>
        {actions.map((a) => {
          const Icon = a.icon;
          return (
            <button
              key={a.key}
              type="button"
              className={`${styles.quickBtn} ${
                a.primary ? styles.quickBtnPrimary : ""
              }`}
              onClick={a.onClick}
            >
              <Icon size={16} aria-hidden="true" />
              <span>{a.label}</span>
            </button>
          );
        })}
      </div>
    </article>
  );
}

/* ============================================================
   DRAWER
   ============================================================ */

function AttachmentProfileDrawer({
  attachment,
  onClose,
}: {
  attachment: Attachment | null;
  onClose: () => void;
}) {
  if (!attachment) return null;

  const totalDays = daysBetween(attachment.startDate, attachment.endDate);
  const elapsed = Math.max(
    0,
    daysBetween(attachment.startDate, new Date().toISOString()),
  );
  const elapsedPct = Math.min(100, Math.round((elapsed / totalDays) * 100));

  return (
    <div
      className={styles.drawerBackdrop}
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <aside
        className={styles.drawer}
        role="dialog"
        aria-modal="true"
        aria-labelledby="attachment-profile-heading"
      >
        <header className={styles.drawerHeader}>
          <div className={styles.drawerIdentity}>
            <span
              className={`${styles.avatar} ${styles.avatarLarge} ${styles.avatarA}`}
            >
              {initials(attachment.studentName)}
            </span>
            <div>
              <h2 id="attachment-profile-heading" className={styles.drawerName}>
                {attachment.studentName}
              </h2>
              <p className={styles.drawerReg}>{attachment.code}</p>
            </div>
          </div>
          <button
            type="button"
            className={styles.iconBtn}
            onClick={onClose}
            aria-label="Close attachment profile"
          >
            <X size={18} aria-hidden="true" />
          </button>
        </header>

        <div className={styles.drawerBody}>
          <div className={styles.drawerStatusRow}>
            <StatusBadge status={attachment.status} />
            <span className={styles.drawerSupervisor}>
              Supervisor: <strong>{attachment.supervisor}</strong>
            </span>
          </div>

          {attachment.status === "Active" && (
            <section className={styles.drawerSection}>
              <h3 className={styles.drawerSectionTitle}>Progress</h3>
              <div className={styles.progressBlock}>
                <div className={styles.progressTrackLarge}>
                  <div
                    className={styles.progressFill}
                    style={{ width: `${attachment.progress}%` }}
                  />
                </div>
                <div className={styles.progressMeta}>
                  <span>{attachment.progress}% complete</span>
                  <span>
                    {elapsedPct}% of time elapsed ({elapsed} of {totalDays}{" "}
                    days)
                  </span>
                </div>
              </div>
            </section>
          )}

          <section className={styles.drawerSection}>
            <h3 className={styles.drawerSectionTitle}>Student</h3>
            <ul className={styles.infoList}>
              <li>
                <Mail size={14} aria-hidden="true" />
                <span>{attachment.studentEmail}</span>
              </li>
              <li>
                <Phone size={14} aria-hidden="true" />
                <span>{attachment.studentPhone}</span>
              </li>
              <li>
                <User size={14} aria-hidden="true" />
                <span>{attachment.registrationId}</span>
              </li>
            </ul>
          </section>

          <section className={styles.drawerSection}>
            <h3 className={styles.drawerSectionTitle}>Academic</h3>
            <ul className={styles.infoList}>
              <li>
                <School size={14} aria-hidden="true" />
                <span>{attachment.school}</span>
              </li>
              <li>
                <Award size={14} aria-hidden="true" />
                <span>{attachment.course}</span>
              </li>
            </ul>
          </section>

          <section className={styles.drawerSection}>
            <h3 className={styles.drawerSectionTitle}>Placement</h3>
            <ul className={styles.infoList}>
              <li>
                <Building2 size={14} aria-hidden="true" />
                <span>{attachment.department}</span>
              </li>
              <li>
                <Calendar size={14} aria-hidden="true" />
                <span>
                  {formatDate(attachment.startDate)} →{" "}
                  {formatDate(attachment.endDate)}
                </span>
              </li>
            </ul>
          </section>

          <section className={styles.drawerSection}>
            <h3 className={styles.drawerSectionTitle}>Documents</h3>
            <ul className={styles.docList}>
              {attachment.documents.map((d, i) => (
                <li key={i} className={styles.docItem}>
                  <FileText size={14} aria-hidden="true" />
                  <span className={styles.docName}>{d.name}</span>
                  <span className={styles.docSize}>{d.size}</span>
                </li>
              ))}
            </ul>
          </section>

          {attachment.notes && (
            <section className={styles.drawerSection}>
              <h3 className={styles.drawerSectionTitle}>Notes</h3>
              <p className={styles.drawerNotes}>{attachment.notes}</p>
            </section>
          )}
        </div>

        <footer className={styles.drawerFooter}>
          <button
            type="button"
            className={styles.primaryBtn}
            onClick={() => {}}
          >
            Edit Attachment
          </button>
          <button type="button" className={styles.ghostBtn} onClick={() => {}}>
            View Documents
          </button>
          <button type="button" className={styles.ghostBtn} onClick={onClose}>
            Close
          </button>
        </footer>
      </aside>
    </div>
  );
}

/* ============================================================
   ROW
   ============================================================ */

function AttachmentRow({
  attachment,
  onViewProfile,
}: {
  attachment: Attachment;
  onViewProfile: (a: Attachment) => void;
}) {
  const [menuOpen, setMenuOpen] = useState(false);
  const tone = AVATAR_TONES[attachment.id % AVATAR_TONES.length];

  const actions: RowAction[] = [
    {
      key: "view",
      label: "View Profile",
      onClick: () => onViewProfile(attachment),
    },
    {
      key: "docs",
      label: "View Documents",
      onClick: () => onViewProfile(attachment),
    },
    { key: "edit", label: "Edit Attachment", onClick: () => {} },
    { key: "status", label: "Change Status", onClick: () => {} },
    { key: "extend", label: "Extend Duration", onClick: () => {} },
    { key: "delete", label: "Delete", danger: true, onClick: () => {} },
  ];

  return (
    <tr>
      <th scope="row" className={styles.studentCell}>
        <span className={`${styles.avatar} ${styles[tone]}`} aria-hidden="true">
          {initials(attachment.studentName)}
        </span>
        <div className={styles.studentMeta}>
          <span className={styles.studentName}>{attachment.studentName}</span>
          <span className={styles.studentSchool}>{attachment.school}</span>
        </div>
      </th>
      <td className={styles.mono}>{attachment.code}</td>
      <td>{attachment.department}</td>
      <td>{attachment.supervisor}</td>
      <td className={styles.mono}>{formatDate(attachment.startDate)}</td>
      <td className={styles.mono}>{formatDate(attachment.endDate)}</td>
      <td>
        <Progress value={attachment.progress} />
      </td>
      <td>
        <StatusBadge status={attachment.status} />
      </td>
      <td className={styles.actionsCol}>
        <div className={styles.rowMenu}>
          <button
            type="button"
            className={styles.iconBtn}
            aria-label={`Actions for ${attachment.studentName}`}
            aria-haspopup="menu"
            aria-expanded={menuOpen}
            onClick={() => setMenuOpen((v) => !v)}
          >
            <MoreHorizontal size={16} aria-hidden="true" />
          </button>

          {menuOpen && (
            <>
              <div
                className={styles.menuBackdrop}
                onClick={() => setMenuOpen(false)}
                aria-hidden="true"
              />
              <ul className={styles.menu} role="menu">
                {actions.map((a) => (
                  <li key={a.key}>
                    <button
                      type="button"
                      role="menuitem"
                      className={`${styles.menuItem} ${
                        a.danger ? styles.menuItemDanger : ""
                      }`}
                      onClick={() => {
                        setMenuOpen(false);
                        a.onClick();
                      }}
                    >
                      {a.label}
                    </button>
                  </li>
                ))}
              </ul>
            </>
          )}
        </div>
      </td>
    </tr>
  );
}

/* ============================================================
   PAGINATION
   ============================================================ */

function Pagination({
  page,
  totalPages,
  totalRows,
  pageSize,
  onPage,
}: {
  page: number;
  totalPages: number;
  totalRows: number;
  pageSize: number;
  onPage: (page: number) => void;
}) {
  const start = totalRows === 0 ? 0 : (page - 1) * pageSize + 1;
  const end = Math.min(page * pageSize, totalRows);
  const pages = pageRange(page, totalPages);

  return (
    <nav className={styles.pagination} aria-label="Pagination">
      <p className={styles.paginationInfo}>
        Showing <strong>{start}</strong>–<strong>{end}</strong> of{" "}
        <strong>{totalRows}</strong> attachments
      </p>

      <div className={styles.paginationControls}>
        <button
          type="button"
          className={styles.pageBtn}
          onClick={() => onPage(page - 1)}
          disabled={page === 1}
          aria-label="Previous page"
        >
          <ChevronLeft size={15} aria-hidden="true" />
          <span>Previous</span>
        </button>

        {pages.map((p) => (
          <button
            key={p}
            type="button"
            className={`${styles.pageBtn} ${
              p === page ? styles.pageBtnActive : ""
            }`}
            onClick={() => onPage(p)}
            aria-current={p === page ? "page" : undefined}
          >
            {p}
          </button>
        ))}

        <button
          type="button"
          className={styles.pageBtn}
          onClick={() => onPage(page + 1)}
          disabled={page === totalPages}
          aria-label="Next page"
        >
          <span>Next</span>
          <ChevronRight size={15} aria-hidden="true" />
        </button>
      </div>
    </nav>
  );
}

/* ============================================================
   DIRECTORY
   ============================================================ */

function AttachmentsDirectory({
  attachments,
  loading,
  onViewProfile,
}: {
  attachments: Attachment[];
  loading: boolean;
  onViewProfile: (a: Attachment) => void;
}) {
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState<StatusFilter>("All");
  const [department, setDepartment] = useState("All Departments");
  const [school, setSchool] = useState("All Schools");
  const [sort, setSort] = useState<SortKey>("date-desc");
  const [page, setPage] = useState(1);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    let out = attachments.filter((a) => {
      const matchesSearch =
        !q ||
        [
          a.studentName,
          a.studentEmail,
          a.code,
          a.registrationId,
          a.school,
          a.course,
          a.department,
          a.supervisor,
        ]
          .join(" ")
          .toLowerCase()
          .includes(q);
      const matchesStatus = status === "All" || a.status === status;
      const matchesDept =
        department === "All Departments" || a.department === department;
      const matchesSchool = school === "All Schools" || a.school === school;
      return matchesSearch && matchesStatus && matchesDept && matchesSchool;
    });

    out = [...out].sort((a, b) => {
      switch (sort) {
        case "name-asc":
          return a.studentName.localeCompare(b.studentName);
        case "name-desc":
          return b.studentName.localeCompare(a.studentName);
        case "date-asc":
          return (
            new Date(a.startDate).getTime() - new Date(b.startDate).getTime()
          );
        case "progress-desc":
          return b.progress - a.progress;
        case "date-desc":
        default:
          return (
            new Date(b.startDate).getTime() - new Date(a.startDate).getTime()
          );
      }
    });

    return out;
  }, [attachments, search, status, department, school, sort]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const currentPage = Math.min(page, totalPages);
  const start = (currentPage - 1) * PAGE_SIZE;
  const pageRows = filtered.slice(start, start + PAGE_SIZE);

  const resetPage = () => setPage(1);

  return (
    <section className={styles.directory} aria-label="Attachments directory">
      <header className={styles.directoryHeader}>
        <div>
          <h2 className={styles.cardTitle}>Attachments Directory</h2>
          <p className={styles.cardSubtle}>
            View and manage student attachments and placements.
          </p>
        </div>

        <div className={styles.directoryControls}>
          <label className={styles.searchBox}>
            <Search size={15} aria-hidden="true" />
            <span className={styles.visuallyHidden}>Search attachments</span>
            <input
              type="search"
              placeholder="Search name, code, supervisor..."
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                resetPage();
              }}
            />
          </label>

          <select
            className={styles.select}
            value={status}
            onChange={(e) => {
              setStatus(e.target.value as StatusFilter);
              resetPage();
            }}
            aria-label="Filter by status"
          >
            {STATUSES.map((s) => (
              <option key={s} value={s}>
                {s === "All" ? "All Statuses" : s}
              </option>
            ))}
          </select>

          <select
            className={styles.select}
            value={department}
            onChange={(e) => {
              setDepartment(e.target.value);
              resetPage();
            }}
            aria-label="Filter by department"
          >
            {DEPARTMENTS.map((d) => (
              <option key={d} value={d}>
                {d}
              </option>
            ))}
          </select>

          <select
            className={styles.select}
            value={school}
            onChange={(e) => {
              setSchool(e.target.value);
              resetPage();
            }}
            aria-label="Filter by school"
          >
            {SCHOOLS.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>

          <select
            className={styles.select}
            value={sort}
            onChange={(e) => setSort(e.target.value as SortKey)}
            aria-label="Sort attachments"
          >
            <option value="date-desc">Newest start</option>
            <option value="date-asc">Oldest start</option>
            <option value="name-asc">Name (A–Z)</option>
            <option value="name-desc">Name (Z–A)</option>
            <option value="progress-desc">Highest progress</option>
          </select>
        </div>
      </header>

      {loading ? (
        <SkeletonTable rows={5} />
      ) : pageRows.length === 0 ? (
        <EmptyState
          icon={SearchX}
          title="No attachments found"
          message="Try changing your search or filters."
        />
      ) : (
        <>
          <div className={styles.tableScroll}>
            <table className={styles.table}>
              <caption className={styles.visuallyHidden}>
                Student attachments and their placement details
              </caption>
              <thead>
                <tr>
                  <th scope="col">Student</th>
                  <th scope="col">Code</th>
                  <th scope="col">Department</th>
                  <th scope="col">Supervisor</th>
                  <th scope="col">Start</th>
                  <th scope="col">End</th>
                  <th scope="col">Progress</th>
                  <th scope="col">Status</th>
                  <th scope="col" className={styles.actionsCol}>
                    <span className={styles.visuallyHidden}>Actions</span>
                  </th>
                </tr>
              </thead>
              <tbody>
                {pageRows.map((a) => (
                  <AttachmentRow
                    key={a.id}
                    attachment={a}
                    onViewProfile={onViewProfile}
                  />
                ))}
              </tbody>
            </table>
          </div>

          <Pagination
            page={currentPage}
            totalPages={totalPages}
            totalRows={filtered.length}
            pageSize={PAGE_SIZE}
            onPage={setPage}
          />
        </>
      )}
    </section>
  );
}

/* ============================================================
   PAGE
   ============================================================ */

export default function AttachmentsPage() {
  const [drawerAttachment, setDrawerAttachment] = useState<Attachment | null>(
    null,
  );
  const loading = false;

  const openAddAttachment = () => {
    // TODO: wire to Add Attachment modal + Supabase insert
  };

  return (
    <div className={styles.page}>
      <header className={styles.pageHeader}>
        <div className={styles.headerLeft}>
          <p className={styles.breadcrumb}>Dashboard / Attachments</p>
          <h1 className={styles.heading}>Attachments Management</h1>
          <p className={styles.description}>
            Track placements, monitor progress and manage supervisors.
          </p>
        </div>

        <div className={styles.headerRight}>
          <button type="button" className={styles.ghostBtn} aria-label="Search">
            <Search size={16} aria-hidden="true" />
            <span>Search</span>
          </button>
          <button type="button" className={styles.ghostBtn} aria-label="Filter">
            <Filter size={16} aria-hidden="true" />
            <span>Filter</span>
          </button>
          <button
            type="button"
            className={styles.primaryBtn}
            onClick={openAddAttachment}
          >
            <Plus size={16} aria-hidden="true" />
            <span>New Attachment</span>
          </button>
        </div>
      </header>

      <AttachmentStats attachments={ATTACHMENTS} loading={loading} />
      <AttachmentAnalytics attachments={ATTACHMENTS} />

      <AttachmentsDirectory
        attachments={ATTACHMENTS}
        loading={loading}
        onViewProfile={setDrawerAttachment}
      />

      <section className={styles.sideGrid} aria-label="Attachment updates">
        <AttachmentActivityPanel />
        <UpcomingStartsPanel />
        <EndingSoonPanel />
      </section>

      <section className={styles.bottomGrid} aria-label="More options">
        <QuickActionsPanel onAdd={openAddAttachment} />
      </section>

      <AttachmentProfileDrawer
        attachment={drawerAttachment}
        onClose={() => setDrawerAttachment(null)}
      />
    </div>
  );
}
