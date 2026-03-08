import {Box, Flex, Loader, Overlay} from "@mantine/core";


export default function LoadingOverlay() {
    return (<>
        <Overlay fixed color="#000" backgroundOpacity={0.25} w={"100%"} h={"100%"}>
            <Flex w={"100%"} h={"100%"} align={"center"} justify={"center"}>
                <Loader/>
            </Flex>
        </Overlay>
    </>);
}