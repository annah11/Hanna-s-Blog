// app/layout.js
import { SessionProvider } from 'next-auth/react';
import Link from 'next/link';

export default function Layout({ children }) {
  return (
    <html lang="en">
      <head>
        <meta charSet="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <title>Blog App</title>
      </head>
      <body>
        <SessionProvider>
          <header>
            <nav>
              <ul>
                <li>
                  <Link href="/">Home</Link>
                </li>
                <li>
                  <Link href="/profile">Profile</Link>
                </li>
              </ul>
            </nav>
          </header>
          <main>{children}</main>
        </SessionProvider>
      </body>
    </html>
  );
}
