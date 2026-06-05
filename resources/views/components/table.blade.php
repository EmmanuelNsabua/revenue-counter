@props([
    'headers' => []
])

<div class="overflow-x-auto border border-gray-200 rounded-[6px]">
    <table class="min-w-full divide-y divide-gray-200 text-left">
        <thead class="bg-gray-50">
            <tr>
                @foreach($headers as $header)
                    <th scope="col" class="px-4 py-3 text-xs font-bold text-gray-900 uppercase tracking-wider">
                        {{ $header }}
                    </th>
                @endforeach
            </tr>
        </thead>
        <tbody class="bg-white divide-y divide-gray-200 text-sm">
            {{ $slot }}
        </tbody>
    </table>
</div>
