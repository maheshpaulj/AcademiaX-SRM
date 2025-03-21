import React, { Suspense } from "react";
import AppLayout from "./components/AppLayout";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import Button from "./components/Button";

async function fetchdata() {
  const token = (await cookies()).get("token")?.value;
  if (!token) {
    return redirect("/auth/logout");
  }
  const data = await fetch(`${process.env.NEXT_PUBLIC_DOMAIN}/api/getdata`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      cookie: `token=${token}`,
    },
  });

  if (data.ok) {
    return await data.json();
  }
}

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <Suspense
      fallback={
        <div className="w-screen h-screen flex justify-center items-center ">
          Loading...
        </div>
      }
    >
      <Main>{children}</Main>
    </Suspense>
  );
}

async function Main({ children }: { children: React.ReactNode }) {
  const data = await fetchdata();
  console.log(data);
  if (!data) {
    return (
      <div className="w-screen h-screen flex justify-center items-center  overflow-hidden">
        <div className="flex flex-col items-center gap-4 ">
          <p className="text-lg">Unable to get your details </p>
          <Button />
        </div>
      </div>
    );
  }

  return <AppLayout data={data}>{children}</AppLayout>;
}
