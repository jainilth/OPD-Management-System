'use server'

import { getSession } from '@/lib/auth'

const API_URL = process.env.API_URL

export async function authFetch(endpoint: string, options: RequestInit = {}) {
    const session = await getSession()

    if (!session?.accessToken) {
        return { error: 'Unauthorized' }
    }

    const res = await fetch(`${API_URL}${endpoint}`, {
        ...options,
        headers: {
            'Cookie': `accessToken=${session.accessToken}`,
            'Content-Type': 'application/json',
            ...options.headers,
        },
    })

    if (!res.ok) {
        const errorData = await res.json().catch(() => ({}))
        return { error: errorData.message || errorData.Message || 'Request failed' }
    }

    const data = await res.json()
    return data.data ?? data
}
