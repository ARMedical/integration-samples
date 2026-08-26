/**
 * Sample MaskFit AR API responses for the Questionnaire endpoints.
 *
 * Every response uses the same envelope:
 *   status      true on success, false on error
 *   error       human-readable message (null on success)
 *   error_code  stable, machine-readable code to branch on (null on success)
 *   data        the payload
 *
 * Ref: https://portal.maskfitar.com/api/docs/#tag/Questions
 * */
import type { MaskFitResponse, Question, SubmitAnswersResult } from "~/types/maskfit"

// ---------------------------------------------------------------------------
// GET /api/questions/?email=testpatient@test.com
// ---------------------------------------------------------------------------

/** 200 — every question available to the institution, with the patient's existing answers. */
export const listQuestionsSuccess: MaskFitResponse<Question[]> = {
    status: true,
    error: null,
    error_code: null,
    warning: null,
    data: [
        {
            id: "71aa76e8-d3f6-40a9-a05d-1ea8f0cb1cf7",
            slug: "first_name",
            name: "First Name",
            question_type: "text",
            input_type: "text",
            required: false,
            options: [],
            position: 1,
            visibility_rule: {},
            validation_rule: {
                type: "string",
                pattern: "^[A-Za-z\\s]+$"
            },
            answer: "Carissa",
            category: {
                name: "Demographics",
                position: 1
            }
        },
        {
            id: "7d5da9ec-e95e-456f-bdf5-8aee446af2d7",
            slug: "last_name",
            name: "Last Name",
            question_type: "text",
            input_type: "text",
            required: false,
            options: [],
            position: 2,
            visibility_rule: {},
            validation_rule: {
                type: "string",
                pattern: "^[A-Za-z\\s]+$"
            },
            answer: "Bullerkist",
            category: {
                name: "Demographics",
                position: 1
            }
        },
        {
            id: "28876801-a47c-47c6-a332-e397b299a25c",
            slug: "email",
            name: "Email",
            question_type: "text",
            input_type: "email",
            required: false,
            options: [],
            position: 3,
            visibility_rule: {},
            validation_rule: {
                type: "string",
                pattern: "^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$"
            },
            answer: "testpatient@test.com",
            category: {
                name: "Demographics",
                position: 1
            }
        },
        {
            id: "48b73a72-2fa5-40fd-bf60-dd854f59d02d",
            slug: "phone",
            name: "Phone",
            question_type: "text",
            input_type: "phone",
            required: false,
            options: [],
            position: 4,
            visibility_rule: {},
            validation_rule: {
                type: "string",
                pattern: "^\\+?[0-9]{10,15}$"
            },
            answer: "+17804673727",
            category: {
                name: "Demographics",
                position: 1
            }
        },
        {
            id: "9ebdc3de-def3-41c2-ba54-dce248891b72",
            slug: "gender",
            name: "Gender",
            question_type: "radio",
            input_type: "enum",
            required: false,
            options: [
                {
                    id: "592b7930-6e79-4493-a612-e08ca374a8b4",
                    name: "Male"
                },
                {
                    id: "340eb038-10ca-43cd-a233-8200fe12e81f",
                    name: "Female"
                },
                {
                    id: "6e5c82ae-edc3-4d31-847c-602d93152afc",
                    name: "Prefer not to say"
                }
            ],
            position: 5,
            visibility_rule: {},
            validation_rule: null,
            answer: "340eb038-10ca-43cd-a233-8200fe12e81f",
            category: {
                name: "Demographics",
                position: 1
            }
        },
        {
            id: "58bcdeba-4b14-4d1c-b01f-95348a3a4722",
            slug: "region",
            name: "Country / Region",
            question_type: "text",
            input_type: "select",
            required: false,
            options: [],
            position: 6,
            visibility_rule: {},
            validation_rule: null,
            answer: "CA",
            category: {
                name: "Demographics",
                position: 1
            }
        },
        {
            id: "15d27a30-bf1a-48ca-a42a-64b871dcbe63",
            slug: "dob",
            name: "Date of Birth",
            question_type: "text",
            input_type: "date",
            required: false,
            options: [],
            position: 7,
            visibility_rule: {},
            validation_rule: {
                type: "string",
                pattern: "^(19|20)\\d{2}(-(0[1-9]|1[0-2])-(0[1-9]|[12]\\d|3[01]))?$"
            },
            answer: "1979-01-26",
            category: {
                name: "Demographics",
                position: 1
            }
        },
        {
            id: "85c81fb3-19e4-4fd3-9a70-0287f17eed24",
            slug: "deviated_septum",
            name: "Do you have a deviated septum?",
            question_type: "radio",
            input_type: "enum",
            required: true,
            options: [
                {
                    id: "1fc7a947-c6f0-4b5f-9d6b-739f7f276afd",
                    name: "No"
                },
                {
                    id: "e1257bbe-fec9-471b-9d36-001a83773317",
                    name: "Yes"
                }
            ],
            position: 2,
            visibility_rule: {},
            validation_rule: null,
            answer: "1fc7a947-c6f0-4b5f-9d6b-739f7f276afd",
            category: {
                name: "Clinical",
                position: 3
            }
        },
        {
            id: "4aaba757-4e5c-47dd-97f6-c5470438dba2",
            slug: "nasal_congestion",
            name: "Do you have chronic nasal congestion?",
            question_type: "radio",
            input_type: "enum",
            required: true,
            options: [
                {
                    id: "1fc7a947-c6f0-4b5f-9d6b-739f7f276afd",
                    name: "No"
                },
                {
                    id: "e1257bbe-fec9-471b-9d36-001a83773317",
                    name: "Yes"
                }
            ],
            position: 3,
            visibility_rule: {},
            validation_rule: null,
            answer: "1fc7a947-c6f0-4b5f-9d6b-739f7f276afd",
            category: {
                name: "Clinical",
                position: 3
            }
        },
        {
            id: "37fa16cd-4ee4-4915-aa8a-8993e6d9cadc",
            slug: "seasonal_allergies",
            name: "Do you experience seasonal allergies?",
            question_type: "radio",
            input_type: "enum",
            required: true,
            options: [
                {
                    id: "1fc7a947-c6f0-4b5f-9d6b-739f7f276afd",
                    name: "No"
                },
                {
                    id: "e1257bbe-fec9-471b-9d36-001a83773317",
                    name: "Yes"
                }
            ],
            position: 4,
            visibility_rule: {},
            validation_rule: null,
            answer: "e1257bbe-fec9-471b-9d36-001a83773317",
            category: {
                name: "Clinical",
                position: 3
            }
        },
        {
            id: "e9b096d3-89dd-4392-9a9e-16fd94e06d7d",
            slug: "sleep_position",
            name: "What is your preferred sleep position?",
            question_type: "radio",
            input_type: "enum",
            required: true,
            options: [
                {
                    id: "5b1fc859-a5b8-4d38-9f7b-3589080b23da",
                    name: "Side"
                },
                {
                    id: "785b6cdf-7af8-404a-8585-ae12eaaa0c5e",
                    name: "Back"
                },
                {
                    id: "8ebd35db-3659-4c2e-b862-85c412d0ec0f",
                    name: "Stomach"
                },
                {
                    id: "9b6b95d2-696b-40ab-8602-8acf7b611d36",
                    name: "Restless"
                }
            ],
            position: 5,
            visibility_rule: {},
            validation_rule: null,
            answer: "5b1fc859-a5b8-4d38-9f7b-3589080b23da",
            category: {
                name: "Clinical",
                position: 3
            }
        },
        {
            id: "1adc4c7a-cbe0-409b-94bb-132d0c9a0dd3",
            slug: "facial_hair",
            name: "Do you have facial hair?",
            question_type: "radio",
            input_type: "enum",
            required: true,
            options: [
                {
                    id: "62efdf42-8129-4d14-a416-87ac05940002",
                    name: "None"
                },
                {
                    id: "c808047c-fe9e-4790-9b20-ef2497fcd939",
                    name: "Mustache"
                },
                {
                    id: "37a87695-b3a3-41ee-9fbd-daaffb4243eb",
                    name: "Full Beard"
                },
                {
                    id: "016ede1a-bd03-4d28-9031-5d55906c794e",
                    name: "Stubble/Goatee"
                }
            ],
            position: 6,
            visibility_rule: {},
            validation_rule: null,
            answer: "62efdf42-8129-4d14-a416-87ac05940002",
            category: {
                name: "Clinical",
                position: 3
            }
        },
        {
            id: "5affa746-107e-4375-a6a3-01aa0016e670",
            slug: "skin_sensitivities",
            name: "Do you have any skin sensitivities on your face?",
            question_type: "radio",
            input_type: "enum",
            required: true,
            options: [
                {
                    id: "1fc7a947-c6f0-4b5f-9d6b-739f7f276afd",
                    name: "No"
                },
                {
                    id: "e1257bbe-fec9-471b-9d36-001a83773317",
                    name: "Yes"
                }
            ],
            position: 7,
            visibility_rule: {},
            validation_rule: null,
            answer: "1fc7a947-c6f0-4b5f-9d6b-739f7f276afd",
            category: {
                name: "Clinical",
                position: 3
            }
        },
        {
            id: "d6135c0f-54f2-496f-b94d-632e57bc6992",
            slug: "claustrophobic",
            name: "Are you claustrophobic?",
            question_type: "radio",
            input_type: "enum",
            required: true,
            options: [
                {
                    id: "e1257bbe-fec9-471b-9d36-001a83773317",
                    name: "Yes"
                },
                {
                    id: "1fc7a947-c6f0-4b5f-9d6b-739f7f276afd",
                    name: "No"
                }
            ],
            position: 8,
            visibility_rule: {},
            validation_rule: null,
            answer: "1fc7a947-c6f0-4b5f-9d6b-739f7f276afd",
            category: {
                name: "Clinical",
                position: 3
            }
        },
        {
            id: "dde8d513-d0f0-482c-b056-f3a75880ebfe",
            slug: "use_magnets",
            name: "Do you (or your bed partner) have a medical condition or any implanted device that prevents the use of magnets?",
            question_type: "radio",
            input_type: "enum",
            required: true,
            options: [
                {
                    id: "1fc7a947-c6f0-4b5f-9d6b-739f7f276afd",
                    name: "No"
                },
                {
                    id: "e1257bbe-fec9-471b-9d36-001a83773317",
                    name: "Yes"
                }
            ],
            position: 21,
            visibility_rule: {},
            validation_rule: null,
            answer: null,
            category: {
                name: "Clinical",
                position: 3
            }
        }
    ]
}

