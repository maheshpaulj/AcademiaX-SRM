"use client";
import React from "react";
import Sidebar from "./Sidebar";
import Header from "./Header";
import { useSidebar, useUser } from "@/lib/zustand";
import { useWindow } from "@/lib/hook";
import { Attendance, Dayorder, Marks, TimetableData, User } from "@/Types/type";
import { X } from "lucide-react";

const AppLayout = ({
  children,
  data,
  version,
}: {
  children: React.ReactNode;
  version: string;
  data: {
    user: User;
    marks: Marks;
    attendance: Attendance;
    timetable: { data: TimetableData };
    dayorder: Dayorder;
    NewVersion: string;
  };
}) => {
  const isMobile = useWindow();
  const { isOpen } = useSidebar();
  const { NewVersion } = useUser();
  const [update, setUpdate] = React.useState(false);

  React.useEffect(() => {
    if (localStorage.getItem("version") !== version) setUpdate(true);
  }, [version]);

  React.useEffect(() => {
    useUser.setState({ user: data.user });
    useUser.setState({ marks: data.marks });
    useUser.setState({ attendance: data.attendance });
    useUser.setState({ timetable: data.timetable.data });
    useUser.setState({ dayorder: data.dayorder });
    if (update) {
      useUser.setState({ NewVersion: true });
      localStorage.setItem("version", version);
    }
  }, [data, update, version]);
  React.useEffect(() => {
    if (isMobile === undefined) return;
    if (isMobile) {
      useSidebar.setState({ isOpen: false });
    }
  }, [isMobile]);
  if (isMobile === undefined) return null;

  return (
    <div className="flex h-screen">
      {NewVersion && <Updates />}
      <Sidebar />
      <div className="flex-1 h-screen flex flex-col ">
        <Header />
        <div
          className={`flex-1 mt-[50px] md:overflow-y-auto ${isOpen && !isMobile ? "pl-[250px]" : ""} duration-300 transition-all`}
        >
          {children}
        </div>
      </div>
    </div>
  );
};

export default AppLayout;

const Updates = () => {
  return (
    <div className="fixed w-screen h-screen z-50 items-center justify-center flex bg-black/50 top-0 left-0">
      <div className="mx-4 w-[500px] h-[300px] bg-background rounded-lg shadow-foreground/10 p-5 border border-foreground/10">
        <div className="flex items-center justify-between">
          <p className="text-2xl  font-semibold">Updates v1.0.2</p>
          <X
            onClick={() => useUser.setState({ NewVersion: false })}
            className="cursor-pointer p-0.5 border border-foreground/10 rounded "
            size={30}
          />
        </div>
        <div className="flex flex-col gap-2 mt-5">
          <div className="flex gap-2 items-center">
            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
            <p>Fixed Time Table UI</p>
          </div>
          <div className="flex gap-2 items-center">
            <div className="w-2 h-2  bg-green-500 rounded-full"></div>
            <p>Next class will be show now</p>
          </div>
          <div className="flex gap-2 items-center">
            <div className="w-2 h-2  bg-green-500 rounded-full"></div>
            <p>Current class will be higlighten</p>
          </div>
        </div>
      </div>
    </div>
  );
};
