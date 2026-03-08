"use client";
import {Tabs, TextInput, Textarea, Button, Stack, FileInput, Card, Skeleton, Text} from "@mantine/core";
import {useState} from "react";
import LoadingOverlay from "@/app/_components/home/loading/LoadingOverlay";
import {ParsedTrade, SimulateResponse} from "@/types/trade";
import SimulationVisualization from "@/app/_components/home/simulation/SimulationVisualization";

export default function HomeTabs() {
    //states for each input type
    const [url, setUrl] = useState("");
    const [text, setText] = useState("");
    const [file, setFile] = useState<File | null>(null);

    //state for tracking API call status and results
    const [loading, setLoading] = useState(false);
    const [result, setResult] = useState<SimulateResponse | null>(null);
    const [error, setError] = useState<string | null>(null);

    // Shared helper: run simulate after a successful analyze response
    const runSimulate = async (parsedTrade: ParsedTrade) => {
        const simResponse = await fetch('/api/simulate', {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({parsedTrade}),
        });
        if (!simResponse.ok) throw new Error('Simulation failed');
        return simResponse.json();
    };

    const handleUrlSubmit = async () => {
        if (!url.trim()) return;
        setLoading(true);
        setError(null);
        try {
            const analyzeRes = await fetch('/api/analyze', {
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify({url}),
            });
            if (!analyzeRes.ok) throw new Error('Analysis failed');
            const analyzeData = await analyzeRes.json();

            const simData = await runSimulate(analyzeData.parsedTrade);
            setResult({...analyzeData, simulation: simData.simulation});
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Unknown error');
        } finally {
            setLoading(false);
        }
    };

    const handleTextSubmit = async () => {
        if (!text.trim()) return;
        setLoading(true);
        setError(null);
        try {
            const analyzeRes = await fetch('/api/analyze', {
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify({text}),
            });
            if (!analyzeRes.ok) throw new Error('Analysis failed');
            const analyzeData = await analyzeRes.json();

            const simData = await runSimulate(analyzeData.parsedTrade);
            console.log(simData);
            setResult({...analyzeData, simulation: simData.simulation});
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Unknown error');
        } finally {
            setLoading(false);
        }
    };

    const handleFileSubmit = async () => {
        if (!file) return;
        setLoading(true);
        setError(null);
        try {
            // File uploads must use multipart/form-data — do NOT set Content-Type manually,
            // the browser sets it automatically with the correct boundary when using FormData
            const formData = new FormData();
            formData.append('audio', file);

            const analyzeRes = await fetch('/api/analyze', {
                method: 'POST',
                body: formData,
            });
            if (!analyzeRes.ok) throw new Error('Analysis failed');
            const analyzeData = await analyzeRes.json();

            const simData = await runSimulate(analyzeData.parsedTrade);
            setResult({...analyzeData, simulation: simData.simulation});
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Unknown error');
        } finally {
            setLoading(false);
        }
    };

    return (<>
            {loading && <LoadingOverlay/>}
            {/*@ts-expect-error This works, but says you can't do align on Card*/}
            <Card style={{minHeight: "400px"}} align={"center"}>
                <Tabs defaultValue="url">
                    <Tabs.List>
                        <Tabs.Tab value="url">URL</Tabs.Tab>
                        <Tabs.Tab value="text">Text</Tabs.Tab>
                        <Tabs.Tab value="file">Audio File</Tabs.Tab>
                    </Tabs.List>

                    {/* URL Tab */}
                    <Tabs.Panel value="url" pt="md">
                        <Stack>
                            <TextInput
                                label="Content URL"
                                description="Link to a Youtube video."
                                placeholder="https://youtube.com/watch?v=..."
                                value={url}
                                onChange={(e) => setUrl(e.currentTarget.value)}
                            />
                            <Button onClick={handleUrlSubmit}>Analyze</Button>
                        </Stack>
                    </Tabs.Panel>

                    {/* Text Tab */}
                    <Tabs.Panel value="text" pt="md">
                        <Stack>
                            <Textarea
                                label="Paste financial advice"
                                description="Paste any text — a newsletter, post, transcript, etc."
                                placeholder="Paste the text you want to analyze..."
                                minRows={6} // sets the minimum visible height of the textarea
                                value={text}
                                onChange={(e) => setText(e.currentTarget.value)}
                            />
                            <Button onClick={handleTextSubmit}>Analyze</Button>
                        </Stack>
                    </Tabs.Panel>

                    {/* File Tab */}
                    <Tabs.Panel value="file" pt="md">
                        <Stack>
                            <FileInput
                                label="Upload audio or video file"
                                description="Accepted formats: MP3, MP4, M4A"
                                placeholder="Click to select a file"
                                // accept restricts the file picker to these MIME types only
                                accept="audio/mpeg,video/mp4,audio/mp4,audio/x-m4a"
                                value={file}
                                // FileInput returns the File object directly (no event wrapper)
                                onChange={setFile}
                            />
                            {/* Disable the button until a file has been selected */}
                            <Button onClick={handleFileSubmit} disabled={!file}>
                                Analyze
                            </Button>
                        </Stack>
                    </Tabs.Panel>

                </Tabs>
            </Card>

            {/*@ts-expect-error This works, but says you can't do align on Card*/}
            {loading && <Card style={{minHeight: "400px"}} align={"center"} mt={20}>
                <Skeleton w={"100%"} h={400} />
            </Card>}

            {/*@ts-expect-error This works, but says you can't do align on Card*/}
            {!loading && error && <Card style={{minHeight: "400px"}} align={"center"} mt={20}>
                <Text c={"red"}>There&#39;s been an unexpected error...</Text>
            </Card>}

            {!loading && result && <Card style={{minHeight: "400px", minWidth: 0}} mt={20}>
                <SimulationVisualization data={result.simulation}/>
            </Card>}
        </>
    );
}

