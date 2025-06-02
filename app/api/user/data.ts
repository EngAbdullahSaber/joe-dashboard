import avatar3 from "@/public/images/avatar/avatar-3.jpg";
export const user = [
  {
    id: 1,
    name: "admin",
    image: avatar3,
    password: "password",
    email: "admin@admin.com",
    resetToken: null,
    resetTokenExpiry: null,
    profile: null,
  },
  {
    id: 1,
    name: "user",
    image: avatar3,
    password: "password",
    email: "user@user.com",
    resetToken: null,
    resetTokenExpiry: null,
    profile: null,
  },
];

export type User = (typeof user)[number];
