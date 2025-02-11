import { AppSidebar } from '@/components/app-sidebar'
import Header from '@/components/header'
import { SidebarInset, SidebarProvider } from '@/components/ui/sidebar'

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <Header />
        <div className="w-full flex-1">{children}</div>
      </SidebarInset>
    </SidebarProvider>
  )
}
