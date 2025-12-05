import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "../ui/empty";

interface EmptyOutlineProps {
  title: string;
  description: string;
  icon: React.ReactNode;
}

export function EmptyOutline({ title, description, icon }: EmptyOutlineProps) {
  return (
    <Empty className="w-full h-full border border-dashed">
      <EmptyHeader>
        <EmptyMedia variant="icon">{icon}</EmptyMedia>
        <EmptyTitle>{title}</EmptyTitle>
        <EmptyDescription>{description}</EmptyDescription>
      </EmptyHeader>
    </Empty>
  );
}
