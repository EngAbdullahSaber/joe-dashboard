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
  Files,
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
  { title: "Uploaded Images", icon: Files, href: "/uploaded-images" },
];

// Menu configuration (role branching previously crashed SSR via localStorage)
export const menusConfig = {
  mainNav: [],

  sidebarNav: {
    modern: adminMenu,
    classic: adminMenu,
  },
};

// Types based on menu structure
export type ModernNavType = (typeof menusConfig.sidebarNav.modern)[number];
export type ClassicNavType = (typeof menusConfig.sidebarNav.classic)[number];
export type MainNavType = (typeof menusConfig.mainNav)[number];
