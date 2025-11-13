import * as React from "react";
export function Button({children, className="", ...props}:{children:React.ReactNode,className?:string}&React.ButtonHTMLAttributes<HTMLButtonElement>){
  return <button className={`btn ${className}`} {...props}>{children}</button>
}
