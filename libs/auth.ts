import { prisma } from '@/app/utils/prisma';
import { type NextAuthOptions, DefaultSession } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import { JWT } from 'next-auth/jwt';

/* ===============================
   Extend NextAuth Types
================================= */

declare module 'next-auth' {
    interface Session {
        user: {
            id: string;
            name: string;
            arabicName: string;
            email: string;
            username: string;
            role: string;
        } & DefaultSession['user'];
    }

    interface User {
        id: string;
        name: string;
        username: string;
        arabicName: string;
        role: string;
    }
}

declare module 'next-auth/jwt' {
    interface JWT {
        id: string;
        name: string;
        arabicName: string;
        username: string;
        role: string;
        email?: string;
    }
}

/* ===============================
   Auth Options
================================= */

export const authOptions: NextAuthOptions = {
    session: {
        strategy: 'jwt',
    },

    providers: [
        CredentialsProvider({
            name: 'Credentials',

            credentials: {
                username: { label: 'Username', type: 'text' },
                password: { label: 'Password', type: 'password' },
            },

            async authorize(credentials, req) {
                if (!credentials?.username || !credentials?.password) {
                    return null;
                }

                const user = await prisma.user.findUnique({
                    where: {
                        username: credentials.username,
                    },
                    select: {
                        id: true,
                        name: true,
                        arabicName: true,
                        username: true,
                        password: true,
                        role: true,
                        
                    },
                });

                if (!user) return null;
                if (user.password !== credentials.password) return null;

                return {
                    id: user.id,
                    name: user.name,
                    arabicName: user.arabicName || '',
                    username: user.username,
                    role: user.role,
                    
                };
            },
        }),
    ],

    pages: {
        signIn: '/login',
    },

    callbacks: {
        /* ===============================
           JWT Callback
        ================================= */

        async jwt({ token, user }) {
            if (user) {
                Object.assign(token, {
                    id: user.id,
                    name: user.name,
                    arabicName: user.arabicName,
                    username: user.username,
                    role: user.role,
                    email: user.email,
                });
            }

            return token;
        },

        /* ===============================
           Session Callback
        ================================= */

        async session({ session, token }) {
            return {
                ...session,
                user: {
                    ...session.user,
                    id: token.id as string,
                    name: token.name as string,
                    arabicName: token.arabicName as string,
                    username: token.username as string,
                    role: token.role as string,
                    email: token.email as string,
                },
            };
        },
    },
};