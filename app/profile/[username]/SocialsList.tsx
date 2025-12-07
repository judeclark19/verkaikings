import { Paper, Typography } from "@mui/material";
import Image from "next/image";
import ReadOnlyContactItem from "../components/ReadOnlyContactItem";
import {
  // Email as EmailIcon,
  Instagram as InstagramIcon
} from "@mui/icons-material";
import BeRealIcon from "../../../public/images/icons8-bereal-24.svg";
import DuolingoIcon from "../../../public/images/icons8-duolingo-24.svg";
import TikTokIcon from "../../../public/images/icons8-tiktok-24.svg";
import { UserDocType } from "@/lib/UserList";

function SocialsList({ user }: { user: UserDocType }) {
  return (
    <Paper
      elevation={3}
      sx={{
        padding: 3
      }}
    >
      <Typography variant="h3" sx={{ textAlign: "center", marginTop: 0 }}>
        Socials
      </Typography>

      {/* <ReadOnlyContactItem value={user.email} icon={<EmailIcon />} /> */}

      {user.instagram && (
        <ReadOnlyContactItem
          value={user.instagram}
          icon={<InstagramIcon />}
          link={`https://instagram.com/${user.instagram}`}
        />
      )}

      {user.tiktok && (
        <ReadOnlyContactItem
          value={user.tiktok}
          icon={
            <Image
              src={TikTokIcon}
              alt="TikTok"
              width={24}
              height={24}
              style={{ flexShrink: 0 }}
            />
          }
          link={`https://www.tiktok.com/@${user.tiktok}`}
        />
      )}

      {user.duolingo && (
        <ReadOnlyContactItem
          value={user.duolingo}
          icon={
            <Image
              src={DuolingoIcon}
              alt="Duolingo"
              width={24}
              height={24}
              style={{ flexShrink: 0 }}
            />
          }
          link={`https://www.duolingo.com/profile/${user.duolingo}`}
        />
      )}

      {user.beReal && (
        <ReadOnlyContactItem
          value={user.beReal}
          icon={
            <Image
              src={BeRealIcon}
              alt="BeReal"
              width={24}
              height={24}
              style={{ flexShrink: 0 }}
            />
          }
          link={`https://bere.al/${user.beReal}`}
        />
      )}
    </Paper>
  );
}

export default SocialsList;
