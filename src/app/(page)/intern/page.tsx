"use client";

import { useMemo, useState } from "react";
import {
  Plus,
  Search,
  Filter,
  Users,
  Clock3,
  BadgeCheck,
  UserCheck,
  GraduationCap,
  UserX,
  TrendingUp,
  CheckCircle2,
  FileText,
  Upload,
  Download,
  Building2,
  ListChecks,
  MoreHorizontal,
  X,
  Mail,
  Phone,
  Calendar,
  School,
  BookOpen,
  User,
  ChevronLeft,
  ChevronRight,
  SearchX,
  type LucideIcon,
} from "lucide-react";
import styles from "./styles.module.css";

/* ============================================================
   TYPES
   ============================================================ */

type InternStatus =
  | "Pending"
  | "Approved"
  | "Active"
  | "Completed"
  | "Rejected";

type StatusFilter = "All" | InternStatus;

type SortKey = "name-asc" | "name-desc" | "date-desc" | "date-asc";

type InternDocument = {
  name: string;
  size: string;
};

type Intern = {
  id: number;
  registrationId: string;
  name: string;
  email: string;
  phone: string;
  institution: string;
  course: string;
  department: string;
  startDate: string;
  endDate: string;
  status: InternStatus;
  supervisor: string;
  notes: string;
  documents: InternDocument[];
};

type InternCounts = {
  total: number;
  pending: number;
  approved: number;
  active: number;
  completed: number;
  rejected: number;
};

type TrendItem = {
  month: string;
  value: number;
};

type ActivityType = "approved" | "application" | "documents" | "completed";

type ActivityItem = {
  id: number;
  type: ActivityType;
  text: string;
  time: string;
};

type UpcomingItem = {
  date: string;
  name: string;
  department: string;
};

