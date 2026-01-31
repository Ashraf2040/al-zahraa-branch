import { prisma } from '@/app/utils/prisma';
import { type NextAuthOptions, DefaultSession, User as NextAuthUser } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';

declare module 'next-auth' {
    interface Session {
        user: {
            id: string;
            name: string;
            email: string;
            username: string;
            role: string;
        } & DefaultSession['user'];
    }

    interface User {
        id: string;
        name: string;
        username: string;
        role: string;
    }
}

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

            async authorize(credentials) {
                if (!credentials?.username || !credentials?.password) return null;

                const user = await prisma.user.findUnique({
                    where: { username: credentials.username },
                    select: {
                        id: true,
                        name: true,
                      
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
        async jwt({ token, user }) {
            if (user) {
                token.id = user.id;
                token.name = user.name;
                token.username = user.username;
                token.role = user.role;
            }
            return token;
        },

        async session({ session, token }) {
            if (token?.id) {
                session.user = {
                    email: (token.email as string) ?? '',
                    id: token.id as string,
                    name: token.name as string,
                    username: token.username as string,
                    role: token.role as string,
                };
            }
            return session;
        },
    },
};
