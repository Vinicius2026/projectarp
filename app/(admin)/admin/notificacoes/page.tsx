import { createClient } from '@/lib/supabase/server'
import CreateNotificationButton from './_components/CreateNotificationButton'

export default async function NotificacoesPage() {
  const supabase = await createClient()
  const { data: notifications } = await supabase
    .from('notifications')
    .select('*')
    .order('created_at', { ascending: false })

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Notificações</h1>
          <p className="text-gray-600">Gerencie as notificações do sistema</p>
        </div>
        <CreateNotificationButton />
      </div>

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Título</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Mensagem</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tipo</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Enviadas</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Criado em</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {notifications?.map((n: any) => (
              <tr key={n.id} className="hover:bg-gray-50">
                <td className="px-6 py-3 font-medium text-gray-900">{n.title}</td>
                <td className="px-6 py-3 text-gray-700">{n.message}</td>
                <td className="px-6 py-3 text-gray-700">{n.target_type}</td>
                <td className="px-6 py-3 text-gray-700">{n.status}</td>
                <td className="px-6 py-3 text-gray-700">{n.sent_count} / {n.target_count}</td>
                <td className="px-6 py-3 text-gray-700">{new Date(n.created_at).toLocaleString('pt-BR')}</td>
              </tr>
            ))}
            {(!notifications || notifications.length === 0) && (
              <tr>
                <td className="px-6 py-8 text-center text-gray-500" colSpan={6}>Nenhuma notificação ainda</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}

