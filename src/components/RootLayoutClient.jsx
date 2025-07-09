"use client";
import Header from "./Header";
import Footer from "./Footer";
import WhatsappFloat from "./WhatsappFloat";
import AdminPanel from "./AdminPanel";
import { usePathname } from "next/navigation";

export default function RootLayoutClient({ children }) {
  const pathname = usePathname();
  const isAdmin = pathname.startsWith("/admin");
  return (
    <>
      {!isAdmin && <Header />}
      {children}
      {!isAdmin && <Footer />}
      {!isAdmin && <WhatsappFloat />}
      {!isAdmin && <AdminPanel />}
    </>
  );
} 