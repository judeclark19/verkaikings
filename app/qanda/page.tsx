import { Typography } from "@mui/material";
import { Metadata } from "next/types";
import QuandAList from "./QandAList";

export const metadata: Metadata = {
  title: "Q and A | Willemijn's World Website"
};

const QandAPage = () => {
  return (
    <div>
      <Typography
        variant="h1"
        sx={{
          textAlign: "center"
        }}
      >
        Q and A
      </Typography>
      <QuandAList />
    </div>
  );
};

export default QandAPage;
