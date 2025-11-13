import "./globals.css";
export const metadata = { title: "Fitted", description: "Meet Your Digital Twin" };
export default function RootLayout({children}:{children:React.ReactNode}) {
  return (<html lang="en"><body>{children}</body></html>);
}
