import Image from "next/image"
import { Box, Button, Card, Container, Heading, Link, Stack, Text } from "@chakra-ui/react"

export default function Home() {
    return (
        <Container>
            <Heading>MaskFit AR NextJS Integration Code Sample.</Heading>
            <Box>
                <Heading>Scan Init Example</Heading>
                <Text></Text>
            </Box>

            <Stack>
                <Card.Root width="320px">
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
            </Stack>
        </Container>
    )
}
