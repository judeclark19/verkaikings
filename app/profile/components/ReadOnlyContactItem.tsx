import { Link, Typography } from "@mui/material";

function ReadOnlyContactItem({
  value,
  icon,
  link
}: {
  value: string;
  icon?: React.ReactNode;
  link?: string;
}) {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        height: "60px"
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
        {icon}

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
            {link ? <Link href={link}>{value}</Link> : <>{value}</>}
          </Typography>
        </div>
      </div>
    </div>
  );
}

export default ReadOnlyContactItem;
