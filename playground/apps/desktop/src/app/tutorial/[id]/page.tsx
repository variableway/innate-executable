import TutorialContent from "./TutorialContent";
import { getBuiltinTutorialsSync } from "@/lib/tutorial-scanner";

export function generateStaticParams() {
  return getBuiltinTutorialsSync().map((tutorial) => ({ id: tutorial.slug }));
}

export default async function TutorialDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return <TutorialContent id={id} />;
}
