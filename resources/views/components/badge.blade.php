@props([
    'status'
])

@php
    $status = strtolower($status);
    
    $config = [
        'valide' => ['bg' => 'bg-green-100', 'text' => 'text-green-800', 'label' => 'Validé'],
        'paye' => ['bg' => 'bg-green-100', 'text' => 'text-green-800', 'label' => 'Payé'],
        
        'refuse' => ['bg' => 'bg-red-100', 'text' => 'text-red-800', 'label' => 'Refusé'],
        'non_paye' => ['bg' => 'bg-red-100', 'text' => 'text-red-800', 'label' => 'Non Payé'],
        
        'en_attente' => ['bg' => 'bg-yellow-100', 'text' => 'text-yellow-800', 'label' => 'En Attente'],
    ];

    $resolved = $config[$status] ?? ['bg' => 'bg-gray-100', 'text' => 'text-gray-800', 'label' => ucfirst($status)];
@endphp

<span class="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold {{ $resolved['bg'] }} {{ $resolved['text'] }}">
    {{ $resolved['label'] }}
</span>
