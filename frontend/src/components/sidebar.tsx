import { History, Home, Inbox, Utensils, MapPin, ChevronUp, Map, User2, Receipt, LogOut } from "lucide-react"
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import React from "react";
import image  from "../assets/imageBG.png"
import { Separator } from "@/components/ui/separator"
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarHeader,
  SidebarFooter,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"
import {
  DropdownMenu,
  DropdownMenuContent,

  DropdownMenuSeparator,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

import { supabase } from "../supabase";


// Menu items.
const donorItems = [
  {
    title: "Dashboard",
    url: "/dashboard",
    icon: Home,
  },
  {
    title: "Inventory",
    url: "/donor/inventory",
    icon: Inbox,
  },
  {
    title: "History",
    url: "/donor/history",
    icon: History,
  },
  {
    title: "Heat Map",
    url: "/calmap",
    icon: Map,
  },

]

const receiverItems = [
  {
    title: "Dashboard",
    url: "/dashboard",
    icon: Home,
  },
  {
    title: "Locations",
    url: "/foodbank/locations",
    icon: MapPin,
  },
  {
    title: "Inventory",
    url: "/foodbank/inventory",
    icon: Inbox,
  },
  {
    title: "Meal Plans",
    url: "/foodbank/mealplans",
    icon: Utensils,
  },
  {
    title: "Heat Map",
    url: "/calmap",
    icon: Map,
  },

]

interface User {
  id: string;
  user_metadata: {
    role: string;
    // Add more properties here as needed
    [key: string]: any; // Allow any other properties
    profile_image?: string;
  };
}

export function AppSidebar() {
  const [user, setUser] = useState<User>();
  const [showPopup, setShowPopup] = useState(false);
  const [items, setItems] = useState<{ title: string; url: string; icon: React.FC }[]>([]);
  const navigate = useNavigate();
  async function handleLogout() {
    const { error } = await supabase.auth.signOut();
    console.log(error);
    if (!error) {
        setUser(undefined);
        navigate("/");
    }
}
  useEffect(() => {
    const fetchUser = async () => {
        const { data }:any = await supabase.auth.getUser();
       
        if(!data.user){
         navigate("/");
        }else{
          setUser(data.user);    
          setItems(data.user ? (data.user.user_metadata.role === "donor" || data.user.user_metadata.role === "dono" ? donorItems : receiverItems) : []);      
          console.log(data.user);
        }

    };

    fetchUser();
}, [navigate]);
  return (
    <Sidebar variant="sidebar" className="">
      <SidebarHeader className="pt-8 pl-8">
        <a className="flex" href="/">
        <img src={image} className="my-auto mr-2 w-48"  />
        </a>
      </SidebarHeader>
      <SidebarContent className="pl-2 ml-2">
        <SidebarGroup>
          <SidebarGroupLabel>Menu</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <a href={item.url} className="my-2">
                      {React.createElement(item.icon as React.ElementType, { className: "!h-5 !w-5" })}
                      <span className="text-md">{item.title}</span>
                    </a>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter className="pb-4">
        <Separator />
        <SidebarMenu>
          <SidebarMenuItem>
            <DropdownMenu>
              <DropdownMenuTrigger asChild className="p-2">
                <SidebarMenuButton className="relative">
                  
                  <img

                    className="w-8 h-8 rounded-md "
                    src={user && user.user_metadata.profile_image ? user.user_metadata.profile_image : "https://upload.wikimedia.org/wikipedia/commons/7/7c/Profile_avatar_placeholder_large.png?20150327203541"}
                    alt="User Profile"
                  />
                  <div className="flex flex-col"><span className="font-bold">{user ? user.user_metadata.first_name + " " + user.user_metadata.last_name : "Guest"}</span><span className="text-xs">{user ? user.user_metadata.email : "Guest"}</span></div>
                  
                  <ChevronUp className="ml-auto" />
                </SidebarMenuButton>
              </DropdownMenuTrigger>
              <DropdownMenuContent side="top" className="w-[--radix-popper-anchor-width] ">
                <DropdownMenuItem className="relative">
                <div className="absolute top-1 right-1 text-xs bg-green-400 p-1 px-2 rounded-lg"><span className="text-green-50">{user ? user.user_metadata.role: "Guest"}</span></div>
                <img
                    className="w-8 h-8 rounded-md"
                    src={user && user.user_metadata.profile_image ? user.user_metadata.profile_image : "https://upload.wikimedia.org/wikipedia/commons/7/7c/Profile_avatar_placeholder_large.png?20150327203541"}
                    alt="User Profile"
                  />
                  <div className="flex flex-col"><span className="font-bold">{user ? user.user_metadata.first_name + " " + user.user_metadata.last_name : "Guest"}</span><span className="text-xs">{user ? user.user_metadata.email : "Guest"}</span></div>
                  
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem>
                  <User2 className="" />
                  <span>Account</span>
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Receipt />
                  <span>Billing</span>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => setShowPopup(true)}>
                  <div className="flex">
                    <LogOut color="red" className="mr-2 my-auto h-fit" />
                    <span className="text-red-500 my-auto">Sign out</span>
                  </div>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>

      {showPopup && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white w-1/3 min-h-[20vh] p-6 rounded-xl shadow-lg">
            <h2 className="text-lg font-bold mb-2">Are you sure you want to sign out?</h2>
            <p className="text-neutral-500">This action will log you out of your account and you will need to log in again to access your dashboard and other features.</p>
            <div className="flex justify-end mt-4">
              <button
                className="mr-2 px-6 py-2 border shadow-md hover:bg-neutral-200 transition-all rounded-md"
                onClick={() => setShowPopup(false)}
              >
                Cancel
              </button>
              <button
                className="px-6 py-2 bg-black shadow-md text-white hover:bg-neutral-800 transition-all rounded-md"
                onClick={() => {
                  handleLogout();
                  setShowPopup(false);
                }}
              >
                Sign out
              </button>
            </div>
          </div>
        </div>
      )}
    </Sidebar>
  )
}
