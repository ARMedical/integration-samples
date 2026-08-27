"use server"
import { v4 as uuidv4 } from "uuid"
import * as jose from "jose"
import type { Answers, PatientLookup, Question, SubmitAnswersResult } from "~/types/maskfit"

/**
 * See an example of authenticating with Maskfit AR API
 *
 * MaskFit API uses JWT.
 * Please ensure your API secret is not exposed to client/browser.
 *
 * */
const MIFIT_API_URL = `${process.env.MASKFIT_AR_API_URL}/api`
const MIFIT_API_AUTH_URL = `${MIFIT_API_URL}/auth/`
const MIFIT_API_PATIENT_SCAN_LINK_URL = `${MIFIT_API_URL}/patients/scans/generate-link/`

export async function mifitAuth() {
    // Configured through environment variables, see .env.example
    // PLEASE DO NOT EXPOSE. SERVER SIDE ONLY
    const api_key = process.env.MASKFIT_AR_API_KEY!
    const api_secret = process.env.MASKFIT_AR_API_SECRET! // PLEASE DO NOT EXPOSE. SERVER SIDE ONLY

    const nonce = uuidv4()

    const payload = {
        nonce,
        api_key
    }

    const secret = new TextEncoder().encode(api_secret)
    const alg = "HS256"

    const jwt = await new jose.SignJWT(payload)
        .setProtectedHeader({ alg })
        .setIssuedAt()
        .setExpirationTime("2h")
        .sign(secret)

    const res = await fetch(MIFIT_API_AUTH_URL, {
        method: "POST",
        headers: { Authorization: `Bearer ${jwt}` },
        body: JSON.stringify(payload)
    })
    const res_data = (await res.json()) as { data: { access_token: string; expiration: string } }
    return res_data.data
}

/**
 * Acquire a Scan Link from MaskFit AR API
 *
 * Target API is protected by Access Tokens.
 *
 * Acquire access token and pass it in the request headers.
 *
 * Use the acquired scan link to redirect your user to complete the scan.
 *
 * Ensure to provide the `redirect_url` and webhooks details as needed.
 *
 * Ref: https://portal.maskfitar.com/api/docs/#tag/Patients/operation/Generate%20Face%20Scan%20Link
 * */
export async function getScanLink({
    ...payload
}: {
    email?: string
    phone?: string
    redirect_url?: string
}) {
    const auth = await mifitAuth()
    const headers = {
        Authorization: `Bearer ${auth.access_token}`,
        "Content-Type": "application/json"
    }

    const req = await fetch(MIFIT_API_PATIENT_SCAN_LINK_URL, {
        method: "POST",
        body: JSON.stringify(payload),
        headers
    })
    const json_data = await req.json()
    return json_data.data
}

/**
 * Questionnaire API
 *
 * Render a patient's questionnaire in your own UI and submit the answers
 * back
 *
 * The patient is identified by ONE of email, phone or external_id.
 *
 * Both actions return the 'data' of the MaskFit response envelope
 * { status, error, error_code, data } and throw an Error with the API's
 * 'error' message when 'status' is false (e.g. when the patient does not exist).
 *
 * Sample success and error responses for both endpoints are in
 * src/samples/questionnaire.ts.
 *
 * Ref: https://portal.maskfitar.com/api/docs/#tag/Questions
 * */
const MIFIT_API_QUESTIONS_URL = `${MIFIT_API_URL}/questions/`

/**
 * Submit or update a patient's answers.
 *
 * PATCH /api/questions/  { email | phone | external_id, answers: { [questionId]: value } }
 *
 * "answers" maps question id -> value: the option id for radio questions,
 * the raw string for everything else. Only the questions included are
 * touched (partial update); send "" to clear an answer. Unknown question ids
 * or option ids are ignored; the remaining answers are still saved.
 *
 * Ref: https://portal.maskfitar.com/api/docs/#tag/Questions/operation/Submit%20Questionnaire%20Answers
 * */
export async function submitAnswers({
    ...payload
}: PatientLookup & { answers: Answers }): Promise<SubmitAnswersResult> {
    const auth = await mifitAuth()
    const headers = {
        Authorization: `Bearer ${auth.access_token}`,
        "Content-Type": "application/json"
    }

    const req = await fetch(MIFIT_API_QUESTIONS_URL, {
        method: "PATCH",
        body: JSON.stringify(payload),
        headers
    })
    const { status, error, data } = await req.json()
    if (!status) throw new Error(error!)
    return data
}

/**
 * Fetch the questions of the patient identified by the provided details.
 * Identifiers:
 * * email
 * * phone
 * * external_id
 *
 * REF: https://portal.maskfitar.com/api/docs/#tag/Questions/operation/List%20Questionnaire%20Questions
 * */
export async function getMaskFitQuestions({
    ...patientDetails
}: PatientLookup): Promise<Question[]> {
    const auth = await mifitAuth()
    const headers = {
        Authorization: `Bearer ${auth.access_token}`,
        "Content-Type": "application/json"
    }
    const url = new URL(MIFIT_API_QUESTIONS_URL)
    const payload: Record<string, string> = {}
    for (const [key, value] of Object.entries(patientDetails)) {
        if (!!value) {
            payload[key] = value
        }
    }

    const searchParams = new URLSearchParams(payload)

    for (const [key, value] of searchParams.entries()) {
        url.searchParams.append(key, value)
    }
    const req = await fetch(url.toString(), {
        headers
    })
    const { status, error, data } = await req.json()
    if (!status) throw new Error(error!)
    return data
}
