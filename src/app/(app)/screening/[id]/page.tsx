import { redirect } from 'next/navigation';

export default function ScreeningRedirectPage({ params }: { params: { id: string } }) {
  redirect(`/candidates/${params.id}`);
}
