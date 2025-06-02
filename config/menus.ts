import {
  Settings,
  About,
  Join,
  Offers,
  Department,
  Projects,
  TeamMermber,
  Blogs,
  Home,
  Partner,
  ContactUs,
  Career,
  Services,
} from "@/components/svg";

export interface MenuItemProps {
  title: string;
  icon: any;
  href?: string;
  child?: MenuItemProps[];
  megaMenu?: MenuItemProps[];
  multi_menu?: MenuItemProps[];
  nested?: MenuItemProps[];
  onClick: () => void;
}

// Fetch role from localStorage
const role = localStorage.getItem("role");
console.log("Role:", role);

// Define menu configurations for admin and user roles
const adminMenu = [
  // { title: "Dashboard", icon: Dashboard, href: "/dashboard" },
  // { title: "User", icon: Property, href: "/users" },
  { title: "Home Page", icon: Home, href: "/home-page" },
  { title: "About Us Page", icon: About, href: "/about-us" },
  { title: "Join Us Page", icon: Join, href: "/join-us" },
  { title: "Projects Page", icon: Projects, href: "/projects" },
  { title: "Blogs Page", icon: Blogs, href: "/blogs" },
  { title: "Department", icon: Department, href: "/departmens" },
  { title: "Services", icon: Services, href: "/services" },
  // { title: "Offers", icon: Offers, href: "/offers" },
  // { title: "Career", icon: Career, href: "/career" },
  { title: "Team Member", icon: TeamMermber, href: "/team-members" },
  { title: "Partner", icon: Partner, href: "/partner" },
  { title: "Settings", icon: Settings, href: "/settings" },
  { title: "Contact Us", icon: ContactUs, href: "/contact-us" },
];

// Conditional menu configuration based on the role
export const menusConfig = {
  mainNav: [],

  sidebarNav: {
    modern: role === "admin" ? adminMenu : adminMenu, // Admin menu for admin role, user menu otherwise
    classic: role === "admin" ? adminMenu : adminMenu, // Same logic for classic menu
  },
};

// Types based on menu structure
export type ModernNavType = (typeof menusConfig.sidebarNav.modern)[number];
export type ClassicNavType = (typeof menusConfig.sidebarNav.classic)[number];
export type MainNavType = (typeof menusConfig.mainNav)[number];
