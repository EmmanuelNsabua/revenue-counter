@props([
    'variant' => 'primary',
    'type' => 'button',
    'disabled' => false
])

@php
    // Cible tactile terrain : hauteur minimale de 44px
    $baseStyles = 'h-[44px] min-h-[44px] px-4 py-2 rounded-[6px] font-medium transition duration-150 ease-in-out flex items-center justify-center text-sm shadow-sm select-none focus:outline-none focus:ring-2 focus:ring-offset-2';
    
    $variants = [
        'primary' => 'bg-blue-900 text-white hover:bg-blue-700 focus:ring-blue-500 disabled:bg-gray-300 disabled:text-gray-500 disabled:cursor-not-allowed',
        'secondary' => 'bg-white text-gray-900 border border-gray-200 hover:bg-gray-50 focus:ring-blue-500 disabled:bg-gray-100 disabled:text-gray-400 disabled:cursor-not-allowed',
        'danger' => 'bg-red-600 text-white hover:bg-red-700 focus:ring-red-500 disabled:bg-red-300 disabled:cursor-not-allowed',
    ];

    $classes = $baseStyles . ' ' . ($variants[$variant] ?? $variants['primary']);
@endphp

<button type="{{ $type }}" {{ $disabled ? 'disabled' : '' }} {{ $attributes->merge(['class' => $classes]) }}>
    {{ $slot }}
</button>
