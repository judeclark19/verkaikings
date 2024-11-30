import PieChartIcon from "@mui/icons-material/PieChart";
import { Typography } from "@mui/material";

function ReadOnlyContactItem({
  value,
  icon
}: {
  value: string;
  icon?: React.ReactNode;
}) {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        height: "76px"
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 1,
          width: "100%"
        }}
      >
        {icon ? icon : <PieChartIcon />}

        <div
          style={{
            width: "100%",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            paddingLeft: "14px"
          }}
        >
          <Typography
            sx={{
              wordBreak: "break-all"
            }}
          >
            {value}
          </Typography>
        </div>
      </div>
    </div>
  );
}

export default ReadOnlyContactItem;
