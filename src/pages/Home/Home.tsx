import React from "react";
import Footer from "../../components/N&F/Footer";
import Navbar from "../../components/Navbar/Navbar";
import {
  Button,
  Flex,
  Heading,
  Image,
  Stack,
  Text,
  useBreakpointValue,
} from "@chakra-ui/react";

function Home() {
  return (
    <>
      <Navbar />
      <Stack minH={"100vh"} direction={{ base: "column", md: "row" }}>
        <Flex p={8} flex={1} align={"center"} justify={"center"}>
          <Stack spacing={6} w={"full"} maxW={"lg"}>
            <Heading fontSize={{ base: "3xl", md: "4xl", lg: "5xl" }}>
              <Text
                as={"span"}
                position={"relative"}
                _after={{
                  content: "''",
                  width: "full",
                  height: useBreakpointValue({ base: "20%", md: "30%" }),
                  position: "absolute",
                  bottom: 1,
                  left: 0,
                  bg: "blue.400",
                  zIndex: -1,
                }}
              >
                Happiness
              </Text>
              <br />{" "}
              <Text color={"blue.400"} as={"span"}>
                Amazing Events
              </Text>{" "}
            </Heading>
            <Text fontSize={{ base: "md", lg: "lg" }} color={"gray.500"}>
              Lorem ipsum dolor sit amet consectetur adipisicing elit. Tenetur
              eos tempora eveniet error consequatur dignissimos.
            </Text>
            <Stack direction={{ base: "column", md: "row" }} spacing={4}>
              <Button
                as={"a"}
                rounded={"full"}
                bg={"blue.400"}
                color={"white"}
                _hover={{
                  bg: "blue.500",
                }}
                href="/tickets"
              >
                Book Now
              </Button>
            </Stack>
          </Stack>
        </Flex>
        <Flex flex={1}>
          <Image
            alt={"Login Image"}
            objectFit={"cover"}
            src={
              "https://images.unsplash.com/photo-1492684223066-81342ee5ff30?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxzZWFyY2h8M3x8ZXZlbnR8ZW58MHx8MHx8&auto=format&fit=crop&w=500&q=60"
            }
          />
        </Flex>
      </Stack>
    </>
  );
}

export default Home;
