'use client';

import { useRouter } from 'next/navigation';

export default function Profile() {
  const router = useRouter();

  return (
    <div className="flex min-h-dvh items-center justify-center bg-neutral-100 p-4 md:p-8">
      <div className="w-full max-w-[600px] rounded-xl bg-white p-8 shadow-sm ring-1 ring-black/5">
        <button
          className="mb-6 px-4 py-2 text-base text-blue-600 transition-colors hover:text-blue-700"
          onClick={() => router.back()}
        >
          ← Back
        </button>
        <h1 className="mb-6 text-3xl font-semibold text-neutral-900">Profile</h1>
        <div className="text-base text-neutral-600">
          <p>Profile page coming soon...</p>
        </div>
      </div>
    </div>
  );
}

