/**
 * Pure helpers for rendering a questionnaire from the List Questions response:
 * grouping, visibility rules, validation and partial-update diffing.
 * Safe to use in client components.
 */
import Ajv2020, { type ValidateFunction } from "ajv/dist/2020"
import type { Answers, Question } from "~/types/maskfit"

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
    const rule = question.visibility_rule
    if (!rule || Object.keys(rule).length === 0) return true
    return compile(`vis:${question.id}`, rule)({ ...answers })
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

export interface CategoryGroup {
    name: string
    questions: Question[]
}

/** Group questions by category; categories and questions both ordered by `position`. */
export function groupByCategory(questions: Question[]): CategoryGroup[] {
    const groups = new Map<string, CategoryGroup & { position: number }>()
    for (const q of [...questions].sort((a, b) => a.position - b.position)) {
        const name = q.category?.name ?? "General"
        const position = q.category?.position ?? Number.MAX_SAFE_INTEGER
        if (!groups.has(name)) groups.set(name, { name, position, questions: [] })
        groups.get(name)!.questions.push(q)
    }
    return [...groups.values()].sort((a, b) => a.position - b.position)
}

/** Initial answers map built from each question's `answer`. */
export function initialAnswers(questions: Question[]): Answers {
    const answers: Answers = {}
    for (const q of questions) if (q.answer != null) answers[q.id] = q.answer
    return answers
}

/** Only the answers that differ from what MaskFit already has — the endpoint supports partial updates. */
export function changedAnswers(initial: Answers, current: Answers, visible: Question[]): Answers {
    const diff: Answers = {}
    for (const q of visible) {
        const before = initial[q.id] ?? ""
        const after = current[q.id] ?? ""
        if (before !== after) diff[q.id] = after // "" clears an existing answer
    }
    return diff
}
