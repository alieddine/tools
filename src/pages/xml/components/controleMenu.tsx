import { ArrowLeft } from 'lucide-react'

function ControleMenu({ isCollapsed, toggleToLeft,toggleToRight }: { isCollapsed: boolean | null; toggleToLeft: () => void ; toggleToRight: () => void }) {
    return (
        <div className="flex flex-col w-fit h-full justify-center gap-2 py-3 border-r border-border">

            <button
                onClick={toggleToLeft}
                disabled={isCollapsed === false}
                className='  bg-secondary px-2 py-1 rounded-md hover:bg-primary hover:text-white w-fit h-fit text-text   cursor-pointer' >
                  <ArrowLeft className="size-6 cursor-pointer " />
                   
            </button>
            <button
                onClick={toggleToRight}
                disabled={isCollapsed === true}
                className='  bg-secondary px-2 py-1 rounded-md hover:bg-primary hover:text-white w-fit h-fit text-text   cursor-pointer' >
                
                    <ArrowLeft className="size-6 cursor-pointer rotate-180" /> 
            </button>
        </div>
    )
}

export default ControleMenu
