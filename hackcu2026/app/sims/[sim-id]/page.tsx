import {Container, Title} from "@mantine/core";
import SimulationVisualization from "@/app/_components/home/simulation/SimulationVisualization";
import {SimulationResult} from "@/types/trade";

interface Props {
    params: Promise<{ "sim-id": string }>;
}

export default async function SimulationPage({params}: Props) {
    const {"sim-id": simulationId} = await params;
    // const simulation = await getSimulation(simulationId);

    return (
        <Container size="lg" py="xl">
            <Title order={3}>Show visualization with id {simulationId} here</Title>
            {/*<SimulationVisualization data={simulation} />*/}
        </Container>
    );
}