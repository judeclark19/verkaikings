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
      <Skeleton />
    </div>
  );
}

export default ProfileSkeleton;