/** 400 — no email / phone / external_id was supplied. */
export const listQuestionsMissingIdentifier: MaskFitResponse<Record<string, never>> = {
    status: false,
    error: "At least one identifier must be provided: email, phone, or external_id.",
    error_code: "VALIDATION_FAILED",
    warning: null,
    data: {}
}

/** 404 — no patient in your institution matches the identifier. */
export const listQuestionsPatientNotFound: MaskFitResponse<Record<string, never>> = {
    status: false,
    error: "Failed to find a patient matching the provided details.",
    error_code: "ENTITY_NOT_FOUND",
    warning: null,
    data: {}
}

/** 400 — inter-account call with only one of institution_id / authorized_user_email. */
export const listQuestionsInterAccountIncomplete: MaskFitResponse<Record<string, never>> = {
    status: false,
    error: "Please provide both institution_id and authorized_user_email.",
    error_code: "VALIDATION_FAILED",
    warning: null,
    data: {}
}

/** 403 — the bearer-token user is not a member of the target institution. */
export const listQuestionsNoInstitutionAccess: MaskFitResponse<Record<string, never>> = {
    status: false,
    error: "User does not have access to this institution.",
    error_code: "UNAUTHORIZED_TO_PERFORM_ACTION",
    warning: null,
    data: {}
}

