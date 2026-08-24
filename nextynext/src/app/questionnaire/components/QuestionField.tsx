"use client"
import { Box, Button, Code, Field, HStack, Input, RadioGroup, Text } from "@chakra-ui/react"
import type { Question } from "~/types/maskfit"

interface Props {
    question: Question
    value: string
    error: string | null
    onChange: (value: string) => void
}

/** Map the API's "input_type" hint to an HTML input type. */
function inputTypeFor(question: Question): string {
    switch (question.input_type) {
        case "number":
        case "year":
            return "number"
        case "email":
            return "email"
        case "phone":
            return "tel"
        case "date":
            return "date"
        default:
            return "text"
    }
}

/**
 * Renders a single question.
 *
 * - "radio" questions show their "options". The submitted value is the option id.
 * - Everything else is a text like input whose widget comes from "input_type".
 */
export function QuestionField({ question, value, error, onChange }: Props) {
    const isRadio = question.question_type === "radio" || question.input_type === "enum"
    const hasVisibilityRule = Object.keys(question.visibility_rule ?? {}).length > 0

    return (
        <Field.Root invalid={!!error} required={question.required}>
            <Field.Label>
                {question.name ?? question.slug}
                <Field.RequiredIndicator />
            </Field.Label>

            {isRadio ? (
                <HStack gap={4} wrap="wrap">
                    <RadioGroup.Root
                        value={value || null}
                        onValueChange={(e) => onChange(e.value ?? "")}
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
                    {value && (
                        <Button size="xs" variant="ghost" onClick={() => onChange("")}>
                            clear
                        </Button>
                    )}
                </HStack>
            ) : (
                <Input
                    type={inputTypeFor(question)}
                    value={value}
                    onChange={(e) => onChange(e.target.value)}
                    placeholder={question.input_type === "year" ? "YYYY" : undefined}
                    min={question.input_type === "year" ? 1900 : undefined}
                    max={question.input_type === "year" ? new Date().getFullYear() : undefined}
                    maxW="sm"
                />
            )}

            <Field.ErrorText>{error}</Field.ErrorText>
            <Box asChild fontSize="xs" color="fg.muted">
                <Text>
                    <Code fontSize="xs">{question.slug}</Code> · {question.question_type ?? "?"}/
                    {question.input_type ?? "?"}
                    {hasVisibilityRule && " · conditional"}
                </Text>
            </Box>
        </Field.Root>
    )
}
