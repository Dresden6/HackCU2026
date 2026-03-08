import {Card, Container, Title} from "@mantine/core";
import BackButton from "@/app/_components/navigation/backButton/BackButton";
import {useAnalysis} from "@/lib/swr";
import SimulationVisualization from "@/app/_components/home/simulation/SimulationVisualization";


interface Props {
    params: Promise<{ "sim-id": string }>;
}

export default async function SimulationPage({params}: Props) {
    const {"sim-id": simulationId} = await params;

    return (
        <Container size="lg" py="xl">
            <BackButton mb={15}/>
            <Card style={{minHeight: "400px", minWidth: 0}} mt={20}>
                <SimulationVisualization id={simulationId}/>
            </Card>
        </Container>
    );
}