export default function RoomLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col items-center justify-between py-16 animate-fade-in ">
      {children}
    </div>
  );
}
