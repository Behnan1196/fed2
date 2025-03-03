export default function ChatLayout({ children }: { children: React.ReactNode }) {
  return (
    <section>
      <h2>Stream Chat</h2>
      {children}
    </section>
  );
}
