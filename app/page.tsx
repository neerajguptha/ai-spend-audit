import SpendForm from "@/components/SpendForm";

export default function Home() {
  return (
    <main className="min-h-screen bg-black text-white px-6 py-20">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-5xl font-bold text-center">
          Stop Overpaying for AI Tools
        </h1>

        <p className="mt-6 text-center text-zinc-400">
          Get a free AI spend audit for your startup.
        </p>

        <SpendForm />
      </div>
    </main>
  );
}