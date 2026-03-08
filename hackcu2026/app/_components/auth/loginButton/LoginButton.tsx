import {Box, Button, Text} from "@mantine/core";
import {signIn} from "next-auth/react";
import Image from "next/image";

export default function LoginButton() {
    return (
        <>
            <form
                action={async () => {
                    await signIn("google")
                }}
            >
                <Button type="submit" variant={"outline"} hiddenFrom={"sm"}>
                    <Image src={"/Google_G_logo.svg"} alt={""} width={20} height={20}/>
                    <Text ml={5}>Log In</Text>
                </Button>
                <Button type="submit" variant={"outline"} visibleFrom={"sm"}>
                    <Image src={"/Google_G_logo.svg"} alt={""} width={20} height={20}/>
                    <Text ml={5}>Log In With Google</Text>
                </Button>
            </form>
        </>
    );
}

