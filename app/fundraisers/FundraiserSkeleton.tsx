import { Box, Skeleton } from "@mui/material";

const FundraiserSkeleton = () => {
  return (
    <>
      <Skeleton
        variant="text"
        sx={{
          fontSize: "5rem",
          textAlign: "center",
          margin: "auto",
          mb: 2,
          width: "50%"
        }}
      />
      <Skeleton
        variant="rectangular"
        height={200}
        sx={{ marginBottom: "32px" }}
      />

      <Box
        sx={{
          margin: "auto",
          marginTop: "2rem",
          width: "100%",
          gap: "1rem",
          display: "grid",
          gridTemplateColumns: {
            xs: "1fr",
            md: "1fr 1fr"
          }
        }}
      >
        <Skeleton variant="rectangular" height={300} />
        <Skeleton variant="rectangular" height={300} />
        <Skeleton variant="rectangular" height={300} />
        <Skeleton variant="rectangular" height={300} />
      </Box>
    </>
  );
};

export default FundraiserSkeleton;
