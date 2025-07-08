import AdminDashboard from "@/components/admin/AdminDashboard";

export const metadata = {
  title: "TechMart Admin | Product Management Dashboard",
  description: "Access the TechMart admin dashboard to manage inventory, analyze data, and oversee store operations.",
  keywords: [
    "admin dashboard",
    "TechMart inventory",
    "manage products",
    "ecommerce analytics",
    "admin panel",
    "store management"
  ],
  robots: {
    index: false, // prevent search engines from indexing admin page
    follow: false
  },
  openGraph: {
    title: "TechMart Admin | Dashboard",
    description: "Manage products and analyze store performance through the TechMart admin dashboard.",
    url: "https://techmart.com/admin/items",
    siteName: "TechMart",
  },
  alternates: {
    canonical: "https://techmart.com/admin/items"
  }
};

export default function AdminDashboardPage(){
  return <AdminDashboard />
}