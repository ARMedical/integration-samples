"use client"
import { Button, Field, HStack, Input, NativeSelect } from "@chakra-ui/react"
import { useState } from "react"
import type { PatientLookup as Lookup } from "~/types/maskfit"

const FIELDS = [
    { key: "email", label: "Email", placeholder: "patient@example.com", type: "email" },
    { key: "phone", label: "Phone", placeholder: "+14155550123", type: "tel" },
    { key: "external_id", label: "External ID", placeholder: "MRN-00421", type: "text" }
] as const

type FieldKey = (typeof FIELDS)[number]["key"]

interface Props {
    isLoading: boolean
    onLookup: (lookup: Lookup) => void
}

/**
 * Identify the patient.
 *
 * The API accepts any identifier you already hold for the patient.
 */
export function PatientLookup({ isLoading, onLookup }: Props) {
    const [field, setField] = useState<FieldKey>("email")
    const [value, setValue] = useState("")
    const current = FIELDS.find((f) => f.key === field)!

    return (
        <Field.Root>
            <Field.Label>Patient identifier</Field.Label>
            <HStack gap={2} w="full" wrap="wrap">
                <NativeSelect.Root w="auto" disabled={isLoading}>
                    <NativeSelect.Field
                        value={field}
                        onChange={(e) => setField(e.target.value as FieldKey)}
                    >
                        {FIELDS.map((f) => (
                            <option key={f.key} value={f.key}>
                                {f.label}
                            </option>
                        ))}
                    </NativeSelect.Field>
                    <NativeSelect.Indicator />
                </NativeSelect.Root>
                <Input
                    flex={1}
                    minW="3xs"
                    type={current.type}
                    placeholder={current.placeholder}
                    value={value}
                    onChange={(e) => setValue(e.target.value)}
                    onKeyDown={(e) =>
                        e.key === "Enter" && value.trim() && onLookup({ [field]: value.trim() })
                    }
                    disabled={isLoading}
                />
                <Button
                    colorPalette="blue"
                    loading={isLoading}
                    loadingText="Loading"
                    disabled={isLoading || !value.trim()}
                    onClick={() => onLookup({ [field]: value.trim() })}
                >
                    Load questionnaire
                </Button>
            </HStack>
            <Field.HelperText>
                The patient must already exist in MaskFit (e.g. created through the patient invite
                API or a previous scan link).
            </Field.HelperText>
        </Field.Root>
    )
}
