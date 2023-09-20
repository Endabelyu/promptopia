import NextAuth from 'next-auth';
import GoogleProvider from 'next-auth/providers/google';
import User from '@models/user';
import { connectToDB } from '@utils/database';

const handler = NextAuth({
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),
  ],
  async session({ session }) {
    console.log(session, 'ses1');
    const sessionUser = await User.findOne({
      email: session.user.email,
    });
    session.user.id = sessionUser._id.toString();
    console.log(session, 'ses2  ');
    return session;
  },
  async signIn({ profile }) {
    // serverless -> lambda -> dynamodb
    try {
      await connectToDB();

      // check if a user already exist
      const userExists = await User.findOne({ email: profile.email });
      // if not, create a new user

      if (!userExists) {
        await User.create({
          email: profile.email,
          username: profile.name.replace(' ', '').toLowerCase(),
          image: profile.picture,
        });
      }
      return true;
    } catch (error) {
      console.log(error);

      return false;
    }
  },
  secret: process.env.NEXAUTH_SECRET,
});

export { handler as GET, handler as POST };
