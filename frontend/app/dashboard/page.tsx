'use client';
import { useSession } from "next-auth/react";

const Page = () => {
  const session = useSession();
  return (
    <>
      <h1>Dashboard</h1>
      <pre></pre>
    </>
  );
};

export default Page;
