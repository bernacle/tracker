export default function AuthLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <div className="flex min-h-[calc(100vh-64px)] flex-col items-center justify-start px-4 pt-16">
      <div className="w-full max-w-xs">{children}</div>
    </div>
  )
}
