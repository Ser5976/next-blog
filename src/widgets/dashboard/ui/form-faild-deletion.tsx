'use client';

import { deleteUser } from '../model/faild-deletion-action';

interface IFormFaildDeletion {
  id: string;
  clerkId: string;
  error: string;
  createdAt: Date;
  resolved: boolean;
}

export const FormFaildDeletion = ({ item }: { item: IFormFaildDeletion }) => {
  return (
    <div className=" flex gap-4">
      <form
        action={() => deleteUser(item.clerkId)}
        className="border rounded-lg p-3 flex items-center justify-between w-full"
      >
        <div>
          <p>
            🧑 Clerk ID: <b>{item.clerkId}</b>
          </p>
          <p className="text-sm text-gray-500">{item.error}</p>
          <p className="text-xs text-gray-400">
            {new Date(item.createdAt).toLocaleString()}
          </p>
        </div>
        <button
          type="submit"
          className="px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700"
        >
          Удалить
        </button>
      </form>
    </div>
  );
};
