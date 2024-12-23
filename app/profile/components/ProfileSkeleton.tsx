import { Box, Skeleton, Typography } from "@mui/material";

function ProfileSkeleton() {
  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: { xs: "column", md: "row" },
        justifyContent: "center",
        gap: 3
      }}
    >
      {/* SIDEBAR */}
      <Box
        sx={{
          width: { xs: "100%", md: "300px" },
          maxWidth: "100%",
          height: {
            xs: "490px",
            md: "800px"
          }
        }}
      >
        <Skeleton
          sx={{
            width: "100%",
            height: "100%",
            marginTop: {
              xs: "-110px",
              md: "-135px"
            }
          }}
        />
        <Skeleton
          sx={{
            width: "100%",
            height: "300px",
            marginTop: {
              xs: "-140px",
              md: "-190px"
            }
          }}
        />
      </Box>

      {/* MAIN CONTENT */}
      <Box
        sx={{
          flexGrow: 1,
          maxWidth: { xs: "100%", md: "800px" }
        }}
      >
        {/* FIRST SECTION - CONTACT DETAILS */}
        <Typography
          variant="h1"
          sx={{
            display: { xs: "none", md: "block" },
            marginBottom: 2
          }}
        >
          <Skeleton width="50%" />
        </Typography>
        <Box
          sx={{
            display: "grid",
            gap: 2,
            gridTemplateColumns: {
              xs: "1fr",
              sm: "repeat(auto-fit, 300px)"
            },
            justifyContent: { xs: "center", md: "start" }
          }}
        >
          {Array(6)
            .fill(0)
            .map((_, index) => (
              <Skeleton key={index} variant="rectangular" height="72px" />
            ))}
        </Box>

        {/* <Divider sx={{ my: 3 }} /> */}

        {/* SECOND SECTION - EVENTS */}
        {/* <Typography variant="h2">
          <Skeleton width="120px" />
        </Typography>
        <Skeleton variant="rectangular" height="200px" /> */}

        {/* THIRD SECTION - MY WILLEMIJN STORY */}
        <Box>
          <Typography variant="h2" sx={{ marginBottom: 2 }}>
            <Skeleton width="40%" />
          </Typography>
          <Skeleton variant="rectangular" height="300px" />
        </Box>
      </Box>
    </Box>
  );
}

export default ProfileSkeleton;