type StatCard = {
  key: string;
  label: string;
  value: number;
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

const INTERNS: Intern[] = [
  {
    id: 1,
    registrationId: "INT-2026-001",
    name: "John Kamau",
    email: "john.kamau@example.com",
    phone: "+254 712 000 001",
    institution: "University of Nairobi",
    course: "Political Science",
    department: "Senate Liaison",
    startDate: "2026-09-01",
    endDate: "2026-11-30",
    status: "Approved",
    supervisor: "Senior Liaison Officer",
    notes: "Strong research and report-writing skills.",
    documents: [
      { name: "Application Letter.pdf", size: "210 KB" },
      { name: "CV.pdf", size: "180 KB" },
      { name: "Recommendation.pdf", size: "95 KB" },
    ],
  },
  {
    id: 2,
    registrationId: "INT-2026-002",
    name: "Mary Wanjiku",
    email: "mary.wanjiku@example.com",
    phone: "+254 712 000 002",
    institution: "Kenyatta University",
    course: "Information Technology",
    department: "ICT",
    startDate: "2026-09-05",
    endDate: "2026-12-05",
    status: "Pending",
    supervisor: "ICT Manager",
    notes: "Awaiting review from department head.",
    documents: [
      { name: "Application Letter.pdf", size: "180 KB" },
      { name: "Academic Transcript.pdf", size: "240 KB" },
    ],
  },
  {
    id: 3,
    registrationId: "INT-2026-003",
    name: "Brian Otieno",
    email: "brian.otieno@example.com",
    phone: "+254 712 000 003",
    institution: "Maseno University",
    course: "Political Science",
    department: "Research",
    startDate: "2026-08-01",
    endDate: "2026-10-31",
    status: "Active",
    supervisor: "Head of Research",
    notes: "Currently attached to the research desk.",
    documents: [
      { name: "Application Letter.pdf", size: "190 KB" },
      { name: "CV.pdf", size: "170 KB" },
    ],
  },
  {
    id: 4,
    registrationId: "INT-2026-004",
    name: "Grace Achieng",
    email: "grace.achieng@example.com",
    phone: "+254 712 000 004",
    institution: "Strathmore University",
    course: "Business Administration",
    department: "Administration",
    startDate: "2026-06-10",
    endDate: "2026-09-10",
    status: "Completed",
    supervisor: "Administration Officer",
    notes: "Completed with distinction. Certificate issued.",
    documents: [
      { name: "Application Letter.pdf", size: "205 KB" },
      { name: "Completion Report.pdf", size: "320 KB" },
    ],
  },
  {
    id: 5,
    registrationId: "INT-2026-005",
    name: "Peter Mwangi",
    email: "peter.mwangi@example.com",
    phone: "+254 712 000 005",
    institution: "University of Nairobi",
    course: "Economics",
    department: "Research",
    startDate: "2026-10-12",
    endDate: "2027-01-12",
    status: "Approved",
    supervisor: "Head of Research",
    notes: "Placement confirmed for October intake.",
    documents: [{ name: "Application Letter.pdf", size: "200 KB" }],
  },
  {
    id: 6,
    registrationId: "INT-2026-006",
    name: "Faith Njeri",
    email: "faith.njeri@example.com",
    phone: "+254 712 000 006",
    institution: "Jomo Kenyatta University",
    course: "Communication Studies",
    department: "Public Communications",
    startDate: "2026-09-15",
    endDate: "2026-12-15",
    status: "Pending",
    supervisor: "Communications Lead",
    notes: "References under verification.",
    documents: [{ name: "Application Letter.pdf", size: "175 KB" }],
  },
  {
    id: 7,
    registrationId: "INT-2026-007",
    name: "David Kiplagat",
    email: "david.kiplagat@example.com",
    phone: "+254 712 000 007",
    institution: "Moi University",
    course: "Law",
    department: "Legal",
    startDate: "2026-09-20",
    endDate: "2026-12-20",
    status: "Rejected",
    supervisor: "Legal Counsel",
    notes: "Does not meet academic-year requirement.",
    documents: [{ name: "Application Letter.pdf", size: "160 KB" }],
  },
  {
    id: 8,
    registrationId: "INT-2026-008",
    name: "Lucy Wambui",
    email: "lucy.wambui@example.com",
    phone: "+254 712 000 008",
    institution: "Kenyatta University",
    course: "Public Administration",
    department: "Senate Liaison",
    startDate: "2026-09-01",
    endDate: "2026-11-30",
    status: "Active",
    supervisor: "Senior Liaison Officer",
    notes: "Assigned to liaison correspondence desk.",
    documents: [
      { name: "Application Letter.pdf", size: "185 KB" },
      { name: "CV.pdf", size: "160 KB" },
    ],
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

const STATUSES: StatusFilter[] = [
  "All",
  "Pending",
  "Approved",
  "Active",
  "Completed",
  "Rejected",
];

const TRENDS: TrendItem[] = [
  { month: "Jan", value: 12 },
  { month: "Feb", value: 18 },
  { month: "Mar", value: 21 },
  { month: "Apr", value: 16 },
  { month: "May", value: 25 },
  { month: "Jun", value: 31 },
];

const ACTIVITY: ActivityItem[] = [
  {
    id: 1,
    type: "approved",
    text: "John Kamau was approved",
    time: "12 minutes ago",
  },
  {
    id: 2,
    type: "application",
    text: "Mary Wanjiku submitted an application",
    time: "1 hour ago",
  },
  {
    id: 3,
    type: "documents",
    text: "Brian Otieno uploaded internship documents",
    time: "3 hours ago",
  },
  {
    id: 4,
    type: "completed",
    text: "Grace Achieng completed her internship",
    time: "Yesterday",
  },
];

const UPCOMING: UpcomingItem[] = [
  { date: "01 Oct", name: "John Kamau", department: "Senate Liaison" },
  { date: "05 Oct", name: "Mary Wanjiku", department: "ICT" },
  { date: "12 Oct", name: "Peter Mwangi", department: "Research" },
];

const STATUS_ICONS: Record<InternStatus, LucideIcon> = {
  Pending: Clock3,
  Approved: CheckCircle2,
  Active: UserCheck,
  Completed: GraduationCap,
  Rejected: UserX,
};

const ACTIVITY_ICONS: Record<ActivityType, LucideIcon> = {
  approved: CheckCircle2,
  application: FileText,
  documents: Upload,
  completed: GraduationCap,
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
    .map((p: string) => p[0]?.toUpperCase())
    .join("");
}

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
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

function StatusBadge({ status }: { status: InternStatus }) {
  const Icon = STATUS_ICONS[status] ?? Clock3;
  return (
    <span className={`${styles.badge} ${styles[`badge${status}`]}`}>
      <Icon size={12} aria-hidden="true" />
      {status}
    </span>
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
   SKELETON
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
          <div className={styles.skelLine} style={{ width: "45%" }} />
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

function InternStats({
  interns,
  loading,
}: {
  interns: Intern[];
  loading: boolean;
}) {
  const counts = useMemo(
    () =>
      interns.reduce<InternCounts>(
        (acc, i) => {
          acc.total += 1;
          if (i.status === "Pending") acc.pending += 1;
          if (i.status === "Approved") acc.approved += 1;
          if (i.status === "Active") acc.active += 1;
          if (i.status === "Completed") acc.completed += 1;
          if (i.status === "Rejected") acc.rejected += 1;
          return acc;
        },
        {
          total: 0,
          pending: 0,
          approved: 0,
          active: 0,
          completed: 0,
          rejected: 0,
        },
      ),
    [interns],
  );

  const cards: StatCard[] = [
    {
      key: "total",
      label: "Total Interns",
      value: counts.total,
      hint: "All registered interns",
      icon: Users,
      tone: "neutral",
    },
    {
      key: "pending",
      label: "Pending Applications",
      value: counts.pending,
      hint: "Awaiting review",
      icon: Clock3,
      tone: "pending",
      delta: "+3 this week",
    },
    {
      key: "approved",
      label: "Approved",
      value: counts.approved,
      hint: "Approved interns",
      icon: BadgeCheck,
      tone: "approved",
      delta: "+5 this week",
    },
    {
      key: "active",
      label: "Active Interns",
      value: counts.active,
      hint: "Currently attached",
      icon: UserCheck,
      tone: "active",
    },
    {
      key: "completed",
      label: "Completed",
      value: counts.completed,
      hint: "Internships completed",
      icon: GraduationCap,
      tone: "completed",
    },
    {
      key: "rejected",
      label: "Rejected",
      value: counts.rejected,
      hint: "Applications declined",
      icon: UserX,
      tone: "rejected",
    },
  ];

  if (loading) return <SkeletonStats />;

  return (
    <section className={styles.stats} aria-label="Internship statistics">
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

function InternAnalytics({ interns }: { interns: Intern[] }) {
  const totals = useMemo(() => {
    const t = {
      applications: 0,
      approved: 0,
      pending: 0,
      active: 0,
      completed: 0,
    };
    for (const i of interns) {
      t.applications += 1;
      if (i.status === "Approved") t.approved += 1;
      if (i.status === "Pending") t.pending += 1;
      if (i.status === "Active") t.active += 1;
      if (i.status === "Completed") t.completed += 1;
    }
    return t;
  }, [interns]);

  const total = totals.applications || 1;
  const rows = [
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
    { key: "active", label: "Active", value: totals.active, tone: "active" },
    {
      key: "completed",
      label: "Completed",
      value: totals.completed,
      tone: "completed",
    },
  ];
  const maxTrend = Math.max(...TRENDS.map((t) => t.value));
  const approvedPct = Math.round((totals.approved / total) * 100);

  return (
    <section className={styles.analytics} aria-label="Internship analytics">
      <article className={styles.card}>
        <header className={styles.cardHeader}>
          <h2 className={styles.cardTitle}>Internship Overview</h2>
          <span className={styles.cardSubtle}>{total} applications</span>
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
                strokeDasharray={`${approvedPct} 100`}
              />
            </svg>
            <div className={styles.donutCenter}>
              <span className={styles.donutValue}>{approvedPct}%</span>
              <span className={styles.donutLabel}>Approved</span>
            </div>
          </div>
        </div>
      </article>

      <article className={styles.card}>
        <header className={styles.cardHeader}>
          <h2 className={styles.cardTitle}>Internship Trends</h2>
          <span className={styles.cardSubtle}>Last 6 months</span>
        </header>

        <div
          className={styles.trends}
          role="img"
          aria-label="Monthly internship activity"
        >
          {TRENDS.map((t) => {
            const h = Math.max(6, Math.round((t.value / maxTrend) * 100));
            return (
              <div key={t.month} className={styles.trendCol}>
                <span className={styles.trendValue}>{t.value}</span>
                <div className={styles.trendBarTrack}>
                  <div
                    className={styles.trendBarFill}
                    style={{ height: `${h}%` }}
                  />
                </div>
                <span className={styles.trendLabel}>{t.month}</span>
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

function InternActivityPanel() {
  return (
    <article className={styles.card}>
      <header className={styles.cardHeader}>
        <h2 className={styles.cardTitle}>Internship Activity</h2>
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

function UpcomingInternshipsPanel() {
  return (
    <article className={styles.card}>
      <header className={styles.cardHeader}>
        <h2 className={styles.cardTitle}>Upcoming Starts</h2>
      </header>
      <ol className={styles.timeline}>
        {UPCOMING.map((u, idx) => (
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

function QuickActionsPanel({ onAdd }: { onAdd: () => void }) {
  const actions: QuickAction[] = [
    {
      key: "add",
      label: "Add Intern",
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
      key: "departments",
      label: "Manage Departments",
      icon: Building2,
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
              className={`${styles.quickBtn} ${a.primary ? styles.quickBtnPrimary : ""}`}
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
   PROFILE DRAWER
   ============================================================ */

function InternProfileDrawer({
  intern,
  onClose,
}: {
  intern: Intern | null;
  onClose: () => void;
}) {
  if (!intern) return null;

  return (
    <div
      className={styles.drawerBackdrop}
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <aside
        className={styles.drawer}
        role="dialog"
        aria-modal="true"
        aria-labelledby="intern-profile-heading"
      >
        <header className={styles.drawerHeader}>
          <div className={styles.drawerIdentity}>
            <span
              className={`${styles.avatar} ${styles.avatarLarge} ${styles.avatarA}`}
            >
              {initials(intern.name)}
            </span>
            <div>
              <h2 id="intern-profile-heading" className={styles.drawerName}>
                {intern.name}
              </h2>
              <p className={styles.drawerReg}>{intern.registrationId}</p>
            </div>
          </div>
          <button
            type="button"
            className={styles.iconBtn}
            onClick={onClose}
            aria-label="Close profile"
          >
            <X size={18} aria-hidden="true" />
          </button>
        </header>

        <div className={styles.drawerBody}>
          <div className={styles.drawerStatusRow}>
            <StatusBadge status={intern.status} />
            <span className={styles.drawerSupervisor}>
              Supervisor: <strong>{intern.supervisor}</strong>
            </span>
          </div>

          <section className={styles.drawerSection}>
            <h3 className={styles.drawerSectionTitle}>Contact</h3>
            <ul className={styles.infoList}>
              <li>
                <Mail size={14} aria-hidden="true" />
                <span>{intern.email}</span>
              </li>
              <li>
                <Phone size={14} aria-hidden="true" />
                <span>{intern.phone}</span>
              </li>
            </ul>
          </section>

          <section className={styles.drawerSection}>
            <h3 className={styles.drawerSectionTitle}>Academic</h3>
            <ul className={styles.infoList}>
              <li>
                <School size={14} aria-hidden="true" />
                <span>{intern.institution}</span>
              </li>
              <li>
                <BookOpen size={14} aria-hidden="true" />
                <span>{intern.course}</span>
              </li>
              <li>
                <User size={14} aria-hidden="true" />
                <span>{intern.department}</span>
              </li>
            </ul>
          </section>

          <section className={styles.drawerSection}>
            <h3 className={styles.drawerSectionTitle}>Placement</h3>
            <ul className={styles.infoList}>
              <li>
                <Calendar size={14} aria-hidden="true" />
                <span>
                  {formatDate(intern.startDate)} → {formatDate(intern.endDate)}
                </span>
              </li>
            </ul>
          </section>

          <section className={styles.drawerSection}>
            <h3 className={styles.drawerSectionTitle}>Documents</h3>
            <ul className={styles.docList}>
              {intern.documents.map((d, i) => (
                <li key={i} className={styles.docItem}>
                  <FileText size={14} aria-hidden="true" />
                  <span className={styles.docName}>{d.name}</span>
                  <span className={styles.docSize}>{d.size}</span>
                </li>
              ))}
            </ul>
          </section>

          {intern.notes && (
            <section className={styles.drawerSection}>
              <h3 className={styles.drawerSectionTitle}>Notes</h3>
              <p className={styles.drawerNotes}>{intern.notes}</p>
            </section>
          )}
        </div>

        <footer className={styles.drawerFooter}>
          <button
            type="button"
            className={styles.primaryBtn}
            onClick={() => {}}
          >
            Edit Intern
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
   INTERN ROW
   ============================================================ */

function InternRow({
  intern,
  onViewProfile,
}: {
  intern: Intern;
  onViewProfile: (intern: Intern) => void;
}) {
  const [menuOpen, setMenuOpen] = useState(false);
  const tone = AVATAR_TONES[intern.id % AVATAR_TONES.length];

  const actions: RowAction[] = [
    {
      key: "view",
      label: "View Profile",
      onClick: () => onViewProfile(intern),
    },
    {
      key: "docs",
      label: "View Documents",
      onClick: () => onViewProfile(intern),
    },
    { key: "edit", label: "Edit Intern", onClick: () => {} },
    { key: "status", label: "Change Status", onClick: () => {} },
    { key: "download", label: "Download Documents", onClick: () => {} },
    { key: "delete", label: "Delete", danger: true, onClick: () => {} },
  ];

  return (
    <tr>
      <th scope="row" className={styles.internCell}>
        <span className={`${styles.avatar} ${styles[tone]}`} aria-hidden="true">
          {initials(intern.name)}
        </span>
        <div className={styles.internMeta}>
          <span className={styles.internName}>{intern.name}</span>
          <span className={styles.internEmail}>{intern.email}</span>
        </div>
      </th>
      <td className={styles.mono}>{intern.registrationId}</td>
      <td>{intern.institution}</td>
      <td>{intern.course}</td>
      <td>{intern.department}</td>
      <td className={styles.mono}>{formatDate(intern.startDate)}</td>
      <td className={styles.mono}>{formatDate(intern.endDate)}</td>
      <td>
        <StatusBadge status={intern.status} />
      </td>
      <td className={styles.actionsCol}>
        <div className={styles.rowMenu}>
          <button
            type="button"
            className={styles.iconBtn}
            aria-label={`Actions for ${intern.name}`}
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
        <strong>{totalRows}</strong> interns
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
            className={`${styles.pageBtn} ${p === page ? styles.pageBtnActive : ""}`}
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

function InternDirectory({
  interns,
  loading,
  onViewProfile,
}: {
  interns: Intern[];
  loading: boolean;
  onViewProfile: (intern: Intern) => void;
}) {
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState<StatusFilter>("All");
  const [department, setDepartment] = useState("All Departments");
  const [sort, setSort] = useState<SortKey>("name-asc");
  const [page, setPage] = useState(1);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    let out = interns.filter((i) => {
      const matchesSearch =
        !q ||
        [
          i.name,
          i.email,
          i.registrationId,
          i.institution,
          i.course,
          i.department,
        ]
          .join(" ")
          .toLowerCase()
          .includes(q);
      const matchesStatus = status === "All" || i.status === status;
      const matchesDept =
        department === "All Departments" || i.department === department;
      return matchesSearch && matchesStatus && matchesDept;
    });

    out = [...out].sort((a, b) => {
      switch (sort) {
        case "name-desc":
          return b.name.localeCompare(a.name);
        case "date-desc":
          return (
            new Date(b.startDate).getTime() - new Date(a.startDate).getTime()
          );
        case "date-asc":
          return (
            new Date(a.startDate).getTime() - new Date(b.startDate).getTime()
          );
        default:
          return a.name.localeCompare(b.name);
      }
    });

    return out;
  }, [interns, search, status, department, sort]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const currentPage = Math.min(page, totalPages);
  const start = (currentPage - 1) * PAGE_SIZE;
  const pageRows = filtered.slice(start, start + PAGE_SIZE);

  const resetPage = () => setPage(1);

  return (
    <section className={styles.directory} aria-label="Intern directory">
      <header className={styles.directoryHeader}>
        <div>
          <h2 className={styles.cardTitle}>Intern Directory</h2>
          <p className={styles.cardSubtle}>
            View and manage registered interns.
          </p>
        </div>

        <div className={styles.directoryControls}>
          <label className={styles.searchBox}>
            <Search size={15} aria-hidden="true" />
            <span className={styles.visuallyHidden}>Search interns</span>
            <input
              type="search"
              placeholder="Search name, ID, institution..."
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
            value={sort}
            onChange={(e) => setSort(e.target.value as SortKey)}
            aria-label="Sort interns"
          >
            <option value="name-asc">Name (A–Z)</option>
            <option value="name-desc">Name (Z–A)</option>
            <option value="date-desc">Start date (newest)</option>
            <option value="date-asc">Start date (oldest)</option>
          </select>
        </div>
      </header>

      {loading ? (
        <SkeletonTable rows={5} />
      ) : pageRows.length === 0 ? (
        <EmptyState
          icon={SearchX}
          title="No interns found"
          message="Try changing your search or filters."
        />
      ) : (
        <>
          <div className={styles.tableScroll}>
            <table className={styles.table}>
              <caption className={styles.visuallyHidden}>
                Registered interns and their details
              </caption>
              <thead>
                <tr>
                  <th scope="col">Intern</th>
                  <th scope="col">Registration ID</th>
                  <th scope="col">Institution</th>
                  <th scope="col">Course</th>
                  <th scope="col">Department</th>
                  <th scope="col">Start Date</th>
                  <th scope="col">End Date</th>
                  <th scope="col">Status</th>
                  <th scope="col" className={styles.actionsCol}>
                    <span className={styles.visuallyHidden}>Actions</span>
                  </th>
                </tr>
              </thead>
              <tbody>
                {pageRows.map((i) => (
                  <InternRow
                    key={i.id}
                    intern={i}
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

export default function InternDashboardPage() {
  const [drawerIntern, setDrawerIntern] = useState<Intern | null>(null);
  const loading = false; // set true to preview skeletons

  const openAddIntern = () => {
    // TODO: wire to Add Intern modal + Supabase insert
  };

  return (
    <div className={styles.page}>
      <header className={styles.pageHeader}>
        <div className={styles.headerLeft}>
          <p className={styles.breadcrumb}>Dashboard / Interns</p>
          <h1 className={styles.heading}>Intern Management</h1>
          <p className={styles.description}>
            Monitor, review and manage internship applications and placements.
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
            onClick={openAddIntern}
          >
            <Plus size={16} aria-hidden="true" />
            <span>Add Intern</span>
          </button>
        </div>
      </header>

      <InternStats interns={INTERNS} loading={loading} />
      <InternAnalytics interns={INTERNS} />

      <InternDirectory
        interns={INTERNS}
        loading={loading}
        onViewProfile={setDrawerIntern}
      />

      <section className={styles.sideGrid} aria-label="Internship updates">
        <InternActivityPanel />
        <UpcomingInternshipsPanel />
        <QuickActionsPanel onAdd={openAddIntern} />
      </section>

      <InternProfileDrawer
        intern={drawerIntern}
        onClose={() => setDrawerIntern(null)}
      />
    </div>
  );
}
