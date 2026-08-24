"use server"
import { v4 as uuidv4 } from "uuid"
import * as jose from "jose"

/**
 * See an example of authenticating with Maskfit AR API
 *
 * MaskFit API uses JWT.
 * Please ensure your API secret is not exposed to client/browser.
 *
 * */
const MIFIT_API_URL = `http://mifit.local/api`
const MIFIT_API_AUTH_URL = `${MIFIT_API_URL}/auth/`
const MIFIT_API_PATIENT_SCAN_LINK_URL = `${MIFIT_API_URL}/patients/scans/generate-link/`

export async function mifitAuth() {
    // Best is to use ENVIRONMENT Variable as such: MASKFIT_AR_API_KEY, MASKFIT_AR_API_SECRET
    // PLEASE NO NOT EXPOSE. SERVER SIDE ONLY
    // const api_secret = process.env.MASKFIT_AR_API_SECRET
    const api_key = "your_api_key"
    const api_secret = "your_api_secret" // PLEASE NO NOT EXPOSE. SERVER SIDE ONLY

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
