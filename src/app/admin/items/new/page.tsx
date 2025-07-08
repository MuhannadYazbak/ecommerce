import AddNewItem from "@/components/admin/AdminNewItem";

export const metadata = {
  title: "TechMart Admin | Add Item",
  description: "TechMart admin's add new item",
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
    title: "TechMart Admin | Add Item",
    description: "Manage products and analyze store performance through the TechMart admin dashboard.",
    url: "https://techmart.com/admin/items",
    siteName: "TechMart",
  },
  alternates: {
    canonical: "https://techmart.com/admin/items"
  }
};

export default function AdminNewItemPage(){
  return <AddNewItem />
}