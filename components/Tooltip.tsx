import { Tooltip as MuiTooltip } from "@mui/material";
import React from "react";

const Tooltip = ({
  title,
  offset = -8,
  children
}: {
  title: string | React.ReactElement;
  offset?: number;
  children: React.ReactElement;
}) => {
  return (
    <MuiTooltip
      title={title}
      placement="top"
      arrow
      PopperProps={{
        modifiers: [
          {
            name: "offset",
            options: {
              offset: [0, offset]
            }
          }
        ]
      }}
    >
      {children}
    </MuiTooltip>
  );
};

export default Tooltip;
