export const metadata = {
  title: 'Adopt Me - ระบบหาบ้านและรับเลี้ยงสัตว์',
  description: 'ระบบหาบ้านและรับเลี้ยงสัตว์เลี้ยงสำหรับ Adopter และ Caretaker',
};

export default function RootLayout({ children }) {
  return (
    <html lang="th">
      <head>
        <meta charSet="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      </head>
      <body>{children}</body>
    </html>
  );
}
