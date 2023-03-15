import React from 'react'
import {   Box, Container, Tab, TabList, TabPanel, TabPanels, Tabs, Text,} from '@chakra-ui/react'
import Login from '../components/authentication/Login'
import SignUp from '../components/authentication/Signup'

const homePage = () => {
  return (
    <Container maxW='xl' centerContent>
      <Box
        display="flex"
        justifyContent="center"
        bgColor="blackAlpha.500"
        p={3}
        w="100%"
        m="40px 0 15px 0"
        borderRadius="lg"
      >
        <Text fontSize="3xl" textTransform="uppercase" color="white"> Dungeon Chat Zone </Text>
      </Box>

      <Box bg="white" w="100%" p={4} borderRadius="lg" >
        <Tabs isFitted variant="soft-rounded">
          <TabList mb="1em">
            <Tab>Login</Tab>
            <Tab>Sign Up</Tab>
          </TabList>
          <TabPanels>
            <TabPanel>
              <Login/>
            </TabPanel>
            <TabPanel>
              <SignUp/>
            </TabPanel>
          </TabPanels>
        </Tabs>
      </Box>
      
    </Container>
  )
}

export default homePage
