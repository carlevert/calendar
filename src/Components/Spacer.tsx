import * as React from "react"

export default (props: { width?: number, fill?: boolean }) => {
   const style: React.CSSProperties = {};

   if (props.width)
      Object.assign(style, { flexBasis: props.width + "px" })
   if (props.fill)
      Object.assign(style, { flexGrow: 1 })

   return <div style={style}></div>

}

