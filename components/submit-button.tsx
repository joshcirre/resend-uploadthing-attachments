'use client'

import { useFormStatus } from 'react-dom'

export function SubmitButton() {
    const { pending } = useFormStatus()

    return (
        <button
            type="submit"
            disabled={pending}
            className={`bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded ${pending ? 'opacity-50 cursor-not-allowed' : ''}`}
        >
            {pending ? 'Sending...' : 'Send'}
        </button>
    )
}
