import Link from "next/link";

export default function UnauthorizedPage() {
    return (
        <div className="min-h-[70vh] flex items-center justify-center px-6">
            <div className="max-w-xl w-full rounded-2xl border border-red-100 bg-white p-8 shadow-sm text-center">
                <p className="text-sm font-semibold text-red-600">Access Denied</p>
                <h1 className="mt-2 text-2xl font-bold text-slate-900">You are not authorized to view this page.</h1>
                <p className="mt-3 text-slate-600">
                    Your current role does not have permission to access the requested URL.
                </p>

                <div className="mt-6 flex items-center justify-center gap-3">
                    <Link
                        href="/"
                        className="rounded-lg bg-slate-900 px-4 py-2 text-sm font-medium text-white hover:bg-slate-800"
                    >
                        Go to Dashboard
                    </Link>
                    <Link
                        href="/appointment"
                        className="rounded-lg border border-slate-200 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
                    >
                        Go to Allowed Module
                    </Link>
                </div>
            </div>
        </div>
    );
}
