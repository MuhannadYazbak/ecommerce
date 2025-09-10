import AdminByFullName from '@/components/admin/AdminByFullName';

export const metadata = {
  title: "TechMart | Admin - by FullName Dashboard",
  description: "Admin new dashboard, by user's full name",
  keywords: [
    "TechMart",
    "Admin Dashboard",
    "Power BI",
    "Tableau",
  ],
  robots: {
    index: true,
    follow: true
  },
  openGraph: {
    title: "TechMart | Admin - by FullName Dashboard",
    description: "Admin new dashboard, by user's full name",
    url: "https://techmart.com/admin/byFullname",
    siteName: "TechMart"
  },
  alternates: {
    canonical: "https://techmart.com/admin/byFullname"
  }
};

export default function AdminByFullNamePage() {
  return <AdminByFullName />;
}