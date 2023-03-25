import {useToast, Button, InputGroup, InputRightElement, FormControl, FormLabel, Input, VStack } from '@chakra-ui/react'
import React, { useState } from 'react';
import { useNavigate } from "react-router-dom";
import axios from 'axios';

function SignUp() {
    const [show, setShow] = useState(false);
    const [userName, setName] = useState();
    const [email, setEmail] = useState();
    const [confirmpassword, setConfirmpassword] = useState();
    const [password, setPassword] = useState();
    const [profPic, setPic] = useState();
    const [picLoading, setPicLoading] = useState(false);

    const toast = useToast();
    const navigate = useNavigate();
    const handleClick = () => setShow(!show);

    const postDetails = (pics) => {
      setPicLoading(true);
      if (pics === undefined) {
        toast({
          title: "Please Select an Image!",
          status: "warning",
          duration: 5000,
          isClosable: true,
          position: "top",
        });
        return;
      }
      console.log(pics);
      if (pics.type === "image/jpeg" || pics.type === "image/png") {
        //handle uploading images to cloudinary
        const data = new FormData();
        data.append("file", pics);
        data.append("upload_preset", "chat-application");
        data.append("cloud_name", "dbjyjwj7o");
        fetch("https://api.cloudinary.com/v1_1/dbjyjwj7o/image/upload", {
          method: "post",
          body: data,
        })
          .then((res) => res.json())
          .then((data) => {
            setPic(data.url.toString());
            console.log(data.url.toString());
            setPicLoading(false);
          })
          .catch((err) => {
            console.log(err);
            setPicLoading(false);
          });
      } else {
        toast({
          title: "Please Select an Image!",
          status: "warning",
          duration: 5000,
          isClosable: true,
          position: "top",
        });
        setPicLoading(false);
        return;
      }
    }
    
    const submitHandler = async () => {
      setPicLoading(true);
      if (!userName || !email || !password || !confirmpassword) {
        toast({
          title: "Please Fill all the Feilds",
          status: "warning",
          duration: 5000,
          isClosable: true,
          position: "top",
        });
        setPicLoading(false);
        return;
      }
      if (password !== confirmpassword) {
        toast({
          title: "Passwords Do Not Match",
          status: "warning",
          duration: 5000,
          isClosable: true,
          position: "top",
        });
        setPicLoading(false);
        return;
      }
      console.log(userName, email, password, profPic);
      try {
        const config = {
          headers: {
            "Content-type": "application/json",
          },
        };
        const { data } = await axios.post(
          "http://localhost:8000/api/user/",
          {
            userName,
            email,
            password,
            profPic,
          },
          config
        );
        console.log(data);
        toast({
          title: "Registration Successful",
          status: "success",
          duration: 5000,
          isClosable: true,
          position: "top",
        });
        localStorage.setItem("userInfo", JSON.stringify(data));
        setPicLoading(false);
        navigate("/");
      } catch (error) {
        toast({
          title: "Error Occured!",
          description: error.response.data.message,
          status: "error",
          duration: 5000,
          isClosable: true,
          position: "top",
        });
        setPicLoading(false);
      }
    };

    
  return (
    <VStack spacing="5px" id="first-name" isRequired>
      <FormControl id="first-name" isRequired>
        <FormLabel>Name</FormLabel>
        <Input
          placeholder="Enter Your Name"
          onChange={(e) => setName(e.target.value)}
        />
      </FormControl>

      <FormControl id="email" isRequired>
        <FormLabel>Email Address</FormLabel>
        <Input
          type="email"
          placeholder="Enter Your Email Address"
          onChange={(e) => setEmail(e.target.value)}
        />
      </FormControl>

      <FormControl id="password" isRequired>
        <FormLabel>Password</FormLabel>
        <InputGroup size="md">
          <Input
            type={show ? "text" : "password"}
            placeholder="Enter Password"
            onChange={(e) => setPassword(e.target.value)}
          />
          <InputRightElement width="4.5rem">
            <Button h="1.75rem" size="sm" onClick={handleClick}>
              {show ? "Hide" : "Show"}
            </Button>
          </InputRightElement>
        </InputGroup>
      </FormControl>

      <FormControl id="password" isRequired>
        <FormLabel>Confirm Password</FormLabel>
        <InputGroup size="md">
          <Input
            type={show ? "text" : "password"}
            placeholder="Confirm password"
            onChange={(e) => setConfirmpassword(e.target.value)}
          />
          <InputRightElement width="4.5rem">
            <Button h="1.75rem" size="sm" onClick={handleClick}>
              {show ? "Hide" : "Show"}
            </Button>
          </InputRightElement>
        </InputGroup>
      </FormControl>

      <FormControl id="pic">
        <FormLabel>Upload your Picture</FormLabel>
        <Input
          type="file"
          p={1.5}
          accept="image/*"
          onChange={(e) => postDetails(e.target.files[0])}
        />
      </FormControl>

      <Button
        colorScheme="blue"
        width="100%"
        style={{ marginTop: 20 }}
        onClick={submitHandler}
        isLoading={picLoading}
      >
        Sign Up
      </Button>
    </VStack>
  )
}

export default SignUp
