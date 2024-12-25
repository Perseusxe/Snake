import "./globals.css";

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <header className="header">
          <h1>Snake Game</h1>
        </header>
        <main className="main">{children}</main>

      </body>
    </html>
  );
}
