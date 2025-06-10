import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from "@/components/ui/resizable"
import { Textarea } from "@/components/ui/textarea"
import { ArrowRightLeft } from "lucide-react"
import { useRef, useState } from "react"
import type { ImperativePanelHandle } from "react-resizable-panels"



function Json() {
    const leftPanelRef = useRef<ImperativePanelHandle>(null)
    const [isCollapsed, setIsCollapsed] = useState(false)

    const toggleLeftPanel = () => {

        if (isCollapsed) {
            leftPanelRef.current?.resize(50)
        } else {
            leftPanelRef.current?.resize(0)
        }
        setIsCollapsed(!isCollapsed)
    }

    return (
        <div className="h-fit px-3 py-3 ">
            <h1 className="text-2xl font-bold mb-4">JSON Data</h1>


            <ResizablePanelGroup
                direction="horizontal"
                className="min-h-[700px] w-full rounded-md border-2 border-border md:min-w-[450px]"

            >
                <ResizablePanel className={` transition-all duration-500 ease-in-out ${
              isCollapsed ? 'opacity-0 scale-x-0' : 'opacity-100 scale-x-100'
            } transform origin-lef h-full`} ref={leftPanelRef} defaultSize={25}>
                    <div className="flex flex-col h-full scale-x-100 items-center justify-center p-6">
                        <span className="font-semibold">Header</span>
                        <Textarea className="h-[90%]"/>

                    </div>
                </ResizablePanel>
                <ResizableHandle className="h-full" />
                <div className="flex flex-col w-fit h-full justify-start py-3 border-r border-border">

                    <button
                        onClick={toggleLeftPanel}

                        className='active:rotate-180 bg-secondary px-2 py-1 rounded-md hover:bg-primary hover:text-white w-fit h-fit text-text   cursor-pointer' >

                        <ArrowRightLeft className="size-6 cursor-pointer" />

                    </button>
                </div>


                <ResizablePanel className="h-full" defaultSize={75}>
                    <div className="flex h-full items-center justify-center p-6">
                        <span className="font-semibold">Content</span>
                    </div>
                </ResizablePanel>
            </ResizablePanelGroup>


        </div>
    )
}

export default Json
