import { ViewIcon } from "@chakra-ui/icons";
import {
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalFooter,
    ModalBody,
    ModalCloseButton,
    Button,
    useDisclosure,
    FormControl,
    Input,
    Box,
    IconButton,
    useToast,
    Spinner,
} from "@chakra-ui/react";
import { useState } from "react";
import { ChatState } from "../../context/chatProvider";
import UserBadgeItem from "../Users/UserBadgeItem";
import UserListItem from "../Users/UserListItem";
import axios from "axios";

const UpdateGroupChatModal = ({ fetchAgain, setFetchAgain }) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [groupChatName, setGroupChatName] = useState("");
  const [search, setSearch] = useState("");
  const [searchResult, setSearchResult] = useState([]);
  const [loading, setLoading] = useState(false);
  const [renameloading, setRenameLoading] = useState(false);
  const toast = useToast();
  
  const { selectedChat, setSelectedChat, user } = ChatState();

  const handleRename = async () => {
    if (!groupChatName) return;

    try {
      setRenameLoading(true);
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };
      const { data } = await axios.put(
        `http://localhost:8000/api/chat/rename`,
        {
          chatID: selectedChat._id,
          newName: groupChatName,
        },
        config
      );
      setSelectedChat(data);
      setFetchAgain(!fetchAgain);
      setRenameLoading(false);
    } catch (error) {
      toast({
        title: "Error Occured!",
        description: error.response.data.message,
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "top",
      });
      setRenameLoading(false);
    }
    setGroupChatName("");
  };

  const handleSearch = async () => {
    try {
      setLoading(true);
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };
      const { data } = await axios.get(`http://localhost:8000/api/user?search=${search}`, config);
      console.log(data);
      setLoading(false);
      setSearchResult(data);
    } catch (error) {
      toast({
        title: "Error Occured!",
        description: "Failed to Load the Search Results",
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "top",
      });
      setLoading(false);
    }
  };

  const handleAddUser = async (user1) => {
    if (selectedChat.users.find((u) => u._id === user1._id)) {
      toast({
        title: "User Already in group!",
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "top",
      });
      return;
    }

    if (selectedChat.groupAdmin._id !== user.userWithoutPassword._id) {
      toast({
        title: "Only admins can add someone!",
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "top",
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
      const { data } = await axios.put(
        `http://localhost:8000/api/chat/add`,
        {
          chatId: selectedChat._id,
          userId: user1._id,
        },
        config
      );

      setSelectedChat(data);
      setFetchAgain(!fetchAgain);
      setLoading(false);
    } catch (error) {
      toast({
        title: "Error Occured!",
        description: error.response.data.message,
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "top",
      });
      setLoading(false);
    }
    setGroupChatName("");
  };

  const handleRemove = async (user1) => {
    if (selectedChat.groupAdmin._id !== user.userWithoutPassword._id && user1._id !== user.userWithoutPassword._id) {
      toast({
        title: "Only admins can remove someone!",
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "top",
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
      const { data } = await axios.put(
        `http://localhost:8000/api/chat/removeFromGroup`,
        {
          chatId: selectedChat._id,
          userId: user1._id,
        },
        config
      );

      user1._id === user.userWithoutPassword._id ? setSelectedChat() : setSelectedChat(data);
      setFetchAgain(!fetchAgain);
      setLoading(false);
    } catch (error) {
      toast({
        title: "Error Occured!",
        description: error.response.data.message,
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
      setLoading(false);
    }
    setGroupChatName("");
  };


  return (
    <>
    <IconButton d={{ base: "flex" }} icon={<ViewIcon />} onClick={onOpen} />

    <Modal onClose={onClose} isOpen={isOpen} isCentered>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader
            fontSize="30px"
            display="flex"
            justifyContent="center"
          >
            {selectedChat.chatName}
        </ModalHeader>

        <ModalCloseButton />
            <ModalBody display="flex" flexDir="column" alignItems="center">
                <Box w="100%" display="flex" flexWrap="wrap" pb={3}>
                {selectedChat.users.map((u) => (
                    <UserBadgeItem
                        key={u._id}
                        user={u}
                        admin={selectedChat.groupAdmin}
                        handleFunction={() => handleRemove(u)}
                    />
                ))}
                </Box>
                <FormControl display="flex">
                <Input
                    placeholder="Input New Name"
                    mb={3}
                    value={groupChatName}
                    onChange={(e) => setGroupChatName(e.target.value)}
                    borderColor={'black'}
                />
                <Button
                    variant="solid"
                    colorScheme="teal"
                    ml={1}
                    isLoading={renameloading}
                    onClick={handleRename}
                >
                    Update
                </Button>
                </FormControl>

                <FormControl display={'flex'}>
                <Input
                    placeholder="Add User to group"
                    mb={1}
                    borderColor={'black'}
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                />
                <Button onClick={handleSearch}><i className="fa-solid fa-magnifying-glass"></i></Button>
                </FormControl>
                {loading ? (
                    <Spinner size="lg" />
                    ) : (
                    searchResult?.map((user) => (
                        <UserListItem
                        key={user._id}
                        user={user}
                        handleFunction={() => handleAddUser(user)}
                        />
                    ))
                )}
            </ModalBody>

        <ModalFooter>
            <Button onClick={() => handleRemove(user)} colorScheme="red">
                Leave Group
            </Button>
        </ModalFooter>

        </ModalContent>
    </Modal>
    </>
  );
};

export default UpdateGroupChatModal;