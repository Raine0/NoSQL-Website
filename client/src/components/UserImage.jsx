import { Box } from "@mui/material";

const UserImage = ({ image, size = "60px", showFriendButton }) => {
  const imageSize = showFriendButton ? "55px" : "35px";

  return (
    <Box width={imageSize} height={imageSize}>
      <img
        style={{ objectFit: "cover", borderRadius: "50%" }}
        width={imageSize}
        height={imageSize}
        alt="user"
        src={`http://localhost:3001/assets/${image}`}
      />
    </Box>
  );
};

export default UserImage;
