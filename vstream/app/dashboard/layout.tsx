import { Toaster } from "@/components/ui/sonner"
export default function Layout({
  children
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <Toaster position="bottom-right" richColors duration={4000} />
      {children}
    </>
  );
}
