import LoggedInHome from '@/components/home/Home';

export const metadata = {
  title: "TechMart | Your Smart Shopping Dashboard",
  description: "Welcome back to TechMart! Explore top tech picks, manage your wishlist, and discover fresh deals tailored just for you.",
  keywords: [
    "TechMart dashboard",
    "personalized shopping",
    "wish list",
    "tech deals",
    "user profile",
    "best tech products"
  ],
  robots: {
    index: true,
    follow: true
  },
  openGraph: {
    title: "TechMart | Dashboard",
    description: "Discover personalized picks and exclusive deals on your TechMart home dashboard.",
    url: "https://techmart.com/home",
    siteName: "TechMart"
  },
  alternates: {
    canonical: "https://techmart.com/home"
  }
};

export default function HomePage() {
  return <LoggedInHome />;
}