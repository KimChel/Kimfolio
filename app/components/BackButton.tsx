import Link from "next/link";


export default function BackButton(){
    return(
        <Link
        href={"/"}
          className="group w-14 h-14 bg-white border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[1px] hover:translate-y-[1px] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] transition-all flex flex-col items-center justify-center space-y-1 p-2"
         
        >
          {"<"}
        </Link>
    )
}