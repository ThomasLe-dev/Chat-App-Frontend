import React from 'react';
import ScrollableFeed from "react-scrollable-feed";
import { Avatar, Tooltip } from "@chakra-ui/react";
import { ChatState } from "../context/chatProvider";
import {
    isLastMessage,
    isSameSender,
    isSameSenderMargin,
    isSameUser
} from "../config/ChatLogic";


const ScrollableChat = ({messages}) => {
  const { user } = ChatState();

  return (
    <ScrollableFeed>
        {messages && messages.map((m, i) => (
            <div style={{ display: "flex" }} key={m._id}>
            {(isSameSender(messages, m, i, user.userWithoutPassword._id) ||
              isLastMessage(messages, i, user.userWithoutPassword._id)) && (
              <Tooltip label={m.sender.userName} placement="bottom-start" hasArrow>
                <Avatar
                  mt="7px"
                  mr={1}
                  size="sm"
                  cursor="pointer"
                  name={m.sender.userName}
                  src={m.sender.profPic}
                />
              </Tooltip>
            )}
            <span
              style={{
                backgroundColor: `${
                  m.sender._id === user.userWithoutPassword._id ? "#BEE3F8" : "#B9F5D0"
                }`,
                marginLeft: isSameSenderMargin(messages, m, i, user.userWithoutPassword._id),
                marginTop: isSameUser(messages, m, i, user.userWithoutPassword._id) ? 3 : 10,
                borderRadius: "20px",
                padding: "5px 15px",
                maxWidth: "75%",
              }}
            >
              {m.content}
            </span>
           </div>
        ))}
    </ScrollableFeed>
  )
}

export default ScrollableChat