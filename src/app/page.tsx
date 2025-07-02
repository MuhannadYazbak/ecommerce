import Image from "next/image";

export default function Home() {
  return (
    <div>
      <h1 className="align-content:center text-color-red-500">TechMart</h1>
      <h2>Welcome Customer</h2>
      <p>TechMart is your ultimate E-commerce site supplying you with all the gadgets and electronic devies in one place</p>
      <p>please <a style ={{color:"blue", fontStyle:'italic'}}
       href="/login">login</a> or <a style ={{color:"blue", fontStyle:'italic'}} href="/register">register</a></p>
    </div>
  )
}
