"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import {
  motion,
  useReducedMotion,
  animate,
  type Variants,
} from "framer-motion";
import {
  FileText,
  Mail,
  Users,
  MessageSquare,
  FileEdit,
  Newspaper,
  Image,
  ArrowUpRight,
  ArrowDownRight,
  ChevronRight,
  Send,
  FileBarChart,
  CalendarCheck,
  type LucideIcon,
} from "lucide-react";
import { createClient } from "../../supabase/client";
import {
  ATTENTION_CARDS,
  ATTENTION_LAST_OPENED_EVENT,
  type AttentionCardConfig,
} from "../../(component)/recent-messages/attention-data";
import styles from "./styles.module.css";

type Accent =
  | "blue"
  | "green"
  | "purple"
  | "orange"
  | "cyan"
  | "indigo"
  | "amber"
  | "red";
type TrendDirection = "up" | "down" | "neutral";

interface StatItem {
  id: string;
  icon: LucideIcon;
  value: number;
  label: string;
  secondary: string;
  trendDirection: TrendDirection;
  accent: Accent;
  href: string;
  progress?: number;
  showDocumentCounts?: boolean;
  totalDocuments?: number | null;
  unopenedDocuments?: number | null;
  onClick?: () => void;
}

const stats: StatItem[] = [
  {
    id: "minutes",
    icon: FileText,
    value: 24,
    label: "Minutes Received",
    secondary: "receive and share minutes from other offices",
    trendDirection: "up",
    accent: "blue",
    href: "/minutes",
  },
  {
    id: "incoming-correspondence",
    icon: Mail,
    value: 18,
    label: "Incoming Correspondence",
    secondary: "receive correspondence from other offices",
    trendDirection: "neutral",
    accent: "green",
    href: "/incoming-correspondence",
  },
  {
    id: "outgoing-correspondence",
    icon: Send,
    value: 7,
    label: "Outgoing Correspondence",
    secondary: "send correspondence to other offices",
    trendDirection: "neutral",
    accent: "purple",
    href: "/outgoing-correspondence",
    progress: 62,
  },
  {
    id: "monthly-reports",
    icon: FileBarChart,
    value: 5,
    label: "Monthly-Reports",
    secondary: "Next at 2:00 PM",
    trendDirection: "neutral",
    accent: "orange",
    href: "/monthly-report",
  },
  {
    id: "annual-reports",
    icon: Users,
    value: 5,
    label: "receive and share annual reports",
    secondary: "Next at 2:00 PM",
    trendDirection: "neutral",
    accent: "orange",
    href: "/annual-report",
  },
  {
    id: "quarterly-reports",
    icon: CalendarCheck,
    value: 5,
    label: "receive and share quarterly reports",
    secondary: "Next at 2:00 PM",
    trendDirection: "neutral",
    accent: "orange",
    href: "/quarterly-report",
  },
  {
    id: "chats",
    icon: MessageSquare,
    value: 11,
    label: "Unread Chats",
    secondary: "Team conversation and active threads",
    trendDirection: "up",
    accent: "cyan",
    href: "/recent-messages",
  },
  {
    id: "calendar",
    icon: CalendarCheck,
    value: 3,
    label: "Calendar of Events",
    secondary: "Confirmed",
    trendDirection: "neutral",
    accent: "indigo",
    href: "/pages/event-b",
  },
  {
    id: "memos",
    icon: FileEdit,
    value: 9,
    label: "Memos",
    secondary: "receive and share memos from other offices",
    trendDirection: "down",
    accent: "amber",
    href: "/memo",
  },
  {
    id: "feed",
    icon: Newspaper,
    value: 14,
    label: "Office Feed",
    secondary: "receive and share updates from other offices",
    trendDirection: "neutral",
    accent: "red",
    href: "/feed",
  },
  {
    id: "gallery",
    icon: Image,
    value: 14,
    label: "Gallery",
    secondary: "photos and albums from recent events",
    trendDirection: "neutral",
    accent: "red",
    href: "/pages/gallery-b",
  },
];

