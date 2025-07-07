import LoggedInHome from '@/components/home/Home';

export const metadata = {
  title: "TechMart | Welcome Back",
  description: "Your personalized TechMart dashboard with top picks, saved items, and new deals just for you.",
};

export default function HomePage() {
  return <LoggedInHome />;
}