import {Container, Title} from "@mantine/core";

interface Props {
    params: Promise<{ "simulation-id": string }>;
}

export default async function SimulationPage({ params }: Props) {


    return (
        <Container size="lg" py="xl">
            <Title order={3}>List of visualizations should be here...</Title>
            {/*<SimulationVisualization data={simulation} />*/}
        </Container>
    );
}