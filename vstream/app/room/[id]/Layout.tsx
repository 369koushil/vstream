import { Toaster } from "@/components/ui/sonner"
export default function Layout({
  children
}: {
  children: React.ReactNode;
  params: { id: string }; // 🛑 Params automatically passed
}) {
  return (
    <>
      <Toaster position="bottom-right" richColors duration={3000} />
      {children}
    </>
  );
}
