import { createClient } from '@/lib/supabase/server'
import { Search } from 'lucide-react'
import Link from 'next/link'
import CreateAreaButton from './_components/CreateAreaButton'
import CreateModuleButton from './_components/CreateModuleButton'
import EditAreaButton from './_components/EditAreaButton'
import EditModuleButtons from './_components/EditModuleButtons'
import ModuleOrderInput from './_components/ModuleOrderInput'

export default async function ModulosPage() {
  const supabase = await createClient()

  // Buscar áreas
  const { data: areas } = await supabase
    .from('areas')
    .select('*')
    .order('order', { ascending: true })

  // Buscar módulos com suas áreas
  const { data: modules } = await supabase
    .from('modules')
    .select('*, areas(title)')
  
  // Ordenar módulos por área e depois por order (fazer no código pois Supabase não suporta múltiplos order)
  const sortedModules = modules?.sort((a, b) => {
    if (a.area_id !== b.area_id) {
      return (a.area_id || 0) - (b.area_id || 0)
    }
    const orderA = a.order || 999
    const orderB = b.order || 999
    return orderA - orderB
  })

  return (
    <div className="p-8">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-2 text-sm text-gray-500 mb-2">
          <span>Modulos</span>
        </div>
        <h1 className="text-3xl font-bold text-gray-900">Área e Módulos</h1>
        <p className="text-gray-600 mt-1">Gerencie e crie suas áreas e módulos aqui</p>
      </div>

      {/* Actions */}
      <div className="flex gap-4 mb-8">
        <CreateAreaButton />
        <CreateModuleButton areas={areas || []} />
      </div>

      {/* Áreas Cadastradas */}
      <div className="bg-white rounded-lg shadow mb-8">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-xl font-bold text-gray-900">Áreas Cadastradas</h2>
          <p className="text-sm text-gray-600 mt-1">
            Gerencie as áreas disponíveis para organizar seus módulos
          </p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Título
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Descrição
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Ordenação
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Criado em
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Atualizado em
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Ação
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {areas && areas.length > 0 ? (
                areas.map((area) => (
                  <tr key={area.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-blue-600">
                        {area.title}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-900">
                        {area.description}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {area.order}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Date().toLocaleDateString('pt-BR')}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Date().toLocaleDateString('pt-BR')}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <div className="flex items-center gap-2">
                        <EditAreaButton area={area} />
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-gray-500">
                    Nenhuma área cadastrada
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Módulos */}
      <div className="bg-white rounded-lg shadow">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-xl font-bold text-gray-900">Módulos</h2>
          <p className="text-sm text-gray-600 mt-1">
            Explore e gerencie todos os módulos disponíveis
          </p>
        </div>

        {/* Search and Filters */}
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Pesquisar módulos por título ou descrição..."
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
              />
            </div>
            <button className="px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 flex items-center gap-2">
              <span>Filtros</span>
            </button>
          </div>
        </div>

        {/* Modules Grid - Agrupado por Área */}
        <div className="p-6">
          <p className="text-sm text-gray-600 mb-6">
            {sortedModules?.length || 0} módulos encontrados
          </p>

          {/* Agrupar módulos por área */}
          {areas && areas.length > 0 ? (
            areas.map((area) => {
              const areaModules = sortedModules?.filter((m) => m.area_id === area.id) || []
              const maxOrder = Math.max(...areaModules.map(m => m.order || 0), 0)

              return (
                <div key={area.id} className="mb-8">
                  <div className="mb-4 pb-2 border-b border-gray-200">
                    <h3 className="text-lg font-bold text-gray-900">{area.title}</h3>
                    <p className="text-sm text-gray-600">{areaModules.length} módulo(s)</p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {areaModules.length > 0 ? (
                      areaModules.map((module) => (
                        <div key={module.id} className="border rounded-lg overflow-hidden hover:shadow-lg transition">
                          {/* Thumbnail */}
                          <div className="aspect-[9/16] bg-gradient-to-br from-pink-400 to-purple-500 relative overflow-hidden">
                            {module.thumbnail_url ? (
                              // eslint-disable-next-line @next/next/no-img-element
                              <img 
                                src={module.thumbnail_url} 
                                alt={module.title}
                                className="absolute inset-0 w-full h-full object-cover"
                                draggable={false}
                              />
                            ) : (
                              <div className="absolute inset-0 flex items-center justify-center text-white text-2xl font-bold">
                                #{module.id}
                              </div>
                            )}
                          </div>

                          {/* Content */}
                          <div className="p-4">
                            <h3 className="font-bold text-lg text-gray-900 mb-2">
                              {module.title}
                            </h3>
                            <p className="text-sm text-gray-600 mb-4">
                              {module.description}
                            </p>

                            {/* Area Badge e Ordem */}
                            <div className="flex items-center justify-between mb-4">
                              <span className="px-3 py-1 text-xs font-medium bg-blue-100 text-blue-800 rounded-full">
                                {module.areas?.title || 'Sem área'}
                              </span>
                              <ModuleOrderInput 
                                moduleId={module.id} 
                                currentOrder={module.order}
                                areaId={area.id}
                                maxOrder={maxOrder}
                              />
                            </div>

                            {/* Plans */}
                            <div className="mb-4">
                              <p className="text-xs text-gray-500 uppercase mb-2">Planos disponíveis</p>
                              <div className="flex gap-2">
                                {(module.plan_access || 'Gratuito')
                                  .split(',')
                                  .map((p: string) => (
                                    <span key={p} className="px-2 py-1 text-xs bg-gray-100 rounded">
                                      {p.trim()}
                                    </span>
                                  ))}
                              </div>
                            </div>

                            {/* Actions */}
                            <div className="flex gap-2">
                              <Link 
                                href={`/admin/modulos/${module.id}`}
                                className="flex-1 px-4 py-2 bg-blue-600 text-white text-sm text-center rounded-lg hover:bg-blue-700"
                              >
                                Acessar aulas
                              </Link>
                              <EditModuleButtons module={module} areas={areas || []} />
                            </div>
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="col-span-3 py-8 text-center text-gray-500 text-sm">
                        Nenhum módulo nesta área
                      </div>
                    )}
                  </div>
                </div>
              )
            })
          ) : (
            <div className="py-12 text-center text-gray-500">
              Nenhum módulo encontrado
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

