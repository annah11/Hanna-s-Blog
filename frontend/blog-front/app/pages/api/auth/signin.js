import { signIn } from 'next-auth/react';

const SignIn = () => (
  <div>
    <h1>Sign In</h1>
    <button onClick={() => signIn('credentials')}>Sign In</button>
  </div>
);

export default SignIn;
