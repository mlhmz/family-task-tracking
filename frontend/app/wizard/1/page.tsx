import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function FirstWizardPage() {
  return (
    <div className="m-auto flex flex-col gap-2">
      <h1 className="m-auto text-6xl">✨</h1>
      <h3>Step 1</h3>
      <h2 className="text-2xl font-bold">Create a Household</h2>
      <Input placeholder="Household Name"></Input>
      <Button className="m-auto">Next</Button>
    </div>
  );
}
