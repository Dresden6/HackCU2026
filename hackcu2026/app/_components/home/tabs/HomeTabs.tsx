"use client";
import {Tabs, TextInput, Textarea, Button, Stack, FileInput} from "@mantine/core";
import {useState} from "react";

export default function HomeTabs() {
    //states for each input type
    const [url, setUrl] = useState("");
    const [text, setText] = useState("");
    const [file, setFile] = useState<File | null>(null);

    //handlers for each input type; TODO: call actual API 
    const handleUrlSubmit = () =>{
        console.log("Analyzing URL:", url);
    };
    const handleTextSubmit = () =>{
        console.log("Analyzing Text:", text);
    };
    const handleFileSubmit = () =>{
        console.log("Analyzing File:", file);
    };
    
    return (
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
                        label = "Content URL"
                        description = "Link to a Youtube video."
                        placeholder="https://youtube.com/watch?v=..."
                        value={url}
                        onChange={(e) => setUrl(e.currentTarget.value)}
                    />
                    <Button onClick = {handleUrlSubmit}>Analyze</Button>
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
    );
}

