import Image from "next/image";
import styles from "./page.module.css";
import {Box, Button, Container, Stack, Title} from "@mantine/core";
import HomeTabs from "@/app/_components/home/tabs/HomeTabs";
import {bitcount} from "@/app/fonts";

export default function Home() {
    return (
        <>
            <Container size="md">
                <Stack>
                    <Title order={1}>Trade Truth</Title>
                    In a world of of rugpulls and pump-and-dumps, TradeTruth stands for transparency. Our tool allows you to analyze various forms of financial advice to scan for potential red flags and allow you to avoid malicious actors.
                    <HomeTabs/>
                </Stack>
            </Container>
        </>
    );
}
