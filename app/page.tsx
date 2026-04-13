import Link from "next/link";

export default function Home() {
  return (
    <div className=" h-screen bg-[#000000]">
      <Link className="text-white bg-amber-700 px-4 py-1" href="/dashboard">
        Go to Dashboard
      </Link>
    </div>
  );
}
