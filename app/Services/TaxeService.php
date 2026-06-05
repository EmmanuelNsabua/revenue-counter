<?php

namespace App\Services;

use App\Repositories\TaxeRepository;
use App\Models\Taxe;
use Illuminate\Database\Eloquent\Collection;

class TaxeService
{
    protected TaxeRepository $taxeRepository;

    public function __construct(TaxeRepository $taxeRepository)
    {
        $this->taxeRepository = $taxeRepository;
    }

    public function obtenirToutes(): Collection
    {
        return $this->taxeRepository->all();
    }

    public function enregistrer(array $data): Taxe
    {
        return $this->taxeRepository->create($data);
    }

    public function modifier(int $id, array $data): bool
    {
        return $this->taxeRepository->update($id, $data);
    }
}
