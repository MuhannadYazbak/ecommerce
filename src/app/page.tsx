'use client'

import Image from "next/image";
import { useState, useEffect} from 'react';
import { useRouter } from "next/navigation";
import { OrderItem } from "@/types/order";

export default function Home() {
  const router = useRouter();
  const [top5,setTop5] = useState<OrderItem[]>([]);
  const fetchTop5 = async () => {
  const res = await fetch('/api/top5');
  const json = await res.json();
  const parsed = json.flatMap((entry: any) => entry.items_json);
  setTop5(parsed.slice(0,5));
};
  // const fetchTop5 = async () => {
  //   const res = await fetch('/api/top5');
  //   console.log('res of top5 fetch ', res);
  //   setTop5(await res.json());
  // }
  useEffect (()=>{
    console.log('top5: ',top5);
    fetchTop5();
  },[])
  return (
    <div>
      <h1 className="align-content:center text-color-red-500">TechMart</h1>
      <h2>Welcome Customer</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-4">
        {top5.map((item,index) => (
          <div
            key={`${item.id}-${index}`}
            className="border rounded-lg shadow-md p-4 bg-white hover:shadow-xl transition"
          >
            <div className="aspect-[16/9] overflow-hidden">
              <Image
                width={500}
                height={500}
                loading="lazy"
                src={item.photo}
                alt={item.name}
                className="w-full h-35 object-contain bg-white p-2 rounded"
              />

            </div>
            <h2 className="text-xl font-semibold">{item.name}</h2>
            <p className="text-blue-600 font-bold text-lg">₪{item.price}</p>
          </div>
        ))}
      </div>
      <p>TechMart is your ultimate E-commerce site supplying you with all the gadgets and electronic devies in one place</p>
      <p>please <a style ={{color:"blue", fontStyle:'italic'}}
       href="/login">login</a> or <a style ={{color:"blue", fontStyle:'italic'}} href="/register">register</a></p>
    </div>
  )
}
