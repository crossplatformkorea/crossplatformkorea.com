import {convexAuth} from '@convex-dev/auth/server';
import {
  ResendOtpEn,
  ResendOtpJa,
  ResendOtpKo,
} from './ResendOTP';

export const {auth, signIn, signOut, store, isAuthenticated} = convexAuth({
  providers: [
    ResendOtpEn,
    ResendOtpKo,
    ResendOtpJa,
  ],
});
