"use client";

import { useMemo, useState } from "react";
import {
  Plus,
  Search,
  Filter,
  School,
  Building2,
  CheckCircle2,
  Clock3,
  XCircle,
  GraduationCap,
  Users,
  MoreHorizontal,
  X,
  Mail,
  Phone,
  MapPin,
  Globe,
  User,
  ChevronLeft,
  ChevronRight,
  SearchX,
  TrendingUp,
  Award,
  FileText,
  Download,
  ListChecks,
  type LucideIcon,
} from "lucide-react";
import styles from "./styles.module.css";

/* ============================================================
   TYPES
   ============================================================ */

type Partnership = "Active" | "Pending" | "Inactive";

type PartnershipFilter = "All" | Partnership;

type Accreditation = "Accredited" | "Provisional";

type SchoolType = "University" | "Technical" | "College" | "TVET";

type SortKey =
  | "name-asc"
  | "name-desc"
  | "attached-desc"
  | "completed-desc"
  | "since-desc";

/* Named SchoolRecord to avoid clashing with the lucide `School` icon. */
type SchoolRecord = {
  id: number;
  code: string;
  name: string;
  type: SchoolType;
  county: string;
  email: string;
  phone: string;
  website: string;
  contactPerson: string;
  partnership: Partnership;
  accreditation: Accreditation;
  studentsAttached: number;
  studentsCompleted: number;
  since: string;
  address: string;
  notes: string;
};

type SchoolCounts = {
  total: number;
  active: number;
  pending: number;
  inactive: number;
  attached: number;
  completed: number;
};

type ActivityType = "mou" | "students" | "accreditation" | "completed";

type ActivityItem = {
  id: number;
  type: ActivityType;
  text: string;
  time: string;
};

