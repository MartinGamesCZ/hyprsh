interface IToggleProps {
  value: boolean;
  onToggle: () => void;
  className?: string;
}

export function Toggle(props: IToggleProps) {
  return (
    <div
      className={`w-8 h-4 ${props.value ? "bg-ctp-lavender" : "bg-ctp-surface1"} rounded-full p-0.5 transition-all duration-200 cursor-pointer ${props.className || ""}`}
      onClick={props.onToggle}
    >
      <div
        className={`w-3 h-3 ${props.value ? "bg-ctp-crust ml-4" : "bg-ctp-lavender/50 ml-0"} rounded-full transition-all duration-200`}
      ></div>
    </div>
  );
}
