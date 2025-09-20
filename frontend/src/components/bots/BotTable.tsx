import  { useState } from 'react';
import { Edit2, Trash2, Copy, Check } from 'lucide-react';
import { Button } from '../ui/Button';
import { Modal } from '../ui/Modal';
import { copyToClipboard } from '../../utils/clipboard';
import type { Bot } from '../../types';

interface BotTableProps {
  bots: Bot[];
  onEdit: (bot: Bot) => void;
  onDelete: (uid: string) => void;
  loading: boolean;
}

export function BotTables({ bots, onEdit, onDelete, loading }: BotTableProps) {
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [botToDelete, setBotToDelete] = useState<Bot | null>(null);
  const [copiedUid, setCopiedUid] = useState<string | null>(null);

  const handleDeleteClick = (bot: Bot) => {
    setBotToDelete(bot);
    setDeleteModalOpen(true);
  };

  const handleDeleteConfirm = () => {
    if (botToDelete) {
      onDelete(botToDelete.uid);
      setBotToDelete(null);
      setDeleteModalOpen(false);
    }
  };

  const handleDeleteCancel = () => {
    setBotToDelete(null);
    setDeleteModalOpen(false);
  };

  const handleCopyUid = async (uid: string) => {
    const success = await copyToClipboard(uid);
    if (success) {
      setCopiedUid(uid);
      setTimeout(() => setCopiedUid(null), 2000);
    }
  };

  return (
    <>
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
        <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
            Existing Bots
          </h3>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 dark:bg-gray-700">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Name
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Bot UID
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Model
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
              {bots.length === 0 ? (
                <tr>
                  <td colSpan={4} className="px-6 py-8 text-center text-gray-500 dark:text-gray-400">
                    No bots created yet. Create your first bot using the form on the left.
                  </td>
                </tr>
              ) : (
                bots.map((bot) => (
                  <tr key={bot.uid} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900 dark:text-gray-100">
                        {bot.name}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center space-x-2">
                        <code className="text-sm bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded font-mono">
                          {bot.uid}
                        </code>
                        <Button
                          variant="secondary"
                          size="sm"
                          onClick={() => handleCopyUid(bot.uid)}
                          className="p-1"
                          title="Copy to clipboard"
                        >
                          {copiedUid === bot.uid ? (
                            <Check className="h-3 w-3 text-green-600" />
                          ) : (
                            <Copy className="h-3 w-3" />
                          )}
                        </Button>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900 dark:text-gray-100">
                        {bot.llm_model_name || 'Not specified'}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center space-x-2">
                        <Button
                          variant="secondary"
                          size="sm"
                          onClick={() => onEdit(bot)}
                          className="p-2"
                          title="Edit bot"
                          disabled={loading}
                        >
                          <Edit2 className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="danger"
                          size="sm"
                          onClick={() => handleDeleteClick(bot)}
                          className="p-2"
                          title="Delete bot"
                          disabled={loading}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      <Modal
        isOpen={deleteModalOpen}
        onClose={handleDeleteCancel}
        title="Confirm Deletion"
        actions={
          <>
            <Button
              variant="secondary"
              onClick={handleDeleteCancel}
            >
              Cancel
            </Button>
            <Button
              variant="danger"
              onClick={handleDeleteConfirm}
              loading={loading}
            >
              Delete Bot
            </Button>
          </>
        }
      >
        <p className="text-gray-700 dark:text-gray-300">
          Are you sure you want to delete the bot "{botToDelete?.name}"? 
          This action cannot be undone.
        </p>
      </Modal>
    </>
  );
}