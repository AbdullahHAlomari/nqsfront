import { MapPin } from "react-feather";
import * as FeatherIcons from "react-feather";
import { FaTicketAlt } from "react-icons/fa";

import { AddIcon, DeleteIcon } from "@chakra-ui/icons";
import {
  AspectRatio,
  Badge,
  Box,
  Button,
  ButtonGroup,
  Flex,
  HStack,
  Icon,
  Image,
  Link,
  Skeleton,
  Stack,
  StackProps,
  Text,
  useColorModeValue,
} from "@chakra-ui/react";
import axios from "axios";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import Cookies from "universal-cookie";
import { useCountdown } from "../../hooks/useCountdown";
const cookies = new Cookies();

export type Ticket = {
  id: string;
  image: string;
  event: string;
  availableQty: Number;
  location: string;
  description: string;
  endDate: any;
};
interface Props {
  ticket: Ticket;
  rootProps?: StackProps;
}

export const TicketCard = (props: Props) => {
  const navigate = useNavigate();
  const role = cookies.get("ROLE");
  const email = cookies.get("Email");
  const token = cookies.get("TOKEN");

  const { ticket, rootProps } = props;
  const { id, image, event, availableQty, location, description, endDate } =
    ticket;

  const [days, hours, minutes, seconds] = useCountdown(endDate);

  console.log(days, hours, minutes, seconds);

  const handleDelete = async (id: string) => {
    if (!token) {
      navigate("/tickets");
      return;
    }

    try {
      const res = await axios.delete(
        `http://localhost:3000/deleteTicketById/${id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      console.log(res);
      if (res.status === 200) {
        Swal.fire(
          "Deleted!",
          `You have successfully deleted ticket ${id}!`,
          "success"
        );
        // You can add more logic here to update the ticket list after deletion
      } else {
        Swal.fire("Error!", "Something went wrong!", "error");
      }
    } catch (err) {
      console.error(err);
      Swal.fire("Error!", "Something went wrong!", "error");
    }
  };

  const handleReservation = async (id: string) => {
    if (!token) {
      navigate("/signin");
      return;
    }
    if (days === 0 && hours === 0 && minutes === 0 && seconds === 0) {
      Swal.fire("Closed!", "Reservation is closed for this event.", "error");
      return;
    }
    try {
      const res = await axios.post(
        "http://localhost:3000/reserve",
        {
          ticketId: id,
          email: email,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      console.log(res);
      if (res.status == 201) {
        Swal.fire(
          "Great!",
          "You have Successfully reserved this event!",
          "success"
        );
      } else {
        Swal.fire("Error!", "Something went wrong!", "error");
      }
    } catch (err) {
      Swal.fire("Sorry!", "You have Already reserved this ticket!", "error");
    }
  };

  const isClosed = days === 0 && hours === 0 && minutes === 0 && seconds === 0;
  return (
    <Stack
      spacing={{ base: "4", md: "5" }}
      {...rootProps}
      alignContent={"center"}
      textAlign={"center"}
    >
      <Box position="relative">
        <AspectRatio ratio={4 / 3}>
          <Image
            src={image}
            alt={event}
            draggable="false"
            fallback={<Skeleton />}
            borderRadius={{ base: "md", md: "xl" }}
          />
        </AspectRatio>
        {isClosed && (
          <Badge
            position="absolute"
            bottom="0"
            right="0"
            colorScheme="red"
            p="1"
            borderRadius="md"
            fontSize="lg" // add this prop
          >
            Closed
          </Badge>
        )}
      </Box>
      <Stack>
        <Stack spacing="1">
          <Text
            fontWeight="medium"
            color={useColorModeValue("gray.700", "gray.400")}
          >
            {event}
          </Text>
          <Text fontSize="sm" color={useColorModeValue("gray.600", "gray.400")}>
            {description}
          </Text>
        </Stack>
        <HStack>
          <Text color="teal.600" textTransform="uppercase">
            <Icon mr={2} as={MapPin} />
            {location}
          </Text>
        </HStack>
        <HStack>
          <Text
            fontSize="sm"
            color={useColorModeValue("gray.600", "gray.400")}
            variant="span"
            display="inline-block"
          >
            <Icon mr={2} as={FaTicketAlt} />
            <Text display={"inline"}>Quantity:</Text>
          </Text>
          <Text
            fontSize="md"
            display="inline-block"
            color={useColorModeValue("gray.600", "gray.400")}
          >
            <>{availableQty}</>
          </Text>
        </HStack>
      </Stack>
      <Flex gap={2} align={"center"}>
        <Flex direction={"column"} align="center">
          <Text>{days}</Text>
          <Text fontWeight={"bold"}>Days</Text>
        </Flex>
        <Text fontSize={"xl"} fontWeight={"bold"}>
          :
        </Text>
        <Flex direction={"column"} align="center">
          <Text>{hours}</Text>
          <Text fontWeight={"bold"}>Hours</Text>
        </Flex>
        <Text fontSize={"xl"} fontWeight={"bold"}>
          :
        </Text>
        <Flex direction={"column"} align="center">
          <Text>{minutes}</Text>
          <Text fontWeight={"bold"}>Minutes</Text>
        </Flex>
        <Text fontSize={"xl"} fontWeight={"bold"}>
          :
        </Text>
        <Flex direction={"column"} align="center">
          <Text>{seconds}</Text>
          <Text fontWeight={"bold"}>Seconds</Text>
        </Flex>
      </Flex>
      <ButtonGroup spacing="2">
        <Button
          variant="solid"
          w={"50%"}
          colorScheme="blue"
          onClick={() => handleReservation(id)}
        >
          Book Event
        </Button>
        <Button
          as={"a"}
          variant="solid"
          colorScheme="purple"
          href={`tickets/${id}`}
        >
          Details
        </Button>

        {role === "admin" && (
          <Button
            as={"a"}
            colorScheme={"purple"}
            // size={"sm"}
            mr={0}
            onClick={() => handleDelete(id)}
            display="flex"
            alignItems="center"
          >
            <DeleteIcon />
          </Button>
        )}
      </ButtonGroup>
      <Stack align="center"></Stack>
    </Stack>
  );
};