const trendIconMap = {
  up: ArrowUpRight,
  down: ArrowDownRight,
  neutral: null,
} as const;

const container: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.06 } },
};

const item: Variants = {
  hidden: { opacity: 0, y: 18 },
  show: { opacity: 1, y: 0, transition: { duration: 0.4, ease: "easeOut" } },
};

const MotionLink = motion.create(Link);

function StatValue({
  value,
  animateIn,
}: {
  value: number;
  animateIn: boolean;
}) {
  const nodeRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    if (!animateIn) return;
    const node = nodeRef.current;
    if (!node) return;

    const controls = animate(0, value, {
      duration: 1.1,
      ease: "easeOut",
      onUpdate(v) {
        node.textContent = Math.round(v).toString();
      },
    });

    return () => controls.stop();
  }, [value, animateIn]);

  if (!animateIn) return <span>{value}</span>;
  return <span ref={nodeRef}>0</span>;
}

function StatCard({
  icon: Icon,
  value,
  label,
  secondary,
  trendDirection,
  accent,
  href,
  progress,
  showDocumentCounts,
  totalDocuments,
  unopenedDocuments,
  onClick,
}: StatItem) {
  const prefersReducedMotion = useReducedMotion();
  const TrendIcon = trendIconMap[trendDirection];

  return (
    <MotionLink
      href={href}
      className={styles.card}
      data-accent={accent}
      aria-label={`${label}: ${value}. ${secondary}. View details`}
      variants={prefersReducedMotion ? undefined : item}
      whileHover={prefersReducedMotion ? undefined : { y: -6, scale: 1.025 }}
      whileTap={prefersReducedMotion ? undefined : { scale: 0.985 }}
      transition={{ duration: 0.25, ease: "easeOut" }}
      onClick={onClick}
    >
      <span className={styles.glow} aria-hidden="true" />

      <span className={styles.iconWrap}>
        <Icon size={20} strokeWidth={2} />
      </span>

      <span className={styles.value}>
        <StatValue value={value} animateIn={!prefersReducedMotion} />
      </span>

      <span className={styles.label}>{label}</span>

      {showDocumentCounts && (
        <span className={styles.documentCounts} aria-live="polite">
          <span>
            Total{" "}
            <strong>
              {totalDocuments === undefined
                ? "…"
                : totalDocuments === null
                  ? "—"
                  : totalDocuments}
            </strong>
          </span>
          <span>
            Unopened{" "}
            <strong>
              {unopenedDocuments === undefined
                ? "…"
                : unopenedDocuments === null
                  ? "—"
                  : unopenedDocuments}
            </strong>
          </span>
        </span>
      )}

      <span className={styles.secondary} data-trend={trendDirection}>
        {TrendIcon && <TrendIcon size={12} strokeWidth={2.5} />}
        {secondary}
      </span>

      {typeof progress === "number" && (
        <span className={styles.progressTrack} aria-hidden="true">
          <span
            className={styles.progressFill}
            style={{ width: `${progress}%` }}
          />
        </span>
      )}

      <span className={styles.footer}>
        View details <ChevronRight size={13} strokeWidth={2.5} />
      </span>
    </MotionLink>
  );
}

