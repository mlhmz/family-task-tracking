interface LoadingScreenProps {
  textContent: string;
}

export function LoadingScreen({ textContent }: LoadingScreenProps) {
  return (
    <div>
      <h1>{textContent}</h1>
    </div>
  );
}
