import { ReactNode } from "react";

interface ITBTextProps {
  children: ReactNode | ReactNode[];
  size?: "xs" | "sm" | "md" | "lg" | "xl";
  className?: string;
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
      className={`${sizes[props.size ?? "sm"]} select-none pointer-events-none ${props.className ?? "text-ctp-subtext0"}`}
    >
      {props.children}
    </p>
  );
}
