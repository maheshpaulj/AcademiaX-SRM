"use client";
import React from "react";
import { TimeInRange } from "./components/TimeInRange";
import {
  BookOpen,
  CalendarClock,
  ChevronRight,
  Clock8,
  MapPin,
  User,
} from "lucide-react";
import { TimetableData } from "@/Types/type";
import { useUser } from "@/lib/zustand";
import Error from "../components/Error";

const Page = () => {
  const [mount, setMount] = React.useState(false);
  React.useEffect(() => {
    if (typeof window === "undefined") return;
    setMount(true);
  }, []);
  const { timetable, attendance, dayorder } = useUser();
  if (timetable === null) return <Error error="Timetable not found" />;
  if (attendance === null)
    return (
      <Error
        error="Attendance not
  found"
      />
    );
  if (dayorder === null) return <Error error="Day order not found" />;
  const getCurrentCourse = (currentTime: Date, dayOrder: string) => {
    for (const key in (timetable as TimetableData)[dayOrder]) {
      const [startTime, endTime] = key.split(" - ");
      const time = TimeInRange(startTime, endTime);
      if (time) {
        const currentClass = `${startTime} - ${endTime}`;

        return currentClass.toString();
      }
    }
  };

  const dayOrder =
    dayorder.do !== "N" ? (Number(dayorder?.do) - 1).toString() : "6";
  const currentTime = new Date();
  const currentClass =
    dayOrder !== "6" ? getCurrentCourse(currentTime, dayOrder) : null;
  const Class =
    dayOrder !== "6"
      ? timetable[dayOrder][
          currentClass as keyof (typeof timetable)[typeof dayOrder]
        ]
      : null;
  const faculty = Class
    ? attendance.find((item) => Class.code === item.code)
    : null;
  const todayClass = dayOrder !== "6" ? timetable[dayOrder] : null;
  return (
    <div className="mx-auto max-w-7xl h-full ">
      <div className="grid grid=cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 py-10  px-5  h-full">
        <div
          className={`h-[300px] p-8 border border-foreground/15  rounded-lg flex flex-col bg-foreground/5 ${mount ? "translate-x-0 opacity-100" : " translate-y-20 opacity-0"} transition-all duration-500 `}
        >
          <div className="flex items-center gap-4 ">
            {" "}
            <Clock8 size={30} className="stroke-orange-300" />
            <p className="text-2xl text-orange-500 font-semibold">
              Current Class
            </p>
          </div>
          {Class ? (
            <div className="h-full flex   flex-col gap-4 mt-5">
              <p className="text-xl">{Class.title}</p>
              <div className="flex items-center gap-2 text-md text-foreground/50">
                <p>{Class.code}</p>
                <span>-</span>
                <p>{Class.type}</p>
              </div>
              <div className="flex items-center gap-2 text-md text-blue-500">
                <MapPin size={20} />
                <p className="text-md">{Class.room}</p>
              </div>
              <div className="flex items-center gap-2 text-md text-blue-500">
                <User size={20} />
                <p>{faculty?.faculty}</p>
              </div>
            </div>
          ) : (
            <div className="h-full flex items-center  justify-center flex-col gap-6 ">
              <CalendarClock size={50} className="stroke-blue-500" />
              <p className="text-blue-500">No class in progress right now</p>
            </div>
          )}
        </div>
        <div
          className={`h-[300px] p-8 border border-foreground/15  rounded-lg flex flex-col bg-foreground/5  ${mount ? "translate-x-0 opacity-100" : " translate-y-20 opacity-0"} transition-all duration-500 delay-150 `}
        >
          <div className="flex items-center gap-4 ">
            {" "}
            <ChevronRight size={30} className="stroke-orange-300" />
            <p className="text-2xl text-orange-500 font-semibold">Next Class</p>
          </div>
          {Class ? (
            <div className="h-full flex   flex-col gap-4 mt-5">
              <p className="text-xl">{Class.title}</p>
              <div className="flex items-center gap-2 text-md text-foreground/50">
                <p>{Class.code}</p>
                <span>-</span>
                <p>{Class.type}</p>
              </div>
              <div className="flex items-center gap-2 text-md text-blue-500">
                <MapPin size={20} />
                <p className="text-md">{Class.room}</p>
              </div>
              <div className="flex items-center gap-2 text-md text-blue-500">
                <User size={20} />
                <p>{faculty?.faculty}</p>
              </div>
            </div>
          ) : (
            <div className="h-full flex items-center  justify-center flex-col gap-6 ">
              <CalendarClock size={50} className="stroke-blue-500" />
              <p className="text-blue-500">No class in progress right now</p>
            </div>
          )}
        </div>
        <div
          className={`h-[300px] md:h-full p-6 border border-foreground/15  rounded-lg flex flex-col bg-foreground/5  ${mount ? "translate-x-0 opacity-100" : " translate-y-20 opacity-0"} transition-all duration-500 delay-300 `}
        >
          <div className="flex items-center gap-4 ">
            <BookOpen size={30} className="stroke-orange-300" />
            <p className="text-2xl text-orange-500 font-semibold">
              Today&apos;s Class
            </p>
          </div>

          {dayOrder !== "6" && todayClass ? (
            <div className=" flex flex-col gap-4 mt-5">
              {" "}
              {Object.keys(todayClass).map((item, i) => {
                const classItem = todayClass[item as keyof typeof todayClass];
                return (
                  <div
                    key={i}
                    className="flex flex-col gap-2 border border-foreground/10 p-4 rounded-lg bg-foreground/5"
                  >
                    <p className="text-blue-500">
                      {classItem.title.toString()}
                    </p>
                    <div className="flex gap-2 items-center text-foreground/50">
                      <p>{classItem.code.toString()}</p>
                      <span>-</span>
                      <p>{classItem.type.toString()}</p>
                    </div>
                    <p className="text-green-500">{item}</p>
                  </div>
                );
              })}{" "}
            </div>
          ) : (
            <div className="flex items-center justify-center w-full h-full">
              <p className="text-2xl font-semibold text-red-500">Holiday</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Page;
