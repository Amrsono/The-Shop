import { AdminSidebar } from '@/components/admin/AdminSidebar';

export default function AdminLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="flex min-h-screen bg-transparent relative">
            <AdminSidebar />
            <main className="flex-1 ml-64 p-12 transition-all duration-500">
                <div className="max-w-7xl mx-auto pb-20">
                    {children}
                </div>
            </main>
        </div>
    );
}
