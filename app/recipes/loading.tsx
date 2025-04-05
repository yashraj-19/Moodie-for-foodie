import DashboardHeader from "@/components/dashboard-header"

export default function Loading() {
  return (
    <div className="min-h-screen bg-gray-50">
      <DashboardHeader />

      <main className="container mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
          <div>
            <div className="h-8 w-48 bg-gray-200 rounded animate-pulse mb-2" />
            <div className="h-4 w-64 bg-gray-200 rounded animate-pulse" />
          </div>
          <div className="flex space-x-2 w-full md:w-auto">
            <div className="h-10 bg-gray-200 rounded animate-pulse w-full md:w-[300px]" />
            <div className="h-10 w-10 bg-gray-200 rounded animate-pulse" />
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Filters Sidebar Skeleton */}
          <div className="space-y-6">
            <div className="bg-white rounded-lg shadow-sm p-6">
              <div className="h-6 w-32 bg-gray-200 rounded animate-pulse mb-4" />

              <div className="space-y-4">
                {[1, 2, 3, 4, 5].map((i) => (
                  <div key={i} className="space-y-2">
                    <div className="h-5 w-full bg-gray-200 rounded animate-pulse" />
                    <div className="h-4 w-full bg-gray-200 rounded animate-pulse opacity-70" />
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Main Content Skeleton */}
          <div className="lg:col-span-3 space-y-6">
            <div className="bg-white rounded-lg shadow-sm p-6">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
                <div className="h-10 w-48 bg-gray-200 rounded animate-pulse" />
                <div className="h-10 w-36 bg-gray-200 rounded animate-pulse" />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {Array.from({ length: 9 }).map((_, i) => (
                  <div key={i} className="overflow-hidden rounded-lg border bg-white shadow">
                    <div className="aspect-video bg-gray-200 animate-pulse" />
                    <div className="p-4">
                      <div className="h-6 bg-gray-200 rounded animate-pulse mb-2" />
                      <div className="flex items-center text-sm text-gray-500 space-x-4 mb-3">
                        <div className="h-4 w-24 bg-gray-200 rounded animate-pulse" />
                        <div className="h-4 w-24 bg-gray-200 rounded animate-pulse" />
                      </div>
                      <div className="flex items-center mt-3">
                        <div className="flex space-x-1">
                          {[...Array(5)].map((_, j) => (
                            <div key={j} className="w-4 h-4 bg-gray-200 rounded animate-pulse" />
                          ))}
                        </div>
                        <div className="h-4 w-16 bg-gray-200 rounded animate-pulse ml-2" />
                      </div>
                    </div>
                    <div className="p-4 pt-0 flex justify-between">
                      <div className="h-8 w-16 bg-gray-200 rounded animate-pulse" />
                      <div className="h-8 w-16 bg-gray-200 rounded animate-pulse" />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}

