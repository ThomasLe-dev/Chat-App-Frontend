import React, { useState } from 'react';
import 
{ Box, 
  Button, 
  Tooltip, 
  Text, 
  Menu, 
  MenuButton, 
  Avatar, 
  MenuList, 
  MenuItem, 
  MenuDivider, 
  useDisclosure,
  Drawer,
  DrawerBody,
  DrawerHeader,
  DrawerOverlay,
  DrawerContent,
  Input,
  useToast,
  Spinner
} from '@chakra-ui/react';
import {BellIcon, ChevronDownIcon} from '@chakra-ui/icons';
import { useNavigate } from "react-router-dom";
import { ChatState } from '../../context/chatProvider';
import ProfileModal from './ProfileModal';
import axios from "axios";
import ChatLoading from "../ChatLoading";
import UserListItem from "../Users/UserListItem";
import { getSender } from "../../config/ChatLogic";
import NotificationBadge from "react-notification-badge";
import { Effect } from "react-notification-badge";

const SideDrawer = () => {
  const [search, setSearch] = useState("");
  const [searchResult, setSearchResult] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loadingChat, setLoadingChat] = useState();

  const navigate = useNavigate();
  const {user, setSelectedChat, chats, setChats, notification, setNotification} = ChatState();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const toast = useToast();

  //features handling
  const logOut = () => {
    localStorage.removeItem('userInfo');
    navigate('/');
  };

  const handleSearch = async () => {
    if (!search) {
      toast({
        title: "Please enter something in the search",
        status: "warning",
        duration: 5000,
        isClosable: true,
        position: "top-left",
      });
      return;
    }
  
    try {
      setLoading(true);
  
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };
  
      const { data } = await axios.get(`http://localhost:8000/api/user?search=${search}`, config);
  
      setLoading(false);
      setSearchResult(data);
    } catch (error) {
      toast({
        title: "Error occurred!",
        description: "Failed to load the search results",
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "top-left",
      });
    }
  };

  const accessChat = async (userId) => {
    try {
      setLoadingChat(true);
  
      const config = {
        headers: {
          "Content-type": "application/json",
          Authorization: `Bearer ${user.token}`,
        },
      };
  
      const { data } = await axios.post(`http://localhost:8000/api/chat`, { userId }, config);
  
      if (!chats.some((c) => c._id === data._id)) {
        setChats([data, ...chats]);
      }
  
      setSelectedChat(data);
      setLoadingChat(false);
      onClose();
    } catch (error) {
      toast({
        title: "Error fetching the chat",
        description: error.message,
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "top-left",
      });
    }
  };
  
  
  return (
  <>
    <Box display={"flex"} justifyContent={"space-between"} alignItems={"center"} bg={"white"} w={"100%"} p={"5px 10px 5px 10px"} borderWidth={"5px"}>

      <Tooltip label="Search user" hasArrow placement='bottom-end'>

        <Button variant="ghost" onClick={onOpen}>
          <i className="fa-solid fa-magnifying-glass"></i>
          <Text display={{base: "none", md: "flex"}} px={"4"}>Search User</Text>
        </Button>
      </Tooltip>

      <Text fontSize={'2xl'} marginRight={"10%"}>DUNGEON CHAT ZONE</Text>
      <div>
        <Menu>
          <MenuButton p={1} marginRight="10px">
            <NotificationBadge
              count={notification.length}
              effect={Effect.SCALE}
            />
            <BellIcon fontSize={'2xl'} p={1}/>
          </MenuButton>
          <MenuList pl={2}>
          {!notification.length && " 0 New Messages"}
          {notification.map((notif) => (
                <MenuItem
                  key={notif._id}
                  onClick={() => {
                    setSelectedChat(notif.chat);
                    setNotification(notification.filter((n) => n !== notif));
                  }}
                >
                  {notif.chat.isGroupChat
                    ? `New Message in ${notif.chat.chatName}`
                    : `New Message from ${getSender(user, notif.chat.users)}`}
                </MenuItem>
            ))}
          </MenuList>
        </Menu>

        <Menu>
          <MenuButton as={Button} rightIcon={<ChevronDownIcon/>}>
            <Avatar size={"sm"} cursor={"pointer"} name={user.userWithoutPassword.userName} src={user.userWithoutPassword.profPic}></Avatar>
          </MenuButton>

          <MenuList>
            <ProfileModal user={user.userWithoutPassword}>
              <MenuItem>My Profile</MenuItem>
            </ProfileModal>
            <MenuDivider/>
            <MenuItem onClick={logOut}>Logout</MenuItem>
          </MenuList>
        </Menu>
      </div>
    </Box>

    <Drawer placement="left" onClose={onClose} isOpen={isOpen}>
      <DrawerOverlay/>
      <DrawerContent>
        <DrawerHeader borderBottomWidth='1px'>Search User</DrawerHeader>
        <DrawerBody>
            <Box display="flex" pb={2}>
              <Input
                placeholder="Search by name or email"
                mr={2}
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
              <Button onClick={handleSearch}><i className="fa-solid fa-magnifying-glass"></i></Button>
            </Box>
              {loading ? (
                  <ChatLoading />
                ) : (
                searchResult?.map((user) => (
                  <UserListItem
                    key={user._id}
                    user={user}
                    handleFunction={() => accessChat(user._id)}
                  />
                )))
              }{loadingChat && <Spinner ml="auto" display="flex" />}
          </DrawerBody>
      </DrawerContent>
    </Drawer>

  </>
  )
}

export default SideDrawer
