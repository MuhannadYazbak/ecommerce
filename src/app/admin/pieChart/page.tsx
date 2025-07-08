import AdminPieChart from "@/components/admin/AdminPieChart";

export const metadata = {
  title: "TechMart Admin | Pie Chart",
  description: "TechMart admin's Pie chart, analyze purshased items in a given date",
  keywords: [
    "admin dashboard",
    "TechMart inventory",
    "pie chart",
    "ecommerce analytics",
    "admin panel",
    "store management"
  ],
  robots: {
    index: false, // prevent search engines from indexing admin page
    follow: false
  },
  openGraph: {
    title: "TechMart Admin | Pie Chart",
    description: "Analyze checkout products in a given date",
    url: "https://techmart.com/admin/pie",
    siteName: "TechMart",
  },
  alternates: {
    canonical: "https://techmart.com/admin/pie"
  }
};

export default function AdminPieChartPage(){
  return <AdminPieChart />
}