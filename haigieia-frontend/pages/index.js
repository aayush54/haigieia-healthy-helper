import React, { useEffect, useState } from "react";
import { useAuth } from "../context/authUserContext";
import { useDatabase } from "../context/userDataContext";
import {
    Button,
    Center,
    Container,
    Loader,
    Paper,
    Stack,
    Text,
    TextInput,
    useMantineTheme,
} from "@mantine/core";
import Dictaphone from "../components/Dictaphone";
import { useScrollIntoView } from "@mantine/hooks";
import { useForm } from "@mantine/form";
import Splash from "../components/Splash";

export default function Home() {
    const { authUser, loading } = useAuth();
    const { updateWaterLevel, addMeal } = useDatabase();
    const theme = useMantineTheme();
    const [text, setText] = useState("");
    const [activeListening, setActiveListening] = useState(false);
    const [conversation, setConversation] = useState([]);
    const { scrollIntoView, targetRef, scrollableRef } = useScrollIntoView({
        duration: 200,
    });

    const form = useForm({
        initialValues: {
            text: "",
        },
        validate: {
            text: (value) => {
                if (!value) return "Text is required";
            },
        },
    });

    // Generate a response to the user's input text using the Dialogflow API. Then display the response using Typed.js
    useEffect(() => {
        if (text !== "" && !activeListening) {
            dialogFlow(text);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [activeListening]);

    const dialogFlow = (text) => {
        console.log("Completed: " + text);
        setConversation((conversation) => [
            ...conversation,
            { text: text, type: "user" },
        ]);
        scrollIntoView();
        form.setFieldValue("text", "");
        // make a request to an expressjs server running on localhost:5000 with the user's input text
        var response = fetch("http://localhost:5000/dialogflow", { 
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ text: text }),
        })
            .then((res) => res.json())
            .then((data) => {
                console.log(data);
                return data.text;
            })
            .catch((err) => {
                console.log(err);
                return "Sorry, I didn't get that.";
            });
        // wait for the response from the server

        setTimeout(() => {
            setConversation((conversation) => [
                ...conversation,
                { text: response, type: "bot" },
            ]);
            scrollIntoView();
        }, timeout);

        console.log(conversation);
    };

    const Conversation = conversation.map((item, index) => (
        <Paper
            key={index}
            shadow="md"
            radius="md"
            p="xs"
            m="xs"
            style={{
                backgroundColor:
                    item.type === "user" ? "#ffffff" : "lightsteelblue",
                maxWidth: "80%",
                float: item.type === "user" ? "left" : "right",
                marginLeft:
                    item.type === "user"
                        ? "0"
                        : `calc(50% - ${
                              (1 -
                                  (250 - Math.min(item.text.length, 250)) /
                                      250) *
                              50
                          }%)`,
                marginRight:
                    item.type === "user"
                        ? `calc(50% - ${
                              (1 -
                                  (250 - Math.min(item.text.length, 250)) /
                                      250) *
                              50
                          }%)`
                        : "0",
            }}
            ref={index === conversation.length - 1 ? targetRef : null}
        >
            <Text size="sm" color="dark.9">
                {item.text}
            </Text>
        </Paper>
    ));

    return (
        <>
            {loading ? (
                <Center style={{ width: "100%", height: "100%" }}>
                    <Loader size="100" />
                </Center>
            ) : (
                <Container size="lg" style={{ height: "100%" }}>
                    {!authUser ? (
                        <Splash />
                    ) : (
                        <Stack justify="flex-end" style={{ height: "100%" }}>
                            <Paper p="sm">
                                <Text
                                    variant="gradient"
                                    gradient={{
                                        from: "indigo.8",
                                        to: "cyan",
                                        deg: 135,
                                    }}
                                    sx={{
                                        fontFamily: "Orbitron, sans-serif",
                                    }}
                                    ta="center"
                                    fz="xl"
                                    fw={700}
                                >
                                    Talk to Haigeia:
                                </Text>
                                <Container
                                    size="fluid"
                                    p="sm"
                                    mb="sm"
                                    style={{
                                        borderRadius: "10px",
                                        maxHeight: "65vh",
                                        overflowY: "auto",
                                        position: "relative",
                                    }}
                                    ref={scrollableRef}
                                >
                                    {Conversation}
                                </Container>
                                {activeListening ? (
                                    <Paper
                                        shadow="md"
                                        radius="md"
                                        p="xs"
                                        m="xs"
                                        styles={(theme) => ({
                                            float: "left",
                                            marginRight: `calc(50% - ${
                                                (1 -
                                                    (250 -
                                                        Math.min(
                                                            text.length,
                                                            250
                                                        )) /
                                                        250) *
                                                50
                                            }%)`,
                                        })}
                                    >
                                        <Text size="sm">
                                            {text}
                                            <Loader
                                                color={theme.colors.blue[5]}
                                                size="xs"
                                                variant="dots"
                                                pl={1}
                                            />
                                        </Text>
                                    </Paper>
                                ) : (
                                    <></>
                                )}
                            </Paper>
                            <form
                                onSubmit={form.onSubmit((values) =>
                                    dialogFlow(values.text)
                                )}
                            >
                                <TextInput
                                    variant="filled"
                                    radius="md"
                                    size="lg"
                                    placeholder="Start typing or use voice"
                                    mb={50}
                                    rightSection={
                                        <Dictaphone
                                            setText={setText}
                                            setActiveListening={
                                                setActiveListening
                                            }
                                        />
                                    }
                                    {...form.getInputProps("text")}
                                />
                            </form>
                        </Stack>
                    )}
                </Container>
            )}
        </>
    );
}