export default function StatsGrid() {
  const prefersReducedMotion = useReducedMotion();
  const [documentCounts, setDocumentCounts] = useState<
    Record<string, { total: number; unopened: number }>
  >({});
  const [documentCountErrors, setDocumentCountErrors] = useState<
    Record<string, boolean>
  >({});

  useEffect(() => {
    const supabase = createClient();

    const loadCount = async ({ id, table, key }: AttentionCardConfig) => {
      const lastOpenedAt = localStorage.getItem(key);

      const totalQuery = supabase
        .from(table)
        .select("id", { count: "exact", head: true });
      let unopenedQuery = supabase
        .from(table)
        .select("id", { count: "exact", head: true });

      if (lastOpenedAt) {
        unopenedQuery = unopenedQuery.gt("created_at", lastOpenedAt);
      }

      const [totalResult, unopenedResult] = await Promise.all([
        totalQuery,
        unopenedQuery,
      ]);

      if (totalResult.error || unopenedResult.error) {
        if (totalResult.error) {
          console.error(
            `Error loading total document count for ${id}:`,
            totalResult.error,
          );
        }
        if (unopenedResult.error) {
          console.error(
            `Error loading unopened document count for ${id}:`,
            unopenedResult.error,
          );
        }
        setDocumentCountErrors((current) => ({ ...current, [id]: true }));
        return;
      }

      setDocumentCounts((current) => ({
        ...current,
        [id]: {
          total: totalResult.count ?? 0,
          unopened: unopenedResult.count ?? 0,
        },
      }));
      setDocumentCountErrors((current) => ({ ...current, [id]: false }));
    };

    ATTENTION_CARDS.forEach((config) => {
      void loadCount(config);
    });

    const channels = ATTENTION_CARDS.map((config) =>
      supabase
        .channel(`${config.id}-attention-changes`)
        .on(
          "postgres_changes",
          { event: "*", schema: "public", table: config.table },
          () => void loadCount(config),
        )
        .subscribe(),
    );

    const onStorage = (event: StorageEvent) => {
      if (!event.key) return;
      const config = ATTENTION_CARDS.find((item) => item.key === event.key);
      if (!config) return;
      void loadCount(config);
    };

    const onAttentionLastOpened = (event: Event) => {
      const customEvent = event as CustomEvent<{ key?: string }>;
      const key = customEvent.detail?.key;
      if (!key) return;

      const config = ATTENTION_CARDS.find((item) => item.key === key);
      if (!config) return;
      void loadCount(config);
    };

    window.addEventListener("storage", onStorage);
    window.addEventListener(ATTENTION_LAST_OPENED_EVENT, onAttentionLastOpened);

    return () => {
      channels.forEach((channel) => {
        supabase.removeChannel(channel);
      });
      window.removeEventListener("storage", onStorage);
      window.removeEventListener(
        ATTENTION_LAST_OPENED_EVENT,
        onAttentionLastOpened,
      );
    };
  }, []);

  const handleOpenAttentionPage = (id: string, key: string) => {
    localStorage.setItem(key, new Date().toISOString());
    window.dispatchEvent(
      new CustomEvent(ATTENTION_LAST_OPENED_EVENT, { detail: { key } }),
    );
    setDocumentCounts((current) => {
      const counts = current[id];
      if (!counts) return current;

      return {
        ...current,
        [id]: { ...counts, unopened: 0 },
      };
    });
  };

  const cards = stats.map((stat) => {
    const attentionCard = ATTENTION_CARDS.find((card) => card.id === stat.id);

    if (!attentionCard) {
      return stat;
    }

    const counts = documentCounts[attentionCard.id];
    const hasCountError = documentCountErrors[attentionCard.id];
    const count = counts?.unopened ?? 0;

    return {
      ...stat,
      value: count,
      showDocumentCounts: true,
      totalDocuments: counts?.total ?? (hasCountError ? null : undefined),
      unopenedDocuments: counts?.unopened ?? (hasCountError ? null : undefined),
      secondary:
        count === 1
          ? `1 ${attentionCard.singular}`
          : `${count} ${attentionCard.plural}`,
      trendDirection: count > 0 ? ("up" as const) : ("neutral" as const),
      onClick: () =>
        handleOpenAttentionPage(attentionCard.id, attentionCard.key),
    };
  });

  return (
      <motion.div
        className={styles.grid}
        role="list"
        aria-label="Dashboard statistics"
        variants={prefersReducedMotion ? undefined : container}
        initial={prefersReducedMotion ? undefined : "hidden"}
        animate={prefersReducedMotion ? undefined : "show"}
      >
        {cards.map((stat) => (
          <div role="listitem" key={stat.id} className={styles.gridItem}>
            <StatCard {...stat} />
          </div>
        ))}
      </motion.div>
  );
}
