<?php

namespace App\Repositories;

use App\Models\Taxe;
use Illuminate\Database\Eloquent\Collection;

class TaxeRepository
{
    public function all(): Collection
    {
        return Taxe::all();
    }

    public function find(int $id): ?Taxe
    {
        return Taxe::find($id);
    }

    public function create(array $data): Taxe
    {
        return Taxe::create($data);
    }

    public function update(int $id, array $data): bool
    {
        $taxe = $this->find($id);
        if ($taxe) {
            return $taxe->update($data);
        }
        return false;
    }
}
