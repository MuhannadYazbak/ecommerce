import OrderHistory from "@/components/orders/OrdersHistory";
export const metadata = {
  title: "TechMart | Order History",
  description: "View your past orders and purchase details",
  keywords: ["orders", "order history", "TechMart", "purchase records"],
  robots: {
    index: true,
    follow: true
  },
  openGraph: {
  title: "TechMart | Order History",
  description: "Track your purchases and past orders",
  url: "https://techmart.com/orders",
  siteName: "TechMart",
}
};

export default function OrdersHistoryPage() {
  return <OrderHistory />
}