"use client"
import { Alert, Button, Code, Collapsible, Fieldset, HStack, Stack, Text } from "@chakra-ui/react"
import { useMemo, useState } from "react"
import {
    changedAnswers,
    groupByCategory,
    initialAnswers,
    isVisible,
    validateAnswer
} from "~/lib/questionnaire"
import type { Answers, Question, SubmitAnswersResult } from "~/types/maskfit"
import { QuestionField } from "./QuestionField"

interface Props {
    questions: Question[]
    isSubmitting: boolean
    onSubmit: (answers: Answers) => Promise<SubmitAnswersResult | null>
}

/**
 * Renders the questions and collects answers.
 *
 * - Questions are grouped by "category" and ordered by "position".
 * - "visibility_rule" is re-evaluated on every change, so conditional
 *   questions appear/disappear as the patient answers.
 * - "required" and "validation_rule" are enforced before submitting.
 * - Only changed answers are sent; MaskFit merges them with what it already has.
 */
export function QuestionnaireForm({ questions, isSubmitting, onSubmit }: Props) {
    const initial = useMemo(() => initialAnswers(questions), [questions])
    const [answers, setAnswers] = useState<Answers>(initial)
    const [errors, setErrors] = useState<Record<string, string>>({})
    const [result, setResult] = useState<SubmitAnswersResult | null>(null)

    const groups = useMemo(() => groupByCategory(questions), [questions])
    const visible = useMemo(
        () => questions.filter((q) => isVisible(q, answers)),
        [questions, answers]
    )
    const diff = useMemo(
        () => changedAnswers(initial, answers, visible),
        [initial, answers, visible]
    )
    const changedCount = Object.keys(diff).length

    const setAnswer = (id: string, value: string) => {
        setAnswers((prev) => ({ ...prev, [id]: value }))
        setErrors((prev) => {
            const next = { ...prev }
            delete next[id]
            return next
        })
        setResult(null)
    }

    const submit = async () => {
        const nextErrors: Record<string, string> = {}
        for (const q of visible) {
            const err = validateAnswer(q, answers[q.id])
            if (err) nextErrors[q.id] = err
        }
        setErrors(nextErrors)
        if (Object.keys(nextErrors).length > 0) return

        setResult(await onSubmit(diff))
    }

    return (
        <Stack gap={6}>
            {groups.map((group) => {
                const shown = group.questions.filter((q) => visible.includes(q))
                if (shown.length === 0) return null
                return (
                    <Fieldset.Root key={group.name}>
                        <Fieldset.Legend fontWeight="semibold">{group.name}</Fieldset.Legend>
                        <Fieldset.Content>
                            {shown.map((q) => (
                                <QuestionField
                                    key={q.id}
                                    question={q}
                                    value={answers[q.id] ?? ""}
                                    error={errors[q.id] ?? null}
                                    onChange={(v) => setAnswer(q.id, v)}
                                />
                            ))}
                        </Fieldset.Content>
                    </Fieldset.Root>
                )
            })}

            <HStack gap={4}>
                <Button
                    colorPalette="green"
                    onClick={submit}
                    loading={isSubmitting}
                    loadingText="Submitting"
                    disabled={isSubmitting || changedCount === 0}
                >
                    Submit {changedCount} changed answer(s)
                </Button>
            </HStack>

            {result && (
                <Alert.Root status="success">
                    <Alert.Indicator />
                    <Alert.Content>
                        <Alert.Title>{result.message}</Alert.Title>
                        {result.skipped_question_ids?.length ? (
                            <Alert.Description>
                                Skipped question ids: {result.skipped_question_ids.join(", ")}
                            </Alert.Description>
                        ) : null}
                    </Alert.Content>
                </Alert.Root>
            )}

            <Collapsible.Root>
                <Collapsible.Trigger asChild>
                    <Button size="xs" variant="subtle">
                        Show PATCH payload
                    </Button>
                </Collapsible.Trigger>
                <Collapsible.Content>
                    <Text fontSize="xs" color="fg.muted" mt={2}>
                        Body sent to <Code fontSize="xs">PATCH /api/questions/</Code> (plus the
                        patient identifier):
                    </Text>
                    <Code display="block" whiteSpace="pre" p={3} mt={2} fontSize="xs">
                        {JSON.stringify({ answers: diff }, null, 2)}
                    </Code>
                </Collapsible.Content>
            </Collapsible.Root>
        </Stack>
    )
}
