import { Outlet } from "react-router-dom";
import SideBar from "./SideBar";
import "../css/layouts/App.css";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { setBgVisibility } from "@/utils/models/UtilityFunctions";
import { Toaster } from "@/components/ui/sonner";

export default function App() {
  const location = useLocation();
  // console.log(location.pathname);
  useEffect(() => {
    if (
      !location.pathname.includes("/swiss-bracket-manager/tournament/create") ||
      !location.pathname.includes("/swiss-bracket-manager/tournament/manage") ||
      !location.pathname.includes("/swiss-bracket-manager/run/")
    ) {
      setBgVisibility("hide");
    }
  }, [location]);

  return (
    <SidebarProvider>
      <div id="app" className="min-h-screen">
        <div id="bg_img_wrapper"></div>
        <SideBar />
        <div id="content_wrapper">
          <Outlet />
          <SidebarTrigger className="absolute top-3.5" />
          <Toaster />
        </div>
      </div>
    </SidebarProvider>
  );
}
