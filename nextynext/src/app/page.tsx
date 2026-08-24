import { Button, Card, Container, Heading, Link, Stack, Text } from "@chakra-ui/react"

export default function Home() {
    return (
        <Container>
            <Heading>MaskFit AR NextJS Integration Code Samples</Heading>
            <Text color="fg.muted" mt={2}>
                Each example is a page under <code>src/app</code>; the MaskFit API calls are server
                actions in <code>src/actions</code>.
            </Text>

            <Stack direction={{ base: "column", md: "row" }} gap={4} mt={6} align="stretch">
                <Card.Root flex={1}>
                    <Card.Body gap="2">
                        <Card.Title mt="2">Acquring Face Scan Link</Card.Title>
                        <Card.Description>
                            Please follow the link to see how to initiate a face scan using MaskFit
                            AR API code sample.
                        </Card.Description>
                    </Card.Body>
                    <Card.Footer justifyContent="stretch">
                        <Button colorPalette={"blue"} variant="solid" asChild>
                            <Link href={"/scan"}>See Scan Example.</Link>
                        </Button>
                    </Card.Footer>
                </Card.Root>
                <Card.Root flex={1}>
                    <Card.Body gap="2">
                        <Card.Title mt="2">Questionnaire</Card.Title>
                        <Card.Description>
                            Please follow the link to see how to fetch a patient&apos;s
                            questionnaire, render it with your own components and submit the answers
                            back through the MaskFit AR Questionnaire API.
                        </Card.Description>
                    </Card.Body>
                    <Card.Footer justifyContent="stretch">
                        <Button colorPalette={"blue"} variant="solid" asChild>
                            <Link href={"/questionnaire"}>See Questionnaire Example.</Link>
                        </Button>
                    </Card.Footer>
                </Card.Root>
            </Stack>
        </Container>
    )
}