type TopSchool = {
  name: string;
  completed: number;
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

const SCHOOLS: SchoolRecord[] = [
  {
    id: 1,
    code: "SCH-001",
    name: "University of Nairobi",
    type: "University",
    county: "Nairobi",
    email: "internships@uonbi.ac.ke",
    phone: "+254 20 318 262",
    website: "uonbi.ac.ke",
    contactPerson: "Dr. Samuel Njoroge",
    partnership: "Active",
    accreditation: "Accredited",
    studentsAttached: 24,
    studentsCompleted: 68,
    since: "2018-03-12",
    address: "Gandhi Wing, Harry Thuku Rd, Nairobi",
    notes: "Long-standing partner. Strong political science pipeline.",
  },
  {
    id: 2,
    code: "SCH-002",
    name: "Kenyatta University",
    type: "University",
    county: "Kiambu",
    email: "careers@ku.ac.ke",
    phone: "+254 20 870 4000",
    website: "ku.ac.ke",
    contactPerson: "Ms. Alice Wambui",
    partnership: "Active",
    accreditation: "Accredited",
    studentsAttached: 18,
    studentsCompleted: 52,
    since: "2019-06-01",
    address: "Along Thika Superhighway, Kahawa, Kiambu",
    notes: "Regular IT and education interns.",
  },
  {
    id: 3,
    code: "SCH-003",
    name: "Strathmore University",
    type: "University",
    county: "Nairobi",
    email: "partnerships@strathmore.edu",
    phone: "+254 20 600 060",
    website: "strathmore.edu",
    contactPerson: "Mr. David Kariuki",
    partnership: "Active",
    accreditation: "Accredited",
    studentsAttached: 12,
    studentsCompleted: 34,
    since: "2020-01-20",
    address: "Ole Sangale Rd, Madaraka, Nairobi",
    notes: "Business and law students.",
  },
  {
    id: 4,
    code: "SCH-004",
    name: "Maseno University",
    type: "University",
    county: "Kisumu",
    email: "placement@maseno.ac.ke",
    phone: "+254 57 202 1008",
    website: "maseno.ac.ke",
    contactPerson: "Prof. Jane Ochieng",
    partnership: "Pending",
    accreditation: "Accredited",
    studentsAttached: 6,
    studentsCompleted: 21,
    since: "2021-09-15",
    address: "Maseno, Kisumu County",
    notes: "New MOU under review.",
  },
  {
    id: 5,
    code: "SCH-005",
    name: "Jomo Kenyatta University of Agriculture and Technology",
    type: "University",
    county: "Kiambu",
    email: "internships@jkuat.ac.ke",
    phone: "+254 67 587 0001",
    website: "jkuat.ac.ke",
    contactPerson: "Dr. Peter Mwaura",
    partnership: "Active",
    accreditation: "Accredited",
    studentsAttached: 15,
    studentsCompleted: 44,
    since: "2017-11-04",
    address: "Juja, Kiambu County",
    notes: "Technical and communications interns.",
  },
  {
    id: 6,
    code: "SCH-006",
    name: "Moi University",
    type: "University",
    county: "Uasin Gishu",
    email: "careers@mu.ac.ke",
    phone: "+254 53 436 2000",
    website: "mu.ac.ke",
    contactPerson: "Mr. Elijah Barasa",
    partnership: "Active",
    accreditation: "Accredited",
    studentsAttached: 9,
    studentsCompleted: 27,
    since: "2019-02-18",
    address: "Kesses, Eldoret, Uasin Gishu",
    notes: "Legal and research placements.",
  },
  {
    id: 7,
    code: "SCH-007",
    name: "Kisii University",
    type: "University",
    county: "Kisii",
    email: "info@kisiiuniversity.ac.ke",
    phone: "+254 58 202 1181",
    website: "kisiiuniversity.ac.ke",
    contactPerson: "Ms. Ruth Nyaboke",
    partnership: "Inactive",
    accreditation: "Accredited",
    studentsAttached: 0,
    studentsCompleted: 12,
    since: "2020-07-30",
    address: "Kisii Town, Kisii County",
    notes: "Paused pending MOU renewal.",
  },
  {
    id: 8,
    code: "SCH-008",
    name: "Technical University of Kenya",
    type: "Technical",
    county: "Nairobi",
    email: "placements@tukenya.ac.ke",
    phone: "+254 20 221 9926",
    website: "tukenya.ac.ke",
    contactPerson: "Eng. George Otieno",
    partnership: "Pending",
    accreditation: "Accredited",
    studentsAttached: 3,
    studentsCompleted: 8,
    since: "2023-01-10",
    address: "Haile Selassie Ave, Nairobi",
    notes: "New partnership under evaluation.",
  },
  {
    id: 9,
    code: "SCH-009",
    name: "Kenya Institute of Management",
    type: "College",
    county: "Nairobi",
    email: "programs@kim.ac.ke",
    phone: "+254 20 282 2000",
    website: "kim.ac.ke",
    contactPerson: "Ms. Faith Mutua",
    partnership: "Active",
    accreditation: "Accredited",
    studentsAttached: 7,
    studentsCompleted: 19,
    since: "2021-05-22",
    address: "Luther Plaza, Nairobi",
    notes: "Management and admin interns.",
  },
  {
    id: 10,
    code: "SCH-010",
    name: "Rift Valley Technical Training Institute",
    type: "TVET",
    county: "Uasin Gishu",
    email: "principal@rvtti.ac.ke",
    phone: "+254 53 206 3355",
    website: "rvtti.ac.ke",
    contactPerson: "Mr. Joseph Kimutai",
    partnership: "Inactive",
    accreditation: "Provisional",
    studentsAttached: 0,
    studentsCompleted: 5,
    since: "2022-08-14",
    address: "Eldoret, Uasin Gishu",
    notes: "Provisional accreditation under review.",
  },
];

const COUNTIES: string[] = [
  "All Counties",
  "Nairobi",
  "Kiambu",
  "Kisumu",
  "Uasin Gishu",
  "Kisii",
];

const TYPES: string[] = [
  "All Types",
  "University",
  "Technical",
  "College",
  "TVET",
];

const PARTNERSHIP_STATUSES: PartnershipFilter[] = [
  "All",
  "Active",
  "Pending",
  "Inactive",
];

const PARTNERSHIP_ICONS: Record<Partnership, LucideIcon> = {
  Active: CheckCircle2,
  Pending: Clock3,
  Inactive: XCircle,
};

const PAGE_SIZE = 5;
const LOGO_TONES = ["logoA", "logoB", "logoC", "logoD", "logoE"];

/* ============================================================
   HELPERS
   ============================================================ */

function initials(name: string): string {
  return name
    .replace(/^(University of|University|Technical University of|The)\s+/i, "")
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
   PARTNERSHIP BADGE
   ============================================================ */

function PartnershipBadge({ status }: { status: Partnership }) {
  const Icon = PARTNERSHIP_ICONS[status] ?? Clock3;
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

function SchoolsStats({
  schools,
  loading,
}: {
  schools: SchoolRecord[];
  loading: boolean;
}) {
  const counts = useMemo(
    () =>
      schools.reduce<SchoolCounts>(
        (acc, s) => {
          acc.total += 1;
          if (s.partnership === "Active") acc.active += 1;
          if (s.partnership === "Pending") acc.pending += 1;
          if (s.partnership === "Inactive") acc.inactive += 1;
          acc.attached += s.studentsAttached;
          acc.completed += s.studentsCompleted;
          return acc;
        },
        {
          total: 0,
          active: 0,
          pending: 0,
          inactive: 0,
          attached: 0,
          completed: 0,
        },
      ),
    [schools],
  );

  const cards: StatCard[] = [
    {
      key: "total",
      label: "Total Schools",
      value: counts.total,
      hint: "Registered partner institutions",
      icon: School,
      tone: "neutral",
    },
    {
      key: "active",
      label: "Active Partnerships",
      value: counts.active,
      hint: "Currently engaged",
      icon: CheckCircle2,
      tone: "active",
      delta: "+2 this term",
    },
    {
      key: "pending",
      label: "Pending",
      value: counts.pending,
      hint: "MOU under review",
      icon: Clock3,
      tone: "pending",
    },
    {
      key: "inactive",
      label: "Inactive",
      value: counts.inactive,
      hint: "Paused or expired",
      icon: XCircle,
      tone: "rejected",
    },
    {
      key: "attached",
      label: "Students Attached",
      value: counts.attached,
      hint: "Currently on attachment",
      icon: Users,
      tone: "approved",
    },
    {
      key: "completed",
      label: "Completed",
      value: counts.completed,
      hint: "Internships completed",
      icon: GraduationCap,
      tone: "completed",
    },
  ];

  if (loading) return <SkeletonStats />;

  return (
    <section className={styles.stats} aria-label="Schools statistics">
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

function SchoolsAnalytics({ schools }: { schools: SchoolRecord[] }) {
  const byType = useMemo(() => {
    const t: Record<string, number> = {};
    for (const s of schools) {
      t[s.type] = (t[s.type] ?? 0) + 1;
    }
    return Object.entries(t).sort((a, b) => b[1] - a[1]);
  }, [schools]);

  const byCounty = useMemo(() => {
    const t: Record<string, number> = {};
    for (const s of schools) {
      t[s.county] = (t[s.county] ?? 0) + 1;
    }
    return Object.entries(t).sort((a, b) => b[1] - a[1]);
  }, [schools]);

  const total = schools.length || 1;
  const active = schools.filter((s) => s.partnership === "Active").length;
  const activePct = Math.round((active / total) * 100);
  const maxCounty = Math.max(...byCounty.map(([, v]) => v), 1);

  return (
    <section className={styles.analytics} aria-label="Schools analytics">
      <article className={styles.card}>
        <header className={styles.cardHeader}>
          <h2 className={styles.cardTitle}>Institution Types</h2>
          <span className={styles.cardSubtle}>{total} schools</span>
        </header>

        <div className={styles.overview}>
          <div className={styles.overviewBars}>
            {byType.map(([type, count]) => {
              const pct = Math.round((count / total) * 100);
              return (
                <div key={type} className={styles.overviewRow}>
                  <div className={styles.overviewRowHead}>
                    <span className={styles.overviewRowLabel}>{type}</span>
                    <span className={styles.overviewRowValue}>
                      {count}{" "}
                      <span className={styles.overviewRowPct}>{pct}%</span>
                    </span>
                  </div>
                  <div className={styles.barTrack}>
                    <div
                      className={`${styles.barFill} ${styles.bar_approved}`}
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
          <h2 className={styles.cardTitle}>Schools by County</h2>
          <span className={styles.cardSubtle}>Distribution</span>
        </header>

        <div
          className={styles.trends}
          role="img"
          aria-label="Schools grouped by county"
        >
          {byCounty.map(([county, count]) => {
            const h = Math.max(6, Math.round((count / maxCounty) * 100));
            return (
              <div key={county} className={styles.trendCol}>
                <span className={styles.trendValue}>{count}</span>
                <div className={styles.trendBarTrack}>
                  <div
                    className={styles.trendBarFill}
                    style={{ height: `${h}%` }}
                  />
                </div>
                <span className={styles.trendLabel}>
                  {county.length > 8 ? county.slice(0, 8) + "…" : county}
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
    type: "mou",
    text: "MOU signed with Technical University of Kenya",
    time: "2 hours ago",
  },
  {
    id: 2,
    type: "students",
    text: "5 new students attached from University of Nairobi",
    time: "Yesterday",
  },
  {
    id: 3,
    type: "accreditation",
    text: "Rift Valley TTI accreditation set to provisional",
    time: "3 days ago",
  },
  {
    id: 4,
    type: "completed",
    text: "Kenyatta University completed 12 internships",
    time: "Last week",
  },
];

const ACTIVITY_ICONS: Record<ActivityType, LucideIcon> = {
  mou: FileText,
  students: Users,
  accreditation: Award,
  completed: GraduationCap,
};

function SchoolsActivityPanel() {
  return (
    <article className={styles.card}>
      <header className={styles.cardHeader}>
        <h2 className={styles.cardTitle}>Partnership Activity</h2>
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

const TOP_SCHOOLS: TopSchool[] = [
  { name: "University of Nairobi", completed: 68 },
  { name: "Kenyatta University", completed: 52 },
  { name: "JKUAT", completed: 44 },
  { name: "Strathmore University", completed: 34 },
];

function TopSchoolsPanel() {
  const max = Math.max(...TOP_SCHOOLS.map((s) => s.completed), 1);

  return (
    <article className={styles.card}>
      <header className={styles.cardHeader}>
        <h2 className={styles.cardTitle}>Top by Completed Internships</h2>
      </header>
      <ul className={styles.topList}>
        {TOP_SCHOOLS.map((s, i) => (
          <li key={s.name} className={styles.topItem}>
            <span className={styles.topRank}>{i + 1}</span>
            <div className={styles.topBody}>
              <p className={styles.topName}>{s.name}</p>
              <div className={styles.topBarTrack}>
                <div
                  className={styles.topBarFill}
                  style={{ width: `${(s.completed / max) * 100}%` }}
                />
              </div>
            </div>
            <span className={styles.topValue}>{s.completed}</span>
          </li>
        ))}
      </ul>
    </article>
  );
}

function QuickActionsPanel({ onAdd }: { onAdd: () => void }) {
  const actions: QuickAction[] = [
    {
      key: "add",
      label: "Add School",
      icon: Plus,
      primary: true,
      onClick: onAdd,
    },
    {
      key: "review",
      label: "Review MOUs",
      icon: ListChecks,
      onClick: () => {},
    },
    {
      key: "export",
      label: "Export Directory",
      icon: Download,
      onClick: () => {},
    },
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

function SchoolProfileDrawer({
  school,
  onClose,
}: {
  school: SchoolRecord | null;
  onClose: () => void;
}) {
  if (!school) return null;

  return (
    <div
      className={styles.drawerBackdrop}
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <aside
        className={styles.drawer}
        role="dialog"
        aria-modal="true"
        aria-labelledby="school-profile-heading"
      >
        <header className={styles.drawerHeader}>
          <div className={styles.drawerIdentity}>
            <span
              className={`${styles.avatar} ${styles.avatarLarge} ${styles.logoA}`}
            >
              {initials(school.name)}
            </span>
            <div>
              <h2 id="school-profile-heading" className={styles.drawerName}>
                {school.name}
              </h2>
              <p className={styles.drawerReg}>{school.code}</p>
            </div>
          </div>
          <button
            type="button"
            className={styles.iconBtn}
            onClick={onClose}
            aria-label="Close school profile"
          >
            <X size={18} aria-hidden="true" />
          </button>
        </header>

        <div className={styles.drawerBody}>
          <div className={styles.drawerStatusRow}>
            <PartnershipBadge status={school.partnership} />
            <span className={styles.drawerSupervisor}>
              Accreditation: <strong>{school.accreditation}</strong>
            </span>
          </div>

          <section className={styles.drawerSection}>
            <h3 className={styles.drawerSectionTitle}>Contact</h3>
            <ul className={styles.infoList}>
              <li>
                <User size={14} aria-hidden="true" />
                <span>{school.contactPerson}</span>
              </li>
              <li>
                <Mail size={14} aria-hidden="true" />
                <span>{school.email}</span>
              </li>
              <li>
                <Phone size={14} aria-hidden="true" />
                <span>{school.phone}</span>
              </li>
              <li>
                <Globe size={14} aria-hidden="true" />
                <span>{school.website}</span>
              </li>
            </ul>
          </section>

          <section className={styles.drawerSection}>
            <h3 className={styles.drawerSectionTitle}>Location</h3>
            <ul className={styles.infoList}>
              <li>
                <MapPin size={14} aria-hidden="true" />
                <span>{school.address}</span>
              </li>
              <li>
                <Building2 size={14} aria-hidden="true" />
                <span>{school.county} County</span>
              </li>
            </ul>
          </section>

          <section className={styles.drawerSection}>
            <h3 className={styles.drawerSectionTitle}>Engagement</h3>
            <div className={styles.metricGrid}>
              <div className={styles.metric}>
                <span className={styles.metricValue}>
                  {school.studentsAttached}
                </span>
                <span className={styles.metricLabel}>Attached</span>
              </div>
              <div className={styles.metric}>
                <span className={styles.metricValue}>
                  {school.studentsCompleted}
                </span>
                <span className={styles.metricLabel}>Completed</span>
              </div>
              <div className={styles.metric}>
                <span className={styles.metricValue}>
                  {new Date().getFullYear() -
                    new Date(school.since).getFullYear()}
                </span>
                <span className={styles.metricLabel}>Yrs partner</span>
              </div>
            </div>
            <p className={styles.metricFoot}>
              Partner since {formatDate(school.since)}
            </p>
          </section>

          {school.notes && (
            <section className={styles.drawerSection}>
              <h3 className={styles.drawerSectionTitle}>Notes</h3>
              <p className={styles.drawerNotes}>{school.notes}</p>
            </section>
          )}
        </div>

        <footer className={styles.drawerFooter}>
          <button
            type="button"
            className={styles.primaryBtn}
            onClick={() => {}}
          >
            Edit School
          </button>
          <button type="button" className={styles.ghostBtn} onClick={() => {}}>
            View Interns
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

function SchoolRow({
  school,
  onViewProfile,
}: {
  school: SchoolRecord;
  onViewProfile: (school: SchoolRecord) => void;
}) {
  const [menuOpen, setMenuOpen] = useState(false);
  const tone = LOGO_TONES[school.id % LOGO_TONES.length];

  const actions: RowAction[] = [
    {
      key: "view",
      label: "View Profile",
      onClick: () => onViewProfile(school),
    },
    { key: "interns", label: "View Interns", onClick: () => {} },
    { key: "edit", label: "Edit School", onClick: () => {} },
    { key: "mou", label: "Manage MOU", onClick: () => {} },
    { key: "export", label: "Download Documents", onClick: () => {} },
    { key: "delete", label: "Delete", danger: true, onClick: () => {} },
  ];

  return (
    <tr>
      <th scope="row" className={styles.schoolCell}>
        <span className={`${styles.avatar} ${styles[tone]}`} aria-hidden="true">
          {initials(school.name)}
        </span>
        <div className={styles.schoolMeta}>
          <span className={styles.schoolName}>{school.name}</span>
          <span className={styles.schoolType}>
            {school.type} · {school.county}
          </span>
        </div>
      </th>
      <td className={styles.mono}>{school.code}</td>
      <td>{school.contactPerson}</td>
      <td className={styles.mono}>{school.email}</td>
      <td className={styles.mono}>{school.phone}</td>
      <td className={styles.numCol}>{school.studentsAttached}</td>
      <td className={styles.numCol}>{school.studentsCompleted}</td>
      <td>
        <PartnershipBadge status={school.partnership} />
      </td>
      <td className={styles.actionsCol}>
        <div className={styles.rowMenu}>
          <button
            type="button"
            className={styles.iconBtn}
            aria-label={`Actions for ${school.name}`}
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
        <strong>{totalRows}</strong> schools
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

function SchoolsDirectory({
  schools,
  loading,
  onViewProfile,
}: {
  schools: SchoolRecord[];
  loading: boolean;
  onViewProfile: (school: SchoolRecord) => void;
}) {
  const [search, setSearch] = useState("");
  const [county, setCounty] = useState("All Counties");
  const [type, setType] = useState("All Types");
  const [partnership, setPartnership] = useState<PartnershipFilter>("All");
  const [sort, setSort] = useState<SortKey>("name-asc");
  const [page, setPage] = useState(1);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    let out = schools.filter((s) => {
      const matchesSearch =
        !q ||
        [s.name, s.code, s.email, s.contactPerson, s.county, s.type]
          .join(" ")
          .toLowerCase()
          .includes(q);
      const matchesCounty = county === "All Counties" || s.county === county;
      const matchesType = type === "All Types" || s.type === type;
      const matchesPartnership =
        partnership === "All" || s.partnership === partnership;
      return (
        matchesSearch && matchesCounty && matchesType && matchesPartnership
      );
    });

    out = [...out].sort((a, b) => {
      switch (sort) {
        case "name-desc":
          return b.name.localeCompare(a.name);
        case "attached-desc":
          return b.studentsAttached - a.studentsAttached;
        case "completed-desc":
          return b.studentsCompleted - a.studentsCompleted;
        case "since-desc":
          return new Date(b.since).getTime() - new Date(a.since).getTime();
        default:
          return a.name.localeCompare(b.name);
      }
    });

    return out;
  }, [schools, search, county, type, partnership, sort]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const currentPage = Math.min(page, totalPages);
  const start = (currentPage - 1) * PAGE_SIZE;
  const pageRows = filtered.slice(start, start + PAGE_SIZE);

  const resetPage = () => setPage(1);

  return (
    <section className={styles.directory} aria-label="Schools directory">
      <header className={styles.directoryHeader}>
        <div>
          <h2 className={styles.cardTitle}>Schools Directory</h2>
          <p className={styles.cardSubtle}>
            View and manage partner institutions.
          </p>
        </div>

        <div className={styles.directoryControls}>
          <label className={styles.searchBox}>
            <Search size={15} aria-hidden="true" />
            <span className={styles.visuallyHidden}>Search schools</span>
            <input
              type="search"
              placeholder="Search name, code, contact..."
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                resetPage();
              }}
            />
          </label>

          <select
            className={styles.select}
            value={county}
            onChange={(e) => {
              setCounty(e.target.value);
              resetPage();
            }}
            aria-label="Filter by county"
          >
            {COUNTIES.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>

          <select
            className={styles.select}
            value={type}
            onChange={(e) => {
              setType(e.target.value);
              resetPage();
            }}
            aria-label="Filter by type"
          >
            {TYPES.map((t) => (
              <option key={t} value={t}>
                {t}
              </option>
            ))}
          </select>

          <select
            className={styles.select}
            value={partnership}
            onChange={(e) => {
              setPartnership(e.target.value as PartnershipFilter);
              resetPage();
            }}
            aria-label="Filter by partnership"
          >
            {PARTNERSHIP_STATUSES.map((s) => (
              <option key={s} value={s}>
                {s === "All" ? "All Partnerships" : s}
              </option>
            ))}
          </select>

          <select
            className={styles.select}
            value={sort}
            onChange={(e) => setSort(e.target.value as SortKey)}
            aria-label="Sort schools"
          >
            <option value="name-asc">Name (A–Z)</option>
            <option value="name-desc">Name (Z–A)</option>
            <option value="attached-desc">Most attached</option>
            <option value="completed-desc">Most completed</option>
            <option value="since-desc">Newest partnership</option>
          </select>
        </div>
      </header>

      {loading ? (
        <SkeletonTable rows={5} />
      ) : pageRows.length === 0 ? (
        <EmptyState
          icon={SearchX}
          title="No schools found"
          message="Try changing your search or filters."
        />
      ) : (
        <>
          <div className={styles.tableScroll}>
            <table className={styles.table}>
              <caption className={styles.visuallyHidden}>
                Partner institutions and their engagement metrics
              </caption>
              <thead>
                <tr>
                  <th scope="col">School</th>
                  <th scope="col">Code</th>
                  <th scope="col">Contact Person</th>
                  <th scope="col">Email</th>
                  <th scope="col">Phone</th>
                  <th scope="col" className={styles.numCol}>
                    Attached
                  </th>
                  <th scope="col" className={styles.numCol}>
                    Completed
                  </th>
                  <th scope="col">Partnership</th>
                  <th scope="col" className={styles.actionsCol}>
                    <span className={styles.visuallyHidden}>Actions</span>
                  </th>
                </tr>
              </thead>
              <tbody>
                {pageRows.map((s) => (
                  <SchoolRow
                    key={s.id}
                    school={s}
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

export default function SchoolsPage() {
  const [drawerSchool, setDrawerSchool] = useState<SchoolRecord | null>(null);
  const loading = false;

  const openAddSchool = () => {
    // TODO: wire to Add School modal + Supabase insert
  };

  return (
    <div className={styles.page}>
      <header className={styles.pageHeader}>
        <div className={styles.headerLeft}>
          <p className={styles.breadcrumb}>Dashboard / Schools</p>
          <h1 className={styles.heading}>Schools Management</h1>
          <p className={styles.description}>
            Manage partner institutions, contacts and internship pipelines.
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
            onClick={openAddSchool}
          >
            <Plus size={16} aria-hidden="true" />
            <span>Add School</span>
          </button>
        </div>
      </header>

      <SchoolsStats schools={SCHOOLS} loading={loading} />
      <SchoolsAnalytics schools={SCHOOLS} />

      <SchoolsDirectory
        schools={SCHOOLS}
        loading={loading}
        onViewProfile={setDrawerSchool}
      />

      <section className={styles.sideGrid} aria-label="School updates">
        <SchoolsActivityPanel />
        <TopSchoolsPanel />
        <QuickActionsPanel onAdd={openAddSchool} />
      </section>

      <SchoolProfileDrawer
        school={drawerSchool}
        onClose={() => setDrawerSchool(null)}
      />
    </div>
  );
}
