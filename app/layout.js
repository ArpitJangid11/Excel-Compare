// import "@tailwindcss/postcss";
import "../styles/globals.css";

export default function DashboardLayout({ children }) {
  return (
    <html lang='en'>
      <body>
        <main>{children}</main>
      </body>
    </html>
  );
}
