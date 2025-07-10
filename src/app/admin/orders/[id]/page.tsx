import OrderEdit from "@/components/admin/AdminOrderEdit";

export const metadata = {
  title: "TechMart Admin | Order Edit",
  description: "TechMart admin's order update",
  keywords: [
    "admin dashboard",
    "Order Edit",
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
    title: "TechMart Admin | Add Item",
    description: "Admin Order Update status",
    url: "https://techmart.com/admin/orders",
    siteName: "TechMart",
  },
  alternates: {
    canonical: "https://techmart.com/admin/orders"
  }
};

export default function AdminOrderEditPage(){
  return <OrderEdit />
}