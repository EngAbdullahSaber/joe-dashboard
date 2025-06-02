

import { ChevronDown, ChevronRight, ChevronUp, CheckCircle2, XCircle, HelpCircle, Timer } from 'lucide-react';
export const labels = [
  {
    value: "bug",
    label: "Bug",
  },
  {
    value: "feature",
    label: "Feature",
  },
  {
    value: "documentation",
    label: "Documentation",
  },
]

export const statuses = [
  {
    value: "backlog",
    label: "Backlog",
    icon: HelpCircle,
  },
  {
    value: "todo",
    label: "Todo",
    icon: CheckCircle2,
  },
  {
    value: "in progress",
    label: "In Progress",
    icon: Timer,
  },
  {
    value: "done",
    label: "Done",
    icon: CheckCircle2,
  },
  {
    value: "canceled",
    label: "Canceled",
    icon: XCircle,
  },
]

export const priorities = [
  {
    label: "Low55",
    value: "low",
    icon: ChevronDown,
  },
  {
    label: "Medium55",
    value: "medium5",
    icon: ChevronRight,
  },
  {
    label: "High",
    value: "high",
    icon: ChevronUp,
  },
]

export const Models = [
  {
    label: "Cordless Vacuum",
    value: "Cordless Vacuum",
    icon: ChevronDown,
  },
  {
    label: "HR7776/90",
    value: "HR7776/90",
    icon: ChevronRight,
  },
  {
    label: "AC3420/10",
    value: "AC3420/10",
    icon: ChevronUp,
  },
]
