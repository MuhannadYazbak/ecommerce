import AdminOrderslist from "@/components/admin/AdminOrderslist";

export const metadata = {
  title: "TechMart Admin | Orders List",
  description: "TechMart admin's table of all orders",
  keywords: [
    "admin dashboard",
    "TechMart inventory",
    "bar chart",
    "ecommerce analytics",
    "admin panel",
    "store management"
  ],
  robots: {
    index: false, // prevent search engines from indexing admin page
    follow: false
  },
  openGraph: {
    title: "TechMart Admin | Orders List",
    description: "Analyze Orders in a tableview",
    url: "https://techmart.com/admin/orders-list",
    siteName: "TechMart",
  },
  alternates: {
    canonical: "https://techmart.com/admin/orders-list"
  }
};

export default function AdminOrderslistPage(){
  return <AdminOrderslist />
}