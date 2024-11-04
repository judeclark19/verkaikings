import { Skeleton, Typography } from "@mui/material";

function ProfileSkeleton() {
  return (
    <div>
      <Typography variant="h1">
        <Skeleton />
      </Typography>
      <Skeleton />
      <Skeleton />
      <Skeleton />
      <Skeleton />
      <Skeleton />
      <Typography variant="h2">
        <Skeleton />
      </Typography>
      <Skeleton />
    </div>
  );
}

export default ProfileSkeleton;
