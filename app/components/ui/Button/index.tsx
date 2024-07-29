import clsx from "clsx";
import type { ComponentProps } from "react";

export const Button = ({ ...props }: ComponentProps<"button">) => {
  return (
    <button
      {...props}
      className={clsx(
        "mg-px-4 mg-py-2",
        "mg-rounded-lg mg-bg-slate-800",
        "mg-text-white mg-font-bold mg-text-sm",
        props.className,
      )}
    />
  );
};
