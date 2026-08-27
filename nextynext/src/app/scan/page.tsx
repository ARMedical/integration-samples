"use client"
import { Alert, Box, Button, Field, Heading, Input, Link, Stack } from "@chakra-ui/react"
import { useState } from "react"
import { getScanLink } from "~/actions"

export default function ScanSample() {
    const [isLoading, setIsLoading] = useState(false)
    const [patientEmail, setPatientEmail] = useState("kawemifithello18ptn@mailinator.com")
    const [error, setError] = useState()
    const [linkAcquired, setLinkAcquired] = useState()

    const initScan = async () => {
        setIsLoading(true)
        getScanLink({ email: patientEmail, redirect_url: window.location.href })
            .then((res) => {
                setLinkAcquired(res.url)
            })
            .catch((e) => setError(e.message))
            .finally(() => setIsLoading(false))
    }

    return (
        <div>
            <Heading>Hello there</Heading>

            <Stack gap={4}>
                <Heading as={"h4"}>Initiate a Scan</Heading>

                <Field.Root gap={4}>
                    <Field.Label>Patient Email</Field.Label>
                    <Field.ErrorText>{error}</Field.ErrorText>
                    <Input
                        defaultValue={patientEmail}
                        name={"email"}
                        onChange={(e) => setPatientEmail(e.target.value)}
                    />
                </Field.Root>

                <Button
                    loadingText={"Initiating Scan"}
                    loading={isLoading}
                    disabled={isLoading}
                    onClick={initScan}
                    colorPalette={"green"}
                    variant="solid"
                >
                    Click to acquire a face scan link and redirect to scan page.
                </Button>

                {linkAcquired && (
                    <Box>
                        <Alert.Root status="success" title="Scan Link Acquired">
                            <Alert.Description>
                                <Button asChild colorPalette={"blue"} variant={"outline"}>
                                    <Link href={linkAcquired}>Click to go scan</Link>
                                </Button>
                            </Alert.Description>
                        </Alert.Root>
                    </Box>
                )}
            </Stack>
        </div>
    )
}
