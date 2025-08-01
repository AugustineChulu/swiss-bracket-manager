import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  //   SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { defaultOnClickFunc } from "@/utils/types/VariableDefinations";
import { useNavigate } from "react-router-dom";
import { useLocation } from "react-router-dom";

// Menu items.
const items = [
  {
    title: "overview",
    label: "Overview",
    url: "/swiss-bracket-manager/overview",
    icon: "fa-grip",
  },
  {
    title: "statistics",
    label: "Statistics",
    url: "/swiss-bracket-manager/overview",
    icon: "fa-chart-simple",
  },
];

export default function SideBar() {
  const location = useLocation();
  let activeSidebarBtn = location.pathname.split("/").filter(Boolean).pop();
  const navigate = useNavigate();

  const routeToView: defaultOnClickFunc = (e) => {
    activeSidebarBtn = e.currentTarget.title;

    switch (activeSidebarBtn) {
      case "overview":
        {
          navigate("/swiss-bracket-manager/overview");
        }
        break;
      case "settings":
        {
          navigate("/swiss-bracket-manager/settings");
        }
        break;
      case "statistics":
        {
          navigate("/swiss-bracket-manager/statistics");
        }
        break;
      default: {
        navigate("/swiss-bracket-manager/");
      }
    }
  };

  return (
    <Sidebar collapsible="icon">
      <SidebarHeader className="justify-center">
        <SidebarMenuButton
          className="rounded-full hover:bg-transparent active:bg-transparent focus:ring-0 focus:outline-none"
          size="lg"
        >
          <a
            title="home"
            onClick={routeToView}
            className="size-8 rounded-full bg-(--background) p-1 flex item-center"
          >
            <svg
              id="Layer_1"
              data-name="Layer 1"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 500 358.6"
            >
              <rect
                x="151.4"
                y="20"
                width="197.2"
                height="318.59"
                rx="12"
                style={{ fill: "#ed1c24" }}
              />
              <rect
                x="151.4"
                y="80.7"
                width="197.2"
                height="197.16"
                style={{ fill: "none" }}
              />
              <path
                d="M94.1,80.7a12,12,0,0,0-12,12v76.6h0v20h0v76.6a12,12,0,0,0,12,12h37.3V80.7Z"
                style={{ fill: "none" }}
              />
              <path
                d="M151.4,326.6a12,12,0,0,0,12,12H336.6a12,12,0,0,0,12-12V297.9H151.4Z"
                style={{ fill: "none" }}
              />
              <path
                d="M348.6,32a12,12,0,0,0-12-12H163.4a12,12,0,0,0-12,12V60.7H348.6Z"
                style={{ fill: "none" }}
              />
              <path
                d="M405.9,277.9a12,12,0,0,0,12-12V189.3h0v-20h0V92.7a12,12,0,0,0-12-12H368.6V277.9Z"
                style={{ fill: "none" }}
              />
              <path
                d="M437.9,169.3V92.7a32.1,32.1,0,0,0-32-32H368.6V32a32.1,32.1,0,0,0-32-32H163.4a32.1,32.1,0,0,0-32,32V60.7H94.1a32.1,32.1,0,0,0-32,32v76.6H0v20H62.1v76.6a32.1,32.1,0,0,0,32,32h37.3v28.7a32.1,32.1,0,0,0,32,32H336.6a32.1,32.1,0,0,0,32-32V297.9h37.3a32.1,32.1,0,0,0,32-32V189.3H500v-20ZM94.1,277.9a12,12,0,0,1-12-12V189.3h0v-20h0V92.7a12,12,0,0,1,12-12h37.3V277.9Zm254.5,48.7a12,12,0,0,1-12,12H163.4a12,12,0,0,1-12-12V32a12,12,0,0,1,12-12H336.6a12,12,0,0,1,12,12V326.6Zm69.3-157.3h0v20h0v76.6a12,12,0,0,1-12,12H368.6V80.7h37.3a12,12,0,0,1,12,12Z"
                style={{ fill: "#fff" }}
              />
              <path
                d="M312.3,159.3H275.7a5.8,5.8,0,0,1-5.7-5.7V117a5.7,5.7,0,0,0-5.7-5.7H235.7A5.7,5.7,0,0,0,230,117v36.6a5.8,5.8,0,0,1-5.7,5.7H187.7A5.7,5.7,0,0,0,182,165v28.6a5.7,5.7,0,0,0,5.7,5.7h36.6A5.8,5.8,0,0,1,230,205v36.6a5.7,5.7,0,0,0,5.7,5.7h28.6a5.7,5.7,0,0,0,5.7-5.7V205a5.8,5.8,0,0,1,5.7-5.7h36.6a5.7,5.7,0,0,0,5.7-5.7V165A5.7,5.7,0,0,0,312.3,159.3Z"
                style={{ fill: "#fff" }}
              />
            </svg>
          </a>
        </SidebarMenuButton>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup />
        {/* <SidebarGroupLabel>Application</SidebarGroupLabel> */}
        <SidebarGroupContent>
          <SidebarMenu>
            {items.map((item) => (
              <SidebarMenuItem key={item.title}>
                <SidebarMenuButton
                  asChild
                  className={` rounded-full ${item.title == activeSidebarBtn ? "" : "bg-(--border)"} `}
                  isActive={item.title == activeSidebarBtn ? true : false}
                  size="lg"
                >
                  <a title={item.title} onClick={routeToView}>
                    <div></div>
                    <i className={`fa-solid ${item.icon} fa-lg`}></i>
                    &nbsp;
                    <h3>{item.label}</h3>
                  </a>
                </SidebarMenuButton>
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
        </SidebarGroupContent>
        <SidebarGroup />
      </SidebarContent>
      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            {/* <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <SidebarMenuButton>
                    <User2 /> Username
                    <ChevronUp className="ml-auto" />
                    </SidebarMenuButton>
                </DropdownMenuTrigger>
                <DropdownMenuContent
                    side="top"
                    className="w-[--radix-popper-anchor-width]"
                >
                    <DropdownMenuItem>
                    <span>Account</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                    <span>Billing</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                    <span>Sign out</span>
                    </DropdownMenuItem>
                </DropdownMenuContent>
                </DropdownMenu> */}
            <SidebarMenuButton
              asChild
              className="rounded-full bg-(--border)"
              isActive={activeSidebarBtn == "settings" ? true : false}
              size="lg"
            >
              <a title="settings" onClick={routeToView}>
                <div></div>
                <i className="fa-solid fa-wrench"></i>
                &nbsp;
                <h3>Settings</h3>
              </a>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
      
    </Sidebar>
  );
}
