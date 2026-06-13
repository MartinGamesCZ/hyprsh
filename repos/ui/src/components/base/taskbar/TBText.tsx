import { ReactNode } from "react";

interface ITBTextProps {
  children: ReactNode | ReactNode[];
  size?: "xs" | "sm" | "md" | "lg" | "xl";
}

export function TBText(props: ITBTextProps) {
  const sizes = {
    xs: "text-xs",
    sm: "text-sm",
    md: "text-base",
    lg: "text-lg",
    xl: "text-xl",
  };

  return (
    <p
      className={`text-ctp-subtext0 ${sizes[props.size ?? "md"]} select-none pointer-events-none`}
    >
      {props.children}
    </p>
  );
}
