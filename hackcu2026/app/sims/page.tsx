"use client";
import { useHistory } from "@/lib/swr";
import { Container, Title, Stack, Card, Text, Skeleton } from "@mantine/core";
import Link from "next/link";

export default function SimulationPage() {
    const { items, isLoading, error } = useHistory();

    return (
        <Container size="lg" py="xl">
            <Title order={3} mb="md">Previous Simulations</Title>

            {isLoading && (
                <Stack>
                    {Array.from({ length: 4 }).map((_, i) => (
                        <Skeleton key={i} h={70} radius="md" />
                    ))}
                </Stack>
            )}

            {error && <Text c="red">{error}</Text>}

            {!isLoading && !error && items.length === 0 && (
                <Text c="dimmed">No simulations yet.</Text>
            )}

            <Stack>
                {items.map((el) => (
                    <Link key={el._id} href={`/sims/${el._id}`} style={{ textDecoration: "none" }}>
                        <Card withBorder padding="md" radius="md">
                            <Text fw={500}>{el.parsedTrade?.ticker ?? "Unknown ticker"}</Text>
                            <Text size="sm" c="dimmed">
                                {new Date(el.createdAt).toLocaleString()}
                            </Text>
                        </Card>
                    </Link>
                ))}
            </Stack>
        </Container>
    );
}