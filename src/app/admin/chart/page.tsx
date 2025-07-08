import AdminBarChart from "@/components/admin/AdminBarChart";

export const metadata = {
  title: "TechMart Admin | Bar Chart",
  description: "TechMart admin's bar chart, number of checked out orders per date",
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
    title: "TechMart Admin | Bar Chart",
    description: "Analyze checkout pattern by bar chart",
    url: "https://techmart.com/admin/chart",
    siteName: "TechMart",
  },
  alternates: {
    canonical: "https://techmart.com/admin/chart"
  }
};

export default function AdminBarChartPage(){
  return <AdminBarChart />
}