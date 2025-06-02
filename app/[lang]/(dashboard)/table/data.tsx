import {
  ChevronDown,
  ChevronRight,
  ChevronUp,
  CheckCircle2,
  XCircle,
  HelpCircle,
  Timer,
} from "lucide-react";
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
];

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
];

export const priorities = [
  {
    label: "Low",
    value: "low",
    icon: ChevronDown,
  },
  {
    label: "Medium",
    value: "medium",
    icon: ChevronRight,
  },
  {
    label: "Highb",
    value: "high",
    icon: ChevronUp,
  },
];

export const Role = [
  {
    label: "Admin",
    value: "Admin",
    icon: ChevronDown,
  },
  {
    label: "Admin ",
    value: "Admin ",
    icon: ChevronRight,
  },
  {
    label: "user",
    value: "user",
    icon: ChevronUp,
  },
];

export const GENDER = [
  {
    label: "Male",
    value: "Male",
    icon: ChevronDown,
  },
  {
    label: "Female",
    value: "Female",
    icon: ChevronRight,
  },
];
