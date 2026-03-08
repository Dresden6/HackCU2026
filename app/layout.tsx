import '@mantine/core/styles.css';
import '@mantine/notifications/styles.css';
import '@mantine/charts/styles.css';
import "./globals.css"
import type {Metadata} from "next";
import CustomAppShell from "@/app/_components/navigation/CustomAppShell";
import {ColorSchemeScript, MantineProvider, mantineHtmlProps, createTheme} from '@mantine/core';
import {Notifications} from '@mantine/notifications';
import {LazyMotion, domAnimation} from "motion/react"
import {orbitron, roboto} from "@/app/fonts";
import {SessionProvider} from "next-auth/react";


export const metadata: Metadata = {
    title: "TradeTruth",
    description: "Fact-Check Financial Advice with TradeTruth.",
};

const theme = createTheme({
    primaryColor: "custom-primary",
    colors: {
        "custom-primary": ["#4C0019", "#730026", "#990033", "#BF0141", "#E5024E", "#FE0357", "#FE2D72", "#FE578D", "#FE81A8", "#FEABC3"],
    },
    headings: {
        fontFamily: orbitron.style.fontFamily,
        fontWeight: "900",
    },
});

export default function RootLayout({
                                       children,
                                   }: Readonly<{
    children: React.ReactNode;
}>) {


    const defaultScheme = "light";


    return (
        <html lang="en" {...mantineHtmlProps} className={roboto.className}>
        <head>
            <ColorSchemeScript defaultColorScheme={defaultScheme}/>
            <title>
                HackCU 2026
            </title>
        </head>
        <body>
        <SessionProvider>
            <MantineProvider defaultColorScheme={defaultScheme} theme={theme}>
                <Notifications/>
                <LazyMotion features={domAnimation}>
                    <CustomAppShell>
                        {children}
                    </CustomAppShell>
                </LazyMotion>
            </MantineProvider>
        </SessionProvider>
        </body>
        </html>
    );
}
