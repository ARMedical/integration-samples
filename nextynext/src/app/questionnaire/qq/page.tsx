"use client"
import {
    Alert,
    Box,
    Button,
    Container,
    Field,
    Heading,
    HStack,
    Input,
    RadioGroup,
    Stack,
    Text
} from "@chakra-ui/react"
import { ChangeEvent, useState } from "react"
import { getMaskFitQuestions, submitAnswers } from "~/actions"

import Ajv2020, { type ValidateFunction } from "ajv/dist/2020"
import type { Question } from "~/types/maskfit"

export default function QQ() {
    const [formFields, setFormFields] = useState({
        email: "hellopatientmifit@mailinator.com",
        phone: null,
        external_id: null
    })
    const [isLoading, setIsLoading] = useState(false)
    const [getListError, setGetListError] = useState<null | string>(null)

    const [questions, setQuestions] = useState([])

    const setValue = (e: ChangeEvent<HTMLInputElement>) => {
        const target = e.target.name
        const value = e.target.value

        setFormFields({ ...formFields, ...{ [target]: value } })
    }
    console.log("UPDATED", formFields)

    const fetchQuestions = async () => {
        setIsLoading(true)
        setGetListError(null)
        getMaskFitQuestions(formFields)
            .then((r) => {
                console.log("RECEVEIVVECV", r)
                setQuestions(r)
            })
            .finally(() => setIsLoading(false))
            .catch((e) => setGetListError(e.message))
    }
    return (
        <Container>
            <Stack gap={8}>
                <Box>
                    <Heading>Patient Questionnaire</Heading>
                    <Text>
                        Fill out the form below to interact the questionnaire functionality.
                    </Text>
                </Box>
                {getListError && (
                    <Alert.Root status={"error"}>
                        <Alert.Description>{getListError}</Alert.Description>
                    </Alert.Root>
                )}
                <Stack gap={4}>
                    <Field.Root>
                        <Field.Label>Patient Email</Field.Label>
                        <Input
                            type={"email"}
                            name={"email"}
                            onChange={setValue}
                            placeholder="Patient Email"
                            defaultValue={"hellopatientmifit@mailinator.com"}
                        />
                    </Field.Root>

                    <Field.Root>
                        <Field.Label>Patient Phone Number (+12135551212 format)</Field.Label>
                        <Input
                            type={"text"}
                            name={"phone"}
                            onChange={setValue}
                            placeholder="Patient Phone"
                        />
                    </Field.Root>

                    <Field.Root>
                        <Field.Label>
                            External ID (Up to 16 Characters that YOUR Platform provides if any.)
                        </Field.Label>
                        <Input
                            type={"text"}
                            name={"external_id"}
                            onChange={setValue}
                            placeholder="Patient External ID"
                        />
                    </Field.Root>
                    <Button disabled={isLoading} loading={isLoading} onClick={fetchQuestions}>
                        Fetch Questions
                    </Button>
                </Stack>
            </Stack>

            {questions.length > 0 && <QuestionList questions={questions} {...formFields} />}
        </Container>
    )
}

// coerceTypes lets "5" satisfy { type: "number" } — the API transports every answer as a string.
const ajv = new Ajv2020({ strict: false, coerceTypes: true, allErrors: true })
const cache = new Map<string, ValidateFunction>()

function compile(key: string, schema: Record<string, unknown>): ValidateFunction {
    let fn = cache.get(key)
    if (!fn) {
        fn = ajv.compile(schema)
        cache.set(key, fn)
    }
    return fn
}

export function validateAnswer(question: Question, value: string | undefined): string | null {
    const empty = value === undefined || value.trim() === ""
    if (empty) return question.required ? "This question is required." : null
    if (!question.validation_rule) return null

    // Wrap the scalar so Ajv can coerce it in place.
    const validate = compile(`val:${question.id}`, {
        type: "object",
        properties: { value: question.validation_rule }
    })
    if (validate({ value })) return null
    return ajv.errorsText(validate.errors, { dataVar: "value" })
}

function QuestionList({ questions = [], ...patientDetails }) {
    const [answers, setAnswers] = useState({})
    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState<null | string>(null)

    const saveAnswers = async () => {
        setIsLoading(true)
        setError(null)
        // validate answers with JSON Rules
        // Some questions are conditional in the sense that they are only visible or required depending on another question's answer
        // We use JSONRules to incorporate that functionality in a standardized way
        // `ajv` library allows to create and validate those rules.
        // REF: GitHub: https://github.com/ajv-validator/ajv
        // REF: NPM Registry https://www.npmjs.com/package/ajv
        // @Zaeem show how to do the validation.

        submitAnswers({ answers, ...{ email: "hellopatientmifit@mailinator.com" } })
            .then((r) => {
                console.log("SUBMITTES RES", r)
            })
            .finally(() => setIsLoading(false))
            .catch((e) => setError(e.message))
    }

    console.log("ANSWERS", answers)
    return (
        <Stack gap={5}>
            <Box>
                <Heading>Question List</Heading>
                {error && (
                    <Alert.Root status={"error"}>
                        <Alert.Description>{error}</Alert.Description>
                    </Alert.Root>
                )}
            </Box>
            {questions.map((q) => {
                return (
                    <>
                        <QuestionItem
                            key={q.id}
                            answers={answers}
                            question={q}
                            onChange={setAnswers}
                        />
                    </>
                )
            })}
            <Button disabled={isLoading} loading={isLoading} onClick={saveAnswers}>
                Submit Answers
            </Button>
        </Stack>
    )
}

function QuestionItem({ question = {}, answers, onChange }) {
    return (
        <Field.Root>
            <Field.Label>{question.name}</Field.Label>
            {/* If it is a single choice question, present it as a radio */}
            {["radio", "enum"].includes(question.question_type) && (
                <>
                    <HStack gap={4} wrap="wrap">
                        <RadioGroup.Root
                            onValueChange={(e) =>
                                onChange({ ...answers, ...{ [question.id]: e.value } })
                            }
                            value={answers?.[question.id] || question.answer || null}
                        >
                            <HStack gap={4} wrap="wrap">
                                {question.options.map((opt) => (
                                    <RadioGroup.Item key={opt.id} value={opt.id}>
                                        <RadioGroup.ItemHiddenInput />
                                        <RadioGroup.ItemIndicator />
                                        <RadioGroup.ItemText>{opt.name}</RadioGroup.ItemText>
                                    </RadioGroup.Item>
                                ))}
                            </HStack>
                        </RadioGroup.Root>
                    </HStack>
                </>
            )}
            {/* If it is a user provided input question where the user needs to type the answer, present it as a text */}
            {!["radio", "enum"].includes(question.question_type) && (
                <>
                    <Input
                        type={"text"}
                        name={question.id}
                        onChange={(e) =>
                            onChange({ ...answers, ...{ [question.id]: e.target.value } })
                        }
                        defaultValue={question.answer}
                        placeholder={question.name}
                    />
                </>
            )}
        </Field.Root>
    )
}
