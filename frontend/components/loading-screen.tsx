interface LoadingScreenProps {
  textContent: string;
}

export function LoadingScreen({ textContent }: LoadingScreenProps) {
  return (
    <div className="grid h-screen place-items-center">
      <div>
        <h1 className="text-2xl font-semibold">{textContent}</h1>
      </div>
    </div>
  );
}
