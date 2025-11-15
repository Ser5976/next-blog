import { prisma } from '@/shared/api';
import { FormFaildDeletion } from '@/widgets/dashboard2/ui/form-faild-deletion';

export default async function FailedDeletionsPage() {
  const failed = await prisma.failedUserDeletion.findMany({
    where: { resolved: false },
    orderBy: { createdAt: 'desc' },
  });

  if (failed.length === 0)
    return <p className="p-4 text-gray-600">Нет неудачных удалений 🎉</p>;

  return (
    <div className="p-6 space-y-4">
      <h1 className="text-2xl font-semibold">Неудачные удаления</h1>
      {failed.map((item) => (
        <FormFaildDeletion item={item} key={item.id} />
      ))}
    </div>
  );
}
