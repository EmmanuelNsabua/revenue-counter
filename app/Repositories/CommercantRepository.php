<?php

namespace App\Repositories;

use App\Models\Commercant;
use Illuminate\Database\Eloquent\Collection;

class CommercantRepository
{
    public function find(int $id): ?Commercant
    {
        return Commercant::find($id);
    }

    public function findByDocument(string $numeroDocument): ?Commercant
    {
        return Commercant::where('numero_document', $numeroDocument)->first();
    }

    public function getActive(): Collection
    {
        return Commercant::where('actif', true)->get();
    }

    public function search(string $query): Collection
    {
        return Commercant::where('nom', 'like', "%{$query}%")
            ->orWhere('numero_document', 'like', "%{$query}%")
            ->orWhere('emplacement', 'like', "%{$query}%")
            ->get();
    }

    public function create(array $data): Commercant
    {
        return Commercant::create($data);
    }

    public function update(int $id, array $data): bool
    {
        $commercant = $this->find($id);
        if ($commercant) {
            return $commercant->update($data);
        }
        return false;
    }
}
