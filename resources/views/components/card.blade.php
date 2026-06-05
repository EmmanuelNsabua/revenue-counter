@props([
    'title' => null,
])

<div {{ $attributes->merge(['class' => 'bg-white p-4 border border-gray-200 rounded-[6px] shadow-sm']) }}>
    @if($title)
        <div class="border-b border-gray-100 pb-3 mb-3">
            <h3 class="text-base font-bold text-gray-900">{{ $title }}</h3>
        </div>
    @endif
    {{ $slot }}
</div>
