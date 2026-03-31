import { NextResponse } from "next/server"

export function handleError(error: any) {
    console.error(error)
    if (typeof error?.statusCode === "number") {
        return NextResponse.json(
            { message: error.message || "Request failed" },
            { status: error.statusCode }
        )
    }
    if (error.message === "Unauthorized") {
        return NextResponse.json({ message: "Unauthorized" }, { status: 401 })
    }
    if (error.message === "Forbidden") {
        return NextResponse.json({ message: "Forbidden" }, { status: 403 })
    }

    return NextResponse.json(
        { message: error.message || "Internal server error" },
        { status: 500 }
    )
}