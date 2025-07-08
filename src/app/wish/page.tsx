import WishList from "@/components/wish/Wishlist";

export const metadata = {
  title: "TechMart | Your Wishlist",
  description: "View and manage the products you've saved at TechMart",
  keywords: ["wishlist", "TechMart", "saved items", "favorites", "shopping list"],
  robots: {
    index: true,
    follow: true
  },
  openGraph: {
    title: "TechMart | Wishlist",
    description: "Your personal wishlist at TechMart",
    url: "https://techmart.com/wish",
    siteName: "TechMart",
  },
  alternates: {
    canonical: "https://techmart.com/wish"
  }
};

export default function WishListPage(){
  return <WishList />
}