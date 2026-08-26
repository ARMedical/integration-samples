"use client"
import { Alert, Heading, Stack, Text } from "@chakra-ui/react"
import { useState } from "react"
import { listQuestions, submitAnswers } from "~/actions"
import type {
    Answers,
    PatientLookup as Lookup,
    Question,
    SubmitAnswersResult
} from "~/types/maskfit"
import { PatientLookup } from "./components/PatientLookup"
import { QuestionnaireForm } from "./components/QuestionnaireForm"

/**
 * Questionnaire example.
 *
 * Render a patient's MaskFit questionnaire in your own UI and push the answers
 * back. Both calls go through server
 * actions (see ~/actions) so the API credential stays on the server.
 *
 *   1. listQuestions({ email | phone | external_id })  -> questions + existing answers
 *   2. submitAnswers(lookup, { [questionId]: value })  -> partial update
 */
export default function QuestionnaireSample() {
    const [lookup, setLookup] = useState<Lookup | null>(null)
    const [questions, setQuestions] = useState<Question[] | null>(null)
    const [isLoading, setIsLoading] = useState(false)
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [error, setError] = useState<string | null>(null)

    const load = async (next: Lookup) => {
        setIsLoading(true)
        setError(null)
        setQuestions(null)
        try {
            const res = await listQuestions(next)
            if (!res.status) {
                setError(`${res.error} (${res.error_code})`)
                return
            }
            setLookup(next)
            setQuestions(res.data)
        } catch (e) {
            setError((e as Error).message)
        } finally {
            setIsLoading(false)
        }
    }

    const submit = async (answers: Answers): Promise<SubmitAnswersResult | null> => {
        if (!lookup) return null
        setIsSubmitting(true)
        setError(null)
        try {
            // submitAnswers throws with the API's error message when status is false.
            const result = await submitAnswers({ ...lookup, answers })
            // Re-fetch so the form reflects exactly what MaskFit stored.
            const refreshed = await listQuestions(lookup)
            if (refreshed.status) setQuestions(refreshed.data)
            return result
        } catch (e) {
            setError((e as Error).message)
            return null
        } finally {
            setIsSubmitting(false)
        }
    }

    return (
        <Stack gap={8} w="full">
            <Stack gap={2}>
                <Heading>Questionnaire Example</Heading>
                <Text color="fg.muted">
                    Load a patient&apos;s questionnaire, render it with your own components, and
                    submit the answers back to MaskFit AR through the Questionnaire API.
                </Text>
            </Stack>

            <PatientLookup isLoading={isLoading} onLookup={load} />

            {error && (
                <Alert.Root status="error">
                    <Alert.Indicator />
                    <Alert.Title>{error}</Alert.Title>
                </Alert.Root>
            )}

            {questions && (
                <QuestionnaireForm
                    key={JSON.stringify(lookup)}
                    questions={questions}
                    isSubmitting={isSubmitting}
                    onSubmit={submit}
                />
            )}
        </Stack>
    )
}
