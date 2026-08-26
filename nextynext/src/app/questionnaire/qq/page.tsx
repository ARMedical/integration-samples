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
import type { Answers, PatientLookup, Question } from "~/types/maskfit"

export default function QQ() {
    const [formFields, setFormFields] = useState<PatientLookup>({
        email: "",
        phone: "",
        external_id: ""
    })
    const [isLoading, setIsLoading] = useState(false)
    const [getListError, setGetListError] = useState<null | string>(null)

    const [questions, setQuestions] = useState<Question[]>([])

    const setValue = (e: ChangeEvent<HTMLInputElement>) => {
        const target = e.target.name
        const value = e.target.value

        setFormFields({ ...formFields, ...{ [target]: value } })
    }

    const fetchQuestions = async () => {
        setIsLoading(true)
        setGetListError(null)
        setQuestions([])
        getMaskFitQuestions(formFields)
            .then((r) => setQuestions(r))
            .catch((e) => setGetListError(e.message))
            .finally(() => setIsLoading(false))
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
                            value={formFields.email ?? ""}
                            autoComplete="off"
                            onChange={setValue}
                            placeholder="Patient Email"
                        />
                    </Field.Root>

                    <Field.Root>
                        <Field.Label>Patient Phone Number (+12135551212 format)</Field.Label>
                        <Input
                            type={"text"}
                            name={"phone"}
                            value={formFields.phone ?? ""}
                            autoComplete="off"
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
                            value={formFields.external_id ?? ""}
                            autoComplete="off"
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

// Some questions are conditional: they are only visible (and therefore required)
// depending on another question's answer. Both 'visibility_rule' and
// 'validation_rule' are JSON Schema, so one validator (`ajv`) handles both.
// REF: GitHub: https://github.com/ajv-validator/ajv
// REF: NPM Registry https://www.npmjs.com/package/ajv
//
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

/** A question is visible when the current answers satisfy its visibility_rule (or it has none). */
export function isVisible(question: Question, answers: Answers): boolean {
    if (!question.visibility_rule || Object.keys(question.visibility_rule).length === 0) return true
    return compile(`vis:${question.id}`, question.visibility_rule)({ ...answers })
}

/** Returns an error message for the value, or null when it is valid. */
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

/** The answers as MaskFit currently has them, overlaid with what the user changed on this page. */
function currentAnswers(questions: Question[], answers: Answers): Answers {
    const current: Answers = {}
    for (const q of questions) if (q.answer != null) current[q.id] = q.answer
    return { ...current, ...answers }
}

function QuestionList({
    questions = [],
    ...patientDetails
}: { questions: Question[] } & PatientLookup) {
    // Only the answers changed on this page — the API merges them with what it already has.
    const [answers, setAnswers] = useState<Answers>({})
    const [errors, setErrors] = useState<Record<string, string>>({})
    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState<null | string>(null)
    const [saved, setSaved] = useState(false)

    const current = currentAnswers(questions, answers)
    const visibleQuestions = questions.filter((q) => isVisible(q, current))

    const saveAnswers = async () => {
        setError(null)
        setSaved(false)

        // Validate every visible question against its JSON Schema rules before submitting.
        const nextErrors: Record<string, string> = {}
        for (const q of visibleQuestions) {
            const message = validateAnswer(q, current[q.id])
            if (message) nextErrors[q.id] = message
        }
        setErrors(nextErrors)
        if (Object.keys(nextErrors).length > 0) return

        setIsLoading(true)
        submitAnswers({ answers, ...patientDetails })
            .then(() => setSaved(true))
            .catch((e) => setError(e.message))
            .finally(() => setIsLoading(false))
    }

    return (
        <Stack gap={5}>
            <Box>
                <Heading>Question List</Heading>
                {error && (
                    <Alert.Root status={"error"}>
                        <Alert.Description>{error}</Alert.Description>
                    </Alert.Root>
                )}
                {saved && (
                    <Alert.Root status={"success"}>
                        <Alert.Description>Answers updated successfully.</Alert.Description>
                    </Alert.Root>
                )}
            </Box>
            {visibleQuestions.map((q) => (
                <QuestionItem
                    key={q.id}
                    answers={answers}
                    question={q}
                    error={errors[q.id]}
                    onChange={(next) => {
                        setAnswers(next)
                        setSaved(false)
                    }}
                />
            ))}
            <Button disabled={isLoading} loading={isLoading} onClick={saveAnswers}>
                Submit Answers
            </Button>
        </Stack>
    )
}

function QuestionItem({
    question,
    answers,
    error,
    onChange
}: {
    question: Question
    answers: Answers
    error?: string
    onChange: (answers: Answers) => void
}) {
    const isRadio = ["radio", "enum"].includes(question.question_type ?? "")
    return (
        <Field.Root invalid={!!error} required={question.required}>
            <Field.Label>
                {question.name}
                <Field.RequiredIndicator />
            </Field.Label>
            {/* If it is a single choice question, present it as a radio */}
            {isRadio && (
                <HStack gap={4} wrap="wrap">
                    <RadioGroup.Root
                        onValueChange={(e) =>
                            onChange({ ...answers, ...{ [question.id]: e.value ?? "" } })
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
            )}
            {/* If it is a user provided input question where the user needs to type the answer, present it as a text */}
            {!isRadio && (
                <Input
                    type={"text"}
                    name={question.id}
                    onChange={(e) => onChange({ ...answers, ...{ [question.id]: e.target.value } })}
                    defaultValue={question.answer ?? undefined}
                    placeholder={question.name ?? undefined}
                />
            )}
            <Field.ErrorText>{error}</Field.ErrorText>
        </Field.Root>
    )
}
