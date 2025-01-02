import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from "@/components/ui/resizable"
import { Outlet } from "react-router-dom"
import LeftSidebar from "./components/LeftSidebar";
import FriendsActivity from "./components/FriendsActivity";
import { useEffect, useState } from "react";
import AudioPlayer from "./components/AudioPlayer";
import PlaybackControls from "./components/PlaybackControls";

const MainLayout = () => {
  const [isMobile, setIsMobile] = useState(false);

	useEffect(() => {
		const checkMobile = () => {
			setIsMobile(window.innerWidth < 768);
		};

		checkMobile();
		window.addEventListener("resize", checkMobile);
		return () => window.removeEventListener("resize", checkMobile);
	}, []);
    return (
    <div className="h-screen bg-black text-white flex flex-col">
      <ResizablePanelGroup direction="horizontal" className="flex-1 flex h-full overflow-hidden p-2">
        
        <AudioPlayer/>
        <ResizablePanel defaultSize={20} minSize={ isMobile ? 10 : 0} maxSize={30}>
            <LeftSidebar/>
        </ResizablePanel>

        <ResizableHandle className="w-2 bg-black rounded-lg transition-colors"/>

        <ResizablePanel defaultSize={isMobile ? 80 : 60}>
            <Outlet/>
        </ResizablePanel>
        {!isMobile &&
        <>
        <ResizableHandle className="w-2 bg-black rounded-lg transition-colors"/>

        <ResizablePanel defaultSize={20} minSize={0} maxSize={30}>
            <FriendsActivity/>
        </ResizablePanel>
        </>
        }
      </ResizablePanelGroup>
      <PlaybackControls/>
    </div>
  )
}

export default MainLayout
