import {
  ChatBubbleOutlineOutlined,
  FavoriteBorderOutlined,
  FavoriteOutlined,
  ShareOutlined,
} from "@mui/icons-material";
import { Box, Divider, IconButton, Typography, useTheme } from "@mui/material";
import FlexBetween from "components/FlexBetween";
import Friend from "components/Friend";
import WidgetWrapper from "components/WidgetWrapper";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setPost } from "state";
import { Input } from "@mui/material";


const PostWidget = ({
  postId,
  postUserId,
  name,
  description,
  location,
  picturePath,
  userPicturePath,
  likes,
  comments,
  showFriendButton, // Add this prop
}) => {
  const [isComments, setIsComments] = useState(false);
  const [newComment, setNewComment] = useState("");
  const dispatch = useDispatch();
  const token = useSelector((state) => state.token);
  const loggedInUserId = useSelector((state) => state.user._id);
  const isLiked = Boolean(likes[loggedInUserId]);
  const likeCount = Object.keys(likes).length;

  const { palette } = useTheme();
  const main = palette.neutral.main;
  const primary = palette.primary.main;

  const patchLike = async () => {
    const response = await fetch(`http://localhost:3001/posts/${postId}/like`, {
      method: "PATCH",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ userId: loggedInUserId }),
    });
    const updatedPost = await response.json();
    dispatch(setPost({ post: updatedPost }));
  };

  const submitComment = async () => {
    try {
      const response = await fetch(`http://localhost:3001/posts/${postId}/comment`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ userId: loggedInUserId, text: newComment }),
      });
  
      if (!response.ok) {
        // Handle error
        console.error('Error adding comment:', response.statusText);
        return;
      }
  
      const { user: { firstName, lastName }, text } = await response.json();
  
      // Assuming 'setPost' is a dispatch action that updates the post in your Redux store
      dispatch(setPost((prevPost) => ({
        ...prevPost,
        comments: [...prevPost.comments, { text, user: { firstName, lastName } }],
      })));
  
      setNewComment(""); // Clear the input field after submitting the comment
    } catch (err) {
      console.error('Error adding comment:', err.message);
    }
  };
  

  return (
    <WidgetWrapper m="2rem 0">
      <Friend
        friendId={postUserId}
        name={name}
        subtitle={location}
        userPicturePath={userPicturePath}
        showFriendButton={true}
      />
      <Typography color={main} sx={{ mt: "1rem" }}>
        {description}
      </Typography>
      {picturePath && (
        <img
          width="100%"
          height="auto"
          alt="post"
          style={{ borderRadius: "0.75rem", marginTop: "0.75rem" }}
          src={`http://localhost:3001/assets/${picturePath}`}
        />
      )}
      <FlexBetween mt="0.25rem">
        <FlexBetween gap="1rem">
          <FlexBetween gap="0.3rem">
            <IconButton onClick={patchLike}>
              {isLiked ? (
                <FavoriteOutlined sx={{ color: primary }} />
              ) : (
                <FavoriteBorderOutlined />
              )}
            </IconButton>
            <Typography>{likeCount}</Typography>
          </FlexBetween>

          <FlexBetween gap="0.3rem">
            <IconButton onClick={() => setIsComments(!isComments)}>
              <ChatBubbleOutlineOutlined />
            </IconButton>
            <Typography>{comments.length}</Typography>
          </FlexBetween>
        </FlexBetween>

        {/* <IconButton>
          <ShareOutlined />
        </IconButton> */}
      </FlexBetween>
      {isComments && (
        <Box mt="0.5rem">
          {comments.map((comment, i) => (
            <Box key={`${name}-${i}`}>
              <Divider />
              <FlexBetween alignItems="center" sx={{ m: "0.5rem 0", pl: "1rem" }}>
                {comment.userPicturePath && (
                  <Friend
                    friendId={comment.userId}
                    userPicturePath={comment.userPicturePath}
                    name={comment.userName}
                    showFriendButton={false}
                    sx={{
                      ml: "1rem",
                      display: "flex",  // Ensure the elements are displayed in a flex container
                      alignItems: "center",  // Align items vertically in the center
                      "& img": {
                        width: "30px",  // Adjust the width as needed
                        height: "30px", // Adjust the height as needed
                        objectFit: "cover",
                        borderRadius: "50%",
                      },
                      "& .MuiTypography-root": {
                        fontSize: "14px", // Adjust the font size for the name
                        marginLeft: "0.5rem",  // Add margin to separate the name from other elements
                      },
                      "& .MuiIconButton-root": {
                        fontSize: "16px", // Adjust the font size for the IconButton
                        marginLeft: "0.5rem",  // Add margin to separate the button from other elements
                      },
                    }}
                  />
                )}
                <Typography sx={{ color: main, ml: "1rem" }}>{comment.text}</Typography>
              </FlexBetween>
            </Box>
          ))}
          <Divider />
          <Box sx={{ display: "flex", alignItems: "center", mt: "0.5rem" }}>
            <Input
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              placeholder="Type your comment..."
              sx={{ flex: 1, borderRadius: "2rem", p: "0.5rem" }}
            />
            <IconButton onClick={submitComment} sx={{ ml: "0.5rem" }}>
              <ChatBubbleOutlineOutlined />
            </IconButton>
          </Box>
        </Box>
      )}
    </WidgetWrapper>
  );
};

export default PostWidget;
