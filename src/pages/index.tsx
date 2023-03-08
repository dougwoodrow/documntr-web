import React from "react";
import {
    Box,
    Button,
    ChakraProvider,
    Code,
    Divider,
    Flex,
    Heading,
    HStack,
    Image,
    Link,
    Spinner,
    Text,
    Textarea,
    useToast,
    VStack
} from "@chakra-ui/react";
import ReactMarkdown from "react-markdown";

export default function Home() {
    const toast = useToast()
    const [loading, setLoading] = React.useState<boolean>(false)
    const [docs, setDocs] = React.useState<any>(null)
    const [input, setInput] = React.useState<any>("# Paste your Markdown here\n\nJust paste all of your code's contents concat'ed into this field...")
    const isDefaultInput = input === "# Paste your Markdown here\n\nJust paste all of your code's contents concat'ed into this field..."

    const generateDocs = async () => {
        const myHeaders = new Headers();
        myHeaders.append("Content-Type", "application/json");

        const raw = JSON.stringify({
            "data": input
        });

        const requestOptions = {
            method: 'POST',
            headers: myHeaders,
            body: raw,
        };

        try {
            setLoading(true)
            const res = await fetch("http://localhost:5000/generate_docs", requestOptions)
            const body = await res.json()
            setLoading(false)
            setDocs(body.data)
        } catch (error) {
            setLoading(false)
            toast({
                title: "Error",
                description: "Something went wrong, please try again shortly",
                status: "error",
            })
        }
    }

    return (
        <>
            <ChakraProvider>
                <Flex justifyContent="center" alignItems="center" minH="100vh" w="100vw" pt="100px">
                    <VStack w="1200px">
                        <HStack w="100%">
                            <VStack w="100%">
                                <Textarea value={input} onChange={(e) => setInput(e.target.value)} minH="50vh" h="100%"
                                          w="100%"/>
                            </VStack>
                            <ReactMarkdown className="markdown" components={{
                                h1: ({node, ...props}) => <Heading py="2" size="lg" {...props} />,
                                h2: ({node, ...props}) => <Heading py="2" size="md" {...props} />,
                                h3: ({node, ...props}) => <Heading size="sm" {...props} />,
                                p: ({node, ...props}) => <Text pt="3" {...props} />,
                                code: ({node, ...props}) => <Code borderRadius="5px" p="7px" {...props} />,
                                hr: ({node, ...props}) => <Divider my="6" w="100%" {...props} />,
                                img: ({node, ...props}) => <Image alt="" my="4" {...props} />,
                                a: ({node, ...props}) => <Link {...props} />,
                            }}>{input}</ReactMarkdown>
                        </HStack>
                        <Button size="sm" w="100%" onClick={() => generateDocs()}
                                disabled={isDefaultInput || loading}>Generate
                            the docs...</Button>
                        {loading && (
                            <Box p="20px">
                                <VStack>
                                    <Spinner/>
                                    <Text>Loading...</Text>
                                </VStack>
                            </Box>
                        )}
                        {docs && (
                            <ReactMarkdown className="markdown" components={{
                                h1: ({node, ...props}) => <Heading py="2" size="lg" {...props} />,
                                h2: ({node, ...props}) => <Heading py="2" size="md" {...props} />,
                                h3: ({node, ...props}) => <Heading size="sm" {...props} />,
                                p: ({node, ...props}) => <Text pt="3" {...props} />,
                                code: ({node, ...props}) => <Code p="10px" w="100%" {...props} />,
                                hr: ({node, ...props}) => <Divider my="6" w="100%" {...props} />,
                                img: ({node, ...props}) => <Image alt="" my="4" {...props} />,
                                a: ({node, ...props}) => <Link {...props} />,
                            }}>{docs}</ReactMarkdown>)}
                    </VStack>
                </Flex>
            </ChakraProvider>
        </>
    )
}
