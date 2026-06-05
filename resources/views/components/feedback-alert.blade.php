@props([
    'type' => 'success', // success, danger, warning, info
    'message' => null
])

@php
    $config = [
        'success' => [
            'bg' => 'bg-green-50 border-green-200 text-green-800',
            'icon' => '<svg class="h-5 w-5 text-green-600 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>'
        ],
        'danger' => [
            'bg' => 'bg-red-50 border-red-200 text-red-850',
            'icon' => '<svg class="h-5 w-5 text-red-655 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>'
        ],
        'warning' => [
            'bg' => 'bg-yellow-50 border-yellow-250 text-yellow-800',
            'icon' => '<svg class="h-5 w-5 text-yellow-600 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>'
        ],
        'info' => [
            'bg' => 'bg-blue-50 border-blue-200 text-blue-800',
            'icon' => '<svg class="h-5 w-5 text-blue-600 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>'
        ]
    ];

    $resolved = $config[$type] ?? $config['success'];
@endphp

<div {{ $attributes->merge(['class' => 'border rounded-[6px] p-3 flex items-start ' . $resolved['bg']]) }}>
    <div class="flex-shrink-0">
        {!! $resolved['icon'] !!}
    </div>
    <div class="text-sm font-semibold">
        {{ $message ?? $slot }}
    </div>
</div>