/** 401 — the access token has expired; authenticate again and retry. */
export const accessTokenExpired = {
    status: false,
    error: "Access token expired.",
    error_code: null,
    warning: null,
    data: {}
}

// ---------------------------------------------------------------------------
// PATCH /api/questions/
// { "email": "testpatient@test.com", "answers": { "<question id>": "<value>" } }
// ---------------------------------------------------------------------------

/** 200 — all answers saved. */
export const submitAnswersSuccess: MaskFitResponse<SubmitAnswersResult> = {
    status: true,
    error: null,
    error_code: null,
    warning: null,
    data: {
        message: "Answers updated successfully."
    }
}

/**
 * 200 — still a success: the recognised answers were saved, but the ids listed
 * in skipped_question_ids were unknown question ids or invalid option ids.
 */
export const submitAnswersPartiallySkipped: MaskFitResponse<SubmitAnswersResult> = {
    status: true,
    error: null,
    error_code: null,
    warning: null,
    data: {
        message: "Answers updated successfully.",
        skipped_question_ids: ["00000000-0000-4000-8000-000000000000"]
    }
}

/** 400 — a demographic phone answer was not a valid phone number. */
export const submitAnswersInvalidPhone: MaskFitResponse<Record<string, never>> = {
    status: false,
    error: "Invalid phone number.",
    error_code: "VALIDATION_FAILED",
    warning: null,
    data: {}
}

/** 400 — `answers` was missing or not an object. */
export const submitAnswersMissingAnswers: MaskFitResponse<Record<string, never>> = {
    status: false,
    error: "Please provide answers as a dictionary of question IDs to values.",
    error_code: "VALIDATION_FAILED",
    warning: null,
    data: {}
}

/** 404 — same patient lookup rules as GET. */
export const submitAnswersPatientNotFound: MaskFitResponse<Record<string, never>> = {
    status: false,
    error: "Failed to find a patient matching the provided details.",
    error_code: "ENTITY_NOT_FOUND",
    warning: null,
    data: {}
}
