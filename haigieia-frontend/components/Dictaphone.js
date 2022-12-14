import React, {useEffect} from "react";
import SpeechRecognition, {
    useSpeechRecognition,
} from "react-speech-recognition";
import { Text, ActionIcon, MantineProvider, Center } from "@mantine/core";
import { IconMicrophone } from "@tabler/icons";

const Dictaphone = ({text, setText, setActiveListening}) => {

    // FIXME - This is where you would add the logic for an alternative speech recognition service, make sure to setText() with the result.
    const {
        transcript,
        listening,
        resetTranscript,
        browserSupportsSpeechRecognition,
    } = useSpeechRecognition();

    useEffect(() => {
        setText(transcript);
        setActiveListening(listening)
      }, [listening, transcript])

    if (!browserSupportsSpeechRecognition) {
        return <span>Browser doesn&apos;t support speech recognition.</span>;
    }

    return (
        <MantineProvider theme={{ loader: "bars" }}>
            <Center>
                <ActionIcon
                    color="blue"
                    size={50}
                    radius="md"
                    variant="filled"
                    onClick={SpeechRecognition.startListening}
                    loading={listening}
                >
                    <IconMicrophone size={24} />
                </ActionIcon>
                
            </Center>
        </MantineProvider>
    );
};
export default Dictaphone;
