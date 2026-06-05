@props([
    'type' => 'text',
    'name',
    'label' => null,
    'value' => null,
    'placeholder' => null,
    'options' => [], // Uniquement pour select
    'required' => false
])

<div class="w-full flex flex-col space-y-1">
    @if($label)
        <label for="{{ $name }}" class="text-sm font-semibold text-gray-700">
            {{ $label }} @if($required)<span class="text-red-600">*</span>@endif
        </label>
    @endif

    @if($type === 'select')
        <select 
            name="{{ $name }}" 
            id="{{ $name }}" 
            {{ $required ? 'required' : '' }} 
            {{ $attributes->merge(['class' => 'h-[44px] block w-full px-3 rounded-[6px] border border-gray-300 bg-white text-gray-900 shadow-sm focus:border-blue-900 focus:ring-1 focus:ring-blue-900 text-base transition duration-150']) }}
        >
            @if($placeholder)
                <option value="">{{ $placeholder }}</option>
            @endif
            @foreach($options as $val => $lbl)
                <option value="{{ $val }}" {{ (string) old($name, $value) === (string) $val ? 'selected' : '' }}>{{ $lbl }}</option>
            @endforeach
            {{ $slot }}
        </select>
    @else
        <input 
            type="{{ $type }}" 
            name="{{ $name }}" 
            id="{{ $name }}" 
            value="{{ old($name, $value) }}"
            placeholder="{{ $placeholder }}"
            {{ $required ? 'required' : '' }} 
            {{ $attributes->merge(['class' => 'h-[44px] block w-full px-3 rounded-[6px] border border-gray-300 bg-white text-gray-900 shadow-sm focus:border-blue-900 focus:ring-1 focus:ring-blue-900 text-base transition duration-150']) }}
        />
    @endif

    @error($name)
        <p class="text-xs text-red-600 font-semibold mt-1">{{ $message }}</p>
    @enderror
</div>
