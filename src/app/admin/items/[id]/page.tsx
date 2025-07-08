import AdminEditItem from "@/components/admin/AdminEditItem";

export const metadata = {
  title: "TechMart Admin | Edit Item",
  description: "TechMart admin's view and update current item",
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
    title: "TechMart Admin | Edit Item",
    description: "Manage product, view or update the cuttent product",
    url: "https://techmart.com/admin/items/[id]",
    siteName: "TechMart",
  },
  alternates: {
    canonical: "https://techmart.com/admin/items/[id]"
  }
};

export default function AdminEditItemPage(){
  return <AdminEditItem />
}