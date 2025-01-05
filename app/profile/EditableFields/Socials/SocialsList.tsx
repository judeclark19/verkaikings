import { Paper, Typography } from "@mui/material";
import { observer } from "mobx-react-lite";
import myProfileState from "../../MyProfile.state";
import { Email as EmailIcon } from "@mui/icons-material";
import EmailChangeModal from "../../components/EmailChangeModal/EmailChangeModal";
import TikTokIcon from "../../../../public/images/icons8-tiktok-24.svg";
import SocialMediaInput from "./SocialMediaInput";
import InstagramIcon from "@mui/icons-material/Instagram";
import DuolingoIcon from "../../../../public/images/icons8-duolingo-24.svg";
import BeRealIcon from "../../../../public/images/icons8-bereal-24.svg";
const SocialsList = observer(() => {
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
          <EmailIcon />

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
              {myProfileState.email}
            </Typography>
          </div>
        </div>
        <EmailChangeModal />
      </div>
      <SocialMediaInput
        platformName="Instagram"
        platformIcon={<InstagramIcon />}
        stateKey="instagram"
        profileStateSetter={(value) => myProfileState.setInstagram(value)}
        linkPrefix="https://www.instagram.com/"
      />
      <SocialMediaInput
        platformName="TikTok"
        platformIcon={
          <TikTokIcon
            size={24}
            style={{
              flexShrink: 0
            }}
          />
        }
        stateKey="tiktok"
        profileStateSetter={(value) => myProfileState.setTiktok(value)}
        linkPrefix="https://www.tiktok.com/@"
      />

      <SocialMediaInput
        platformName="Duolingo"
        platformIcon={
          <DuolingoIcon
            size={24}
            style={{
              flexShrink: 0
            }}
          />
        }
        stateKey="duolingo"
        profileStateSetter={(value) => myProfileState.setDuolingo(value)}
        linkPrefix="https://www.duolingo.com/profile/"
      />

      <SocialMediaInput
        platformName="BeReal"
        platformIcon={
          <BeRealIcon
            size={24}
            style={{
              flexShrink: 0
            }}
          />
        }
        stateKey="beReal"
        profileStateSetter={(value) => myProfileState.setBeReal(value)}
        linkPrefix="https://bere.al/"
      />
    </Paper>
  );
});

export default SocialsList;
