import Link from 'next/link';
import { headers } from 'next/headers';
import { createClient } from '@/utils/supabase/server';
import { redirect } from 'next/navigation';
import { SubmitButton } from './submit-button';
import { CreateUserData } from '@/server/UserDataFunctions';
import { ProfanityCheck } from '@/utils/ProfanityCheck';

export default function SignUp({
    searchParams,
}: {
    searchParams: { message: string };
}) {
    const signUp = async (formData: FormData) => {
        'use server';

        const origin = headers().get('origin');
        const email = formData.get('email') as string;
        const password = formData.get('password') as string;
        const given_name = formData.get('given_name') as string;
        const sur_name = formData.get('sur_name') as string;
        const supabase = createClient();

        let { data, error } = await supabase.auth.signUp({
            email,
            password,
            options: {
                emailRedirectTo: `${origin}/auth/callback`,
            },
        });

        if (error) {
            console.log(error);
            return redirect('/login?message=Could not create user');
        }

        if (await ProfanityCheck(given_name)) {
            return redirect('/login?message=Given name contains profanity');
        }

        if (await ProfanityCheck(sur_name)) {
            return redirect('/login?message=Sur name contains profanity');
        }

        await CreateUserData(data.user!.id, given_name, sur_name);

        if (error) {
            return redirect(
                '/login?message=Could not create a user data record. Please contact support.'
            );
        }

        return redirect(
            '/login?message=Check email to continue sign in process'
        );
    };

    return (
        <div className="flex-1 flex flex-col w-full px-8 sm:max-w-md justify-center gap-2">
            <Link
                href="/"
                className="absolute left-8 top-8 py-2 px-4 rounded-md no-underline text-foreground bg-btn-background hover:bg-btn-background-hover flex items-center group text-sm"
            >
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="mr-2 h-4 w-4 transition-transform group-hover:-translate-x-1"
                >
                    <polyline points="15 18 9 12 15 6" />
                </svg>{' '}
                Back
            </Link>

            <form className="animate-in flex flex-col w-full justify-center gap-2 text-foreground">
                <label className="text-md" htmlFor="email">
                    First name
                </label>
                <input
                    className="rounded-md px-4 py-2 bg-inherit border mb-6"
                    name="given_name"
                    placeholder="John"
                    required
                />
                <label className="text-md" htmlFor="email">
                    Last Name
                </label>
                <input
                    className="rounded-md px-4 py-2 bg-inherit border mb-6"
                    name="sur_name"
                    placeholder="Doe"
                    required
                />
                <label className="text-md" htmlFor="email">
                    Email
                </label>
                <input
                    className="rounded-md px-4 py-2 bg-inherit border mb-6"
                    name="email"
                    placeholder="you@example.com"
                    required
                />
                <label className="text-md" htmlFor="password">
                    Password
                </label>
                <input
                    className="rounded-md px-4 py-2 bg-inherit border mb-6"
                    type="password"
                    name="password"
                    placeholder="••••••••"
                    required
                />
                <SubmitButton
                    formAction={signUp}
                    className="bg-green-700 rounded-md px-4 py-2 text-foreground mb-2"
                    pendingText="Signing Up..."
                >
                    Sign Up
                </SubmitButton>
                {searchParams?.message && (
                    <p className="mt-4 p-4 bg-foreground/10 text-foreground text-center">
                        {searchParams.message}
                    </p>
                )}
            </form>
        </div>
    );
}
