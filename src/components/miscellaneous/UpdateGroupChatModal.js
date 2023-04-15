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
} from "@chakra-ui/react";
import { useState } from "react";
import { ChatState } from "../../context/chatProvider";
import UserBadgeItem from "../Users/UserBadgeItem";
// import UserListItem from "../Users/UserListItem";

const UpdateGroupChatModal = ({ fetchMessages, fetchAgain, setFetchAgain }) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [groupChatName, setGroupChatName] = useState("");
  const [search, setSearch] = useState("");
  const [searchResult, setSearchResult] = useState([]);
  const [loading, setLoading] = useState(false);
  const [renameloading, setRenameLoading] = useState(false);
  
  const { selectedChat, setSelectedChat, user } = ChatState();

  const handleRemove = async () => {};
  const handleRename = async () => {};
  const handleSearch = async (query) => {};


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

                <FormControl>
                <Input
                    placeholder="Add User to group"
                    mb={1}
                    borderColor={'black'}
                    onChange={(e) => handleSearch(e.target.value)}
                />
                </FormControl>
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