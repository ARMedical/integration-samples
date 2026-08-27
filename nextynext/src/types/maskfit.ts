/**
 * Types shared between server actions and client components.
 */

/** Every MaskFit API response uses this envelope. */
export interface MaskFitResponse<T> {
    /** true on success */
    status: boolean
    /** Human-readable message when status is false */
    error: string | null
    /** Stable, machine-readable code when status is false (e.g. ENTITY_NOT_FOUND) */
    error_code: string | null
    /** Non-fatal notice, usually null */
    warning?: string | null
    data: T
}

/** How a patient is identified. */
export type PatientLookup = { email?: string; phone?: string; external_id?: string }

export interface QuestionOption {
    id: string
    name: string
}

export interface Question {
    /** Stable question id — the key used when submitting answers */
    id: string
    slug: string
    name: string | null
    /** "radio": pick one of "options". "text": free-form value. */
    question_type: "radio" | "text" | null
    /** Widget hint: enum, number, email, phone, date, year, text etc. */
    input_type: string | null
    required: boolean
    options: QuestionOption[]
    position: number
    /** JSON Schema evaluated against the answers object. {} = always visible. */
    visibility_rule: Record<string, unknown>
    /** JSON Schema the answer value must satisfy, or null */
    validation_rule: Record<string, unknown> | null
    /** Existing answer to pre-fill: option id for radio, string otherwise */
    answer: string | null
    category: { name: string; position: number } | null
}

/** question id -> answer value (option id for radio questions, string otherwise) */
export type Answers = Record<string, string>

/** Submitting answers returns an empty 'data' object on success. */
export type SubmitAnswersResult = Record<string, never>
