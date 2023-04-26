import React from 'react'
import { ChatState } from "../context/chatProvider";
import { Box, Text, IconButton, FormControl, Input, Spinner, useToast } from "@chakra-ui/react";
import { ArrowBackIcon } from "@chakra-ui/icons";
import { getSender, getSenderFull } from "../config/ChatLogic";
import ProfileModal from './miscellaneous/ProfileModal';
import UpdateGroupChatModal from "./miscellaneous/UpdateGroupChatModal";
import { useState, useEffect } from "react";
import axios from 'axios';
import "../styles.css";
import ScrollableChat from './ScrollableChat';
import io from 'socket.io-client';

const ENDPOINT = 'http://localhost:8000';
var socket, selectedChatCompare;

const SingleChat = ({ fetchAgain, setFetchAgain }) => {
    const [messages, setMessages] = useState([]);
    const [loading, setLoading] = useState(false);
    const [newMessage, setNewMessage] = useState("");
    const { selectedChat, setSelectedChat, user } = ChatState();
    const [socketConnected, setSocketConnected] = useState(false);
    const toast = useToast();


    const sendMessage = async (event) => {
      if (event.key === "Enter" && newMessage) {
        try {
          const config = {
            headers: {
              "Content-type": "application/json",
              Authorization: `Bearer ${user.token}`,
            },
          };
          setNewMessage("");
          const { data } = await axios.post(
            "http://localhost:8000/api/message",
            {
              content: newMessage,
              chatId: selectedChat,
            },
            config
          );
          //console.log(data);
          socket.emit('new message', data);
          setMessages([...messages, data]);
        } catch (error) {
          toast({
            title: "Error Occured!",
            description: "Failed to send the Message",
            status: "error",
            duration: 5000,
            isClosable: true,
            position: "top",
          });
        }
      }
    };

    const typingHandler = (e) => {
      setNewMessage(e.target.value);
    };

    const fetchMessages = async() =>{
      if (!selectedChat) return;

    try {
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };
      setLoading(true);

      const { data } = await axios.get(
        `http://localhost:8000/api/message/${selectedChat._id}`,
        config
      );
      setMessages(data);
      // console.log(messages);
      setLoading(false);

      socket.emit('join chat', selectedChat._id);
    } catch (error) {
      toast({
        title: "Error Occured!",
        description: "Failed to Load the Messages",
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "top",
      });
    }
    };

    useEffect(() => {
      socket = io(ENDPOINT);
      socket.emit('setup', user.userWithoutPassword);
      socket.on('connection', () => setSocketConnected(true));
    }, []);

    useEffect(() => {
      fetchMessages();
      selectedChatCompare =  selectedChat;
    }, [selectedChat]);

    useEffect(() => {
      socket.on("message received", (newMessageRecieved) => {
        if (
          !selectedChatCompare || // if chat is not selected or doesn't match current chat
          selectedChatCompare._id !== newMessageRecieved.chat._id
        ) {
            //give notification
        } else {
          setMessages([...messages, newMessageRecieved]);
        }
      });
    });


    return (
      <>
        {selectedChat ? (
        <>
          <Text
            fontSize={{ base: "28px", md: "30px" }}
            pb={3}
            px={2}
            w="100%"
            display="flex"
            justifyContent={{ base: "space-between" }}
            alignItems="center"
          >
            <IconButton
              display={{ base: "flex", md: "none" }}
              icon={<ArrowBackIcon />}
              onClick={() => setSelectedChat("")}
            />
            {
              (!selectedChat.isGroupChat ? (
                <>
                  {getSender(user, selectedChat.users)}
                  <ProfileModal user={getSenderFull(user, selectedChat.users)}/>
                </>
              ) : (
                <>
                  {selectedChat.chatName}
                  <UpdateGroupChatModal
                    fetchMessages={fetchMessages}
                    fetchAgain={fetchAgain}
                    setFetchAgain={setFetchAgain}
                  />
                </>
              ))}
          </Text>
          <Box
            display="flex"
            flexDir="column"
            justifyContent="flex-end"
            p={3}
            bg="#d0d0d0"
            w="100%"
            h="100%"
            borderRadius="lg"
            overflowY="hidden"
          >
            {loading ? (
              <Spinner
                size="xl"
                w={20}
                h={20}
                alignSelf="center"
                margin="auto"
              />
            ) : (
              <div className="messages">
                <ScrollableChat messages={messages} />
              </div>
            )}

            <FormControl
              onKeyDown={sendMessage}
              id="first-name"
              isRequired
              mt={3}
            >
              {/* {istyping ? (
                <div>
                  <Lottie
                    options={defaultOptions}
                    // height={50}
                    width={70}
                    style={{ marginBottom: 15, marginLeft: 0 }}
                  />
                </div>
              ) : (
                <></>
              )} */}
              <Input
                variant="filled"
                bg="#E0E0E0"
                placeholder="Enter a message.."
                value={newMessage}
                onChange={typingHandler}
              />
            </FormControl>
          </Box>
        </>
        ) : (
          <Box display="flex" alignItems="center" justifyContent="center" h="100%">
            <Text fontSize="3xl" pb={3}>
              Click on a user or group to start chatting
            </Text>
          </Box>
        )}
      </>
  )
}

export default SingleChat