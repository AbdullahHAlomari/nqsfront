import axios from "axios";
import React from "react";
import Navbar from "../../components/Navbar/Navbar";
import useSWR, { useSWRConfig } from "swr";
import {
  SimpleGrid,
  Stack,
  Flex,
  chakra,
  Box,
  ButtonGroup,
  IconButton,
  HStack,
  Image,
  Text,
} from "@chakra-ui/react";
import { useColorModeValue } from "@chakra-ui/color-mode";
import { DeleteIcon } from "@chakra-ui/icons";
import { Ticket } from "../../components/Tickets/TicketCard";
import moment from "moment";
import Swal from "sweetalert2";
import Cookies from "universal-cookie";
const cookies = new Cookies();

function Reservations() {
  const { mutate } = useSWRConfig();
  const role = cookies.get("ROLE");
  const token = cookies.get("TOKEN");
  const userID = cookies.get("ID");

  const bg = useColorModeValue("white", "gray.800");
  const bg2 = useColorModeValue("white", "gray.800");
  const bg3 = useColorModeValue("gray.100", "gray.700");

  const fetcher = async () => {
    let res;
    if (role == "admin") {
      res = await axios.get("http://localhost:3000/getAllReservations");
    } else {
      res = await axios.get(
        `http://localhost:3000/getUserReservations/${userID}`
      );
    }
    return res.data;
  };

  const { data, isLoading } = useSWR("reservations", fetcher);

  const deleteReservation = async (id: string) => {
    try {
      const res = await axios.delete(
        `http://localhost:3000/deletereservation/${id}`
      );
      if (res.status == 200) {
        Swal.fire(
          "You have Successfully deleted this reservation!",
          "",
          "success"
        );
      } else {
        Swal.fire("Error!", "Something went wrong!", "error");
      }
      mutate("reservations");
    } catch (err: any) {
      console.log(err);
      Swal.fire("Error!", err.message, "error");
    }
  };
  return (
    <>
      <Navbar />
      <Stack bg="#edf3f8" minHeight="90vh">
        {!isLoading && data && data.length == 0 && (
          <Text fontSize="2xl" textAlign={"center"} py={2}>
            You Don't have any reservations yet..
          </Text>
        )}
        {data && data.length > 0 && (
          <Flex
            w="full"
            _dark={{
              bg: "#3e3e3e",
            }}
            p={50}
            justifyContent="center"
          >
            <Stack
              direction={{
                base: "column",
              }}
              w="full"
              bg={{
                md: bg,
              }}
              shadow="lg"
            >
              {data.map((reservation: any) => {
                return (
                  <Flex
                    direction={{
                      base: "row",
                      md: "column",
                    }}
                    bg={bg2}
                    key={reservation.id}
                  >
                    <SimpleGrid
                      spacingY={3}
                      columns={{
                        base: 1,
                        md: 4,
                      }}
                      w={{
                        base: 120,
                        md: "full",
                      }}
                      textTransform="uppercase"
                      bg={bg3}
                      color={"gray.500"}
                      py={{
                        base: 1,
                        md: 4,
                      }}
                      px={{
                        base: 2,
                        md: 10,
                      }}
                      fontSize="md"
                      fontWeight="hairline"
                    >
                      <span>Ticket</span>
                      <span>User</span>
                      <span>Reserved At</span>
                      <chakra.span
                        textAlign={{
                          md: "right",
                        }}
                      >
                        Actions
                      </chakra.span>
                    </SimpleGrid>
                    <SimpleGrid
                      spacingY={3}
                      columns={{
                        base: 1,
                        md: 4,
                      }}
                      w="full"
                      py={2}
                      px={10}
                      fontWeight="hairline"
                    >
                      <span>
                        <HStack
                          marginTop="2"
                          spacing="4"
                          display="flex"
                          alignItems="center"
                        >
                          <Image
                            borderRadius="10px"
                            boxSize="60px"
                            src={reservation.ticket.image}
                            alt={`Avatar of ${reservation.ticket.image}`}
                          />
                          <Text fontWeight="medium">
                            {reservation.ticket.event}
                          </Text>
                        </HStack>
                      </span>

                      <chakra.span
                        textOverflow="ellipsis"
                        overflow="hidden"
                        whiteSpace="nowrap"
                      >
                        <Stack spacing={-1}>
                          <Text
                            fontWeight={600}
                          >{`${reservation.user.firstname} ${reservation.user.lastname}`}</Text>
                          <Text
                            fontSize={"sm"}
                            color={useColorModeValue("gray.600", "gray.400")}
                          >
                            {reservation.user.email}
                          </Text>
                        </Stack>
                      </chakra.span>
                      <span>
                        {moment().format("MMM Do YY", reservation.reservedAt)}
                      </span>
                      <span>
                        <Flex
                          justify={{
                            md: "end",
                          }}
                        >
                          <ButtonGroup variant="solid" size="sm" spacing={3}>
                            <IconButton
                              colorScheme="red"
                              variant="outline"
                              icon={<DeleteIcon />}
                              aria-label="Delete"
                              onClick={() => deleteReservation(reservation.id)}
                            />
                          </ButtonGroup>
                        </Flex>
                      </span>
                    </SimpleGrid>
                  </Flex>
                );
              })}
            </Stack>
          </Flex>
        )}
      </Stack>
    </>
  );
}

export default Reservations;
